import { placeNumber as handlePlaceNumber, placeMark as handlePlaceMark, undoLastMove as handleUndoLastMove, eraseSelectedCell as handleErase} from './moveHandler';
import DataBus from '../databus';  // Import DataBus instance
const databus = new DataBus();  // Singleton instance of DataBus


export default class SudokuBoard {
    constructor() {
        this.grid = [];  // Sudoku grid
        this.originalGrid = [];  // Unsolved grid
        this.solution = [];  
        this.mistakes = {};
        this.moveHistory = [];
        this.marks = {};
        this.size = 9;
        this.markingMode = false;
    }

    init() {
        this.grid = this.generateSudoku();
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.mistakes = {};
        if (!this.grid || this.grid.length !== this.size) {
            console.error("Grid failed to initialize.");
            this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        }
        databus.setSudokuGrid(this.grid, this.solution);
    }
    
    generateSudoku() {
        let board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.fillBoard(board);
        this.removeNumbers(board);
    
        // Check if the board was properly filled
        if (!board || board.length !== this.size || !board[0]) {
            console.error("Failed to generate Sudoku board.");
            return Array.from({ length: this.size }, () => Array(this.size).fill(0));
        }
        this.solution = JSON.parse(JSON.stringify(board)); 
        return board;
    }
    
    fillBoard(board) {
        const fill = (row, col) => {
            if (row === this.size) return true;
            if (col === this.size) return fill(row + 1, 0);
            if (board[row][col] !== 0) return fill(row, col + 1);

            for (let num = 1; num <= this.size; num++) {
                if (this.isValid(board, row, col, num)) {
                    board[row][col] = num;
                    if (fill(row, col + 1)) return true;
                    board[row][col] = 0;  // Backtrack
                }
            }
            return false;
        };
        fill(0, 0);
    }

    removeNumbers(board) {
        let attempts = 30;
        while (attempts > 0) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            if (board[row][col] !== 0) {
                const backup = board[row][col];
                board[row][col] = 0;
                const copy = JSON.parse(JSON.stringify(board));
                if (!this.hasUniqueSolution(copy)) {
                    board[row][col] = backup;
                }
                attempts--;
            }
        }
    }

    isValid(board, row, col, num) {
        for (let i = 0; i < this.size; i++) {
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
  
    hasUniqueSolution(board) {
        let solutions = 0;
        const solve = (row, col) => {
            if (row === this.size) {
            solutions++;
            return solutions === 1;
            }
            if (col === this.size) return solve(row + 1, 0);
            if (board[row][col] !== 0) return solve(row, col + 1);
    
            for (let num = 1; num <= this.size; num++) {
            if (this.isValid(board, row, col, num)) {
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

    // Toggle marking mode
    toggleMarkingMode() {
        this.markingMode = !this.markingMode;
        console.log(`Marking Mode: ${this.markingMode ? "ON" : "OFF"}`);
    }
  
    canPlaceNumber(x, y, value) {
      if (this.originalGrid[x][y] !== 0) return false;  // 初始格子不可修改
      return this.isValid(this.grid, x, y, value);
    }
    
    placeNumber(x, y, value) {
        handlePlaceNumber(this, x, y, value);  // Call imported placeNumber
    }
    
    undoLastMove() {
        handleUndoLastMove(this);  // Call imported undoLastMove
    }
    
    placeMark(x, y, value) {
        handlePlaceMark(this, x, y, value);  // Call imported placeMark
    }

    eraseSelectedCell() {
        handleErase(this);  // Call the imported erase function
    }
    
    isComplete() {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.grid[row][col] === 0) return false;
        }
      }
      return true;
    }

    highlightSameNumber() {
        const selectedCell = GameGlobal.databus.selectedCell;
        if (!selectedCell) return;
    
        const { x, y } = selectedCell;
        const currentNumber = this.grid[y][x];
    
        // Highlight the current number if present
        if (currentNumber !== 0) {
            GameGlobal.databus.setHighlightedNumber(currentNumber);
        } else {
            GameGlobal.databus.setHighlightedNumber(null);  // Reset if empty cell
        }
    }
    
    placeSelectedNumber(selectedNumber) {
        const selectedCell = GameGlobal.databus.selectedCell;
        const highlightedNumber = GameGlobal.databus.highlightedNumber;
    
        if (selectedCell) {
            const { x, y } = selectedCell;  // x = col, y = row
    
            if (this.markingMode) {
                this.placeMark(y, x, selectedNumber);  // y = row, x = col
            } 
            else {
                this.placeNumber(y, x, selectedNumber);  // y = row, x = col
            }
    
            console.log(`Placed ${selectedNumber} at row: ${y}, col: ${x}`);
        } else {
            console.log("No cell selected! Tap a cell first.");
        }
    }
}
  