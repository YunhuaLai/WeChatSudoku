export function placeNumber(sudokuBoard, col, row, value) {
    console.log(`Attempting to place ${value} at [row: ${row}, col: ${col}]`);

    // Prevent overwriting initial values
    if (sudokuBoard.originalGrid[row][col] !== 0) {
        console.log("This cell cannot be changed.");
        return;
    }

    const key = `${row},${col}`;
    const previousMarks = sudokuBoard.marks[key] ? new Set(sudokuBoard.marks[key]) : null;

    sudokuBoard.moveHistory.push({
        type: 'number',
        x: row,  // Store row as x (to align with Sudoku grid logic)
        y: col,  // Store col as y
        previousValue: sudokuBoard.grid[row][col],
        previousMarks
    });

    // Place the number and clear any marks
    sudokuBoard.grid[row][col] = value;
    delete sudokuBoard.marks[key];

    GameGlobal.databus.updateCell(col, row, value); 
    GameGlobal.databus.lastPlacement = { row, col };

    // Validate placement
    if (!sudokuBoard.isValid(sudokuBoard.grid, row, col, value)) {
        sudokuBoard.mistakes[key] = true;
        GameGlobal.databus.errors += 1;
        console.log(`Error! ${value} is invalid at [${row}, ${col}].`);
    } else {
        delete sudokuBoard.mistakes[key];
    }
}

export function placeMark(sudokuBoard, col, row, value) {
    const key = `${row},${col}`;

    // Prevent marking in cells that already have a number
    if (sudokuBoard.grid[row][col] !== 0) {
        console.log(`Cannot place mark ${value} at [${row}, ${col}] – cell already filled.`);
        return;
    }

    const previousMarks = new Set(sudokuBoard.marks[key] || []);

    // Store the mark change for undo
    sudokuBoard.moveHistory.push({
        type: 'mark',
        x: row,  // Save as row
        y: col,  // Save as col
        value,
        previousMarks: new Set(previousMarks)
    });

    if (!sudokuBoard.marks[key]) {
        sudokuBoard.marks[key] = new Set();
    }

    // Toggle mark (remove if exists, add if not)
    if (sudokuBoard.marks[key].has(value)) {
        sudokuBoard.marks[key].delete(value);
        console.log(`Removed mark ${value} at [${row}, ${col}]`);
    } else {
        sudokuBoard.marks[key].add(value);
        console.log(`Added mark ${value} at [${row}, ${col}]`);
    }
}

export function undoLastMove(sudokuBoard) {
    if (sudokuBoard.moveHistory.length > 0) {
        const lastMove = sudokuBoard.moveHistory.pop();
        const { x, y } = lastMove;
        const key = `${x},${y}`;

        if (lastMove.type === 'erase') {
            // Restore the erased cell
            sudokuBoard.grid[y][x] = lastMove.previousValue;
            
            if (lastMove.previousMarks) {
                sudokuBoard.marks[key] = new Set(lastMove.previousMarks);
            } else {
                delete sudokuBoard.marks[key];
            }

            console.log(`Undo Erase: Restored [${x}, ${y}] to ${lastMove.previousValue}`);
        } else if (lastMove.type === 'number') {
            // Undo a number placement
            sudokuBoard.grid[x][y] = lastMove.previousValue;
            
            if (lastMove.previousMarks) {
                sudokuBoard.marks[key] = new Set(lastMove.previousMarks);
            } else {
                delete sudokuBoard.marks[key];
            }

            console.log(`Undo Number: Restored [${x}, ${y}] to ${lastMove.previousValue}`);
        } else if (lastMove.type === 'mark') {
            // Undo a mark placement
            if (lastMove.previousMarks) {
                sudokuBoard.marks[key] = new Set(lastMove.previousMarks);
            } else {
                delete sudokuBoard.marks[key];
            }

            console.log(`Undo Mark at [${x}, ${y}].`);
        }
        GameGlobal.databus.autoSaveGame(); 
    } else {
        console.log("No moves to undo.");
    }
}

export function eraseSelectedCell(sudokuBoard) {
    const selectedCell = GameGlobal.databus.selectedCell;
    
    if (selectedCell) {
        const { x, y } = selectedCell;
        const key = `${y},${x}`;
        
        // Save current state for undo
        sudokuBoard.moveHistory.push({
            type: 'erase',
            x,
            y,
            previousValue: sudokuBoard.grid[y][x],  // Save the current value
            previousMarks: sudokuBoard.marks[key] ? new Set(sudokuBoard.marks[key]) : null  // Save marks if they exist
        });

        // Perform the erase
        sudokuBoard.grid[y][x] = 0;  // Clear the cell
        delete sudokuBoard.marks[key];  // Remove marks  
        GameGlobal.databus.autoSaveGame(); // Trigger auto-save
        
        console.log(`Erased cell at [${x}, ${y}]. Move saved to history.`);
    } else {
        console.log("No cell selected to erase.");
    }
}

export function provideHint() {
    const selectedCell = GameGlobal.databus.selectedCell;
    if (selectedCell) {
        const { x, y } = selectedCell;
        if (this.grid[y][x] === 0) {
            this.grid[y][x] = this.originalGrid[y][x];  // Fill in the correct value
            console.log(`Hint placed at [${x}, ${y}]: ${this.originalGrid[y][x]}`);
        } else {
            console.log("Cell already filled.");
        }
    } else {
        console.log("No cell selected for hint.");
    }
}