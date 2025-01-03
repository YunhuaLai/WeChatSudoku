export function placeNumber(sudokuBoard, x, y, value) {
    console.log(`Attempting to place ${value} at [${x}, ${y}]`);

    if (sudokuBoard.markingMode) {
        placeMark(sudokuBoard, x, y, value);  // Place candidate mark if marking mode is on
    } else {
        if (sudokuBoard.originalGrid[x][y] !== 0) {
            console.log("This cell cannot be changed.");
            return;
        }

        // Save current marks before placing number
        const previousMarks = sudokuBoard.marks[`${x},${y}`] 
            ? new Set(sudokuBoard.marks[`${x},${y}`]) 
            : null;

        // Store move in history (includes marks)
        sudokuBoard.moveHistory.push({
            type: 'number',
            x,
            y,
            previousValue: sudokuBoard.grid[x][y],  // Previous grid value
            previousMarks  // Save current marks for undo
        });

        // Place the number and delete marks
        sudokuBoard.grid[x][y] = value;
        delete sudokuBoard.marks[`${x},${y}`];

        GameGlobal.databus.lastPlacement = { row: x, col: y };

        // Handle mistakes
        if (!sudokuBoard.isValid(sudokuBoard.grid, x, y, value)) {
            sudokuBoard.mistakes[`${x},${y}`] = true;
            GameGlobal.databus.errors += 1;
            console.log(`Error! ${value} is invalid at [${x}, ${y}].`);
        } else {
            delete sudokuBoard.mistakes[`${x},${y}`];
        }
    }
}

export function placeMark(sudokuBoard, x, y, value) {
    // Prevent marking in cells that already have a number
    if (sudokuBoard.grid[x][y] !== 0) {
        console.log(`Cannot place mark ${value} at [${x}, ${y}] – cell already filled.`);
        return;
    }

    const key = `${x},${y}`;
    const previousMarks = new Set(sudokuBoard.marks[key] || []);

    // Store the state for undo
    sudokuBoard.moveHistory.push({
        type: 'mark',
        x,
        y,
        value,
        previousMarks: new Set(previousMarks)  // Save current marks
    });

    if (!sudokuBoard.marks[key]) {
        sudokuBoard.marks[key] = new Set();
    }

    // Toggle the mark (add/remove)
    if (sudokuBoard.marks[key].has(value)) {
        sudokuBoard.marks[key].delete(value);
    } else {
        sudokuBoard.marks[key].add(value);
    }
    console.log(`Marks at [${x}, ${y}]:`, Array.from(sudokuBoard.marks[key]));
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