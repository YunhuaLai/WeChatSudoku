export function placeNumber(sudokuBoard, row, col, value) {
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

export function placeMark(sudokuBoard, row, col, value) {
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

        if (lastMove.type === 'number') {
            const { x, y, previousValue, previousMarks } = lastMove;

            // Restore the previous number in the grid
            sudokuBoard.grid[x][y] = previousValue;

            // Restore marks if they existed
            if (previousMarks) {
                sudokuBoard.marks[`${x},${y}`] = new Set(previousMarks);
            } else {
                delete sudokuBoard.marks[`${x},${y}`];
            }

            delete sudokuBoard.mistakes[`${x},${y}`];
            GameGlobal.databus.lastPlacement = { row: x, col: y };

            console.log(`Undo: Replacing [${x}, ${y}] with ${previousValue}`);
        } else if (lastMove.type === 'mark') {
            // Handle undo for marks
            const { x, y, previousMarks } = lastMove;
            if (previousMarks.size > 0) {
                sudokuBoard.marks[`${x},${y}`] = new Set(previousMarks);
            } else {
                delete sudokuBoard.marks[`${x},${y}`];
            }
            console.log(`Undo mark at [${x}, ${y}]`);
        }
    } else {
        console.log("No moves to undo.");
    }
}