export function generateSudoku(size = 9) {
    let board = Array.from({ length: size }, () => Array(size).fill(0));
    fillBoard(board, size);
    removeNumbers(board, size);

    if (!board || board.length !== size || !board[0]) {
        console.error("Failed to generate Sudoku board.");
        return Array.from({ length: size }, () => Array(size).fill(0));
    }
    return board;
}

function fillBoard(board, size) {
    const fill = (row, col) => {
        if (row === size) return true;
        if (col === size) return fill(row + 1, 0);
        if (board[row][col] !== 0) return fill(row, col + 1);

        for (let num = 1; num <= size; num++) {
            if (isValid(board, row, col, num, size)) {
                board[row][col] = num;
                if (fill(row, col + 1)) return true;
                board[row][col] = 0;  // Backtrack
            }
        }
        return false;
    };
    fill(0, 0);
}

function removeNumbers(board, size) {
    let attempts = 30;
    while (attempts > 0) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (board[row][col] !== 0) {
            const backup = board[row][col];
            board[row][col] = 0;
            const copy = JSON.parse(JSON.stringify(board));
            if (!hasUniqueSolution(copy, size)) {
                board[row][col] = backup;
            }
            attempts--;
        }
    }
}

export function isValid(board, row, col, num, size) {
    for (let i = 0; i < size; i++) {
        if ((board[row][i] === num && i !== col) ||
            (board[i][col] === num && i !== row)) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num &&
                (startRow + r !== row || startCol + c !== col)) {
                return false;
            }
        }
    }
    return true;
}

function hasUniqueSolution(board, size) {
    let solutions = 0;

    const solve = (row, col) => {
        if (row === size) {
            solutions++;
            return solutions === 1;
        }
        if (col === size) return solve(row + 1, 0);
        if (board[row][col] !== 0) return solve(row, col + 1);

        for (let num = 1; num <= size; num++) {
            if (isValid(board, row, col, num, size)) {
                board[row][col] = num;
                if (solve(row, col + 1)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    };

    solve(0, 0);
    return solutions === 1;
}
