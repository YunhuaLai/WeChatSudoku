export function generateSudoku(size = 9, difficulty = 'medium') {
    let board = Array.from({ length: size }, () => Array(size).fill(0));
    fillBoard(board, size);  // Fill the board fully
    const solution = JSON.parse(JSON.stringify(board));  // Store the solution

    removeNumbers(board, size, difficulty);

    // Ensure the board is filled correctly
    if (!board || board.length !== size || !board[0]) {
        console.error("Failed to generate Sudoku board.");
        return Array.from({ length: size }, () => Array(size).fill(0));
    }
    return { board, solution };
}

// Fill the Sudoku board with valid numbers using backtracking
function fillBoard(board, size) {
    const fill = (row, col) => {
        if (row === size) return true;
        if (col === size) return fill(row + 1, 0);
        if (board[row][col] !== 0) return fill(row, col + 1);

        const numbers = shuffle(Array.from({ length: size }, (_, i) => i + 1));  // Randomize numbers

        for (let num of numbers) {
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

// Randomly remove cells based on difficulty level
function removeNumbers(board, size, difficulty) {
    let attempts = getAttempts(difficulty);  // Set attempts based on difficulty

    while (attempts > 0) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        if (board[row][col] !== 0) {
            const backup = board[row][col];
            board[row][col] = 0;
            const copy = JSON.parse(JSON.stringify(board));

            // Only keep the removal if the board has a unique solution
            if (!hasUniqueSolution(copy, size)) {
                board[row][col] = backup;  // Revert if solution isn't unique
            } else {
                attempts--;
            }
        }
    }
}

// Get number of cells to remove based on difficulty
function getAttempts(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 30;  // Fewer cells removed
        case 'medium':
            return 40;
        case 'hard':
            return 50;  // More cells removed
        case 'expert':
            return 58;  // Extreme difficulty
        default:
            return 40;  // Default to medium if difficulty not recognized
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

// Shuffle function to randomize the order of numbers
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}