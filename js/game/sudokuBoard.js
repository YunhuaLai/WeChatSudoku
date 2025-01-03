import { placeNumber as handlePlaceNumber, placeMark as handlePlaceMark, undoLastMove as handleUndoLastMove } from './moveHandler';

export default class SudokuBoard {
    constructor() {
        this.grid = [];  // Sudoku grid
        this.originalGrid = [];  // Unsolved grid
        this.mistakes = {};  // Mistakes (highlighted in red)
        this.moveHistory = [];  // Track player moves for undo
        this.marks = {};  // Store candidate marks for each cell
        this.size = 9;  // Standard 9x9 grid
        this.markingMode = false;  // Marking mode toggle
    }
    
    init() {
        this.grid = this.generateSudoku();
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.mistakes = {};  // Reset mistakes when restarting
    
        // Ensure the grid is properly populated
        if (!this.grid || this.grid.length !== this.size) {
            console.error("Grid failed to initialize.");
            this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        }
    }
    
    /**
     * 生成一个有效的数独棋盘
     */
    generateSudoku() {
        let board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.fillBoard(board);
        this.removeNumbers(board);
    
        // Check if the board was properly filled
        if (!board || board.length !== this.size || !board[0]) {
            console.error("Failed to generate Sudoku board.");
            return Array.from({ length: this.size }, () => Array(this.size).fill(0));
        }
        return board;
    }
    
  
    /**
     * 填充完整的数独棋盘
     */
    fillBoard(board) {
      const fill = (row, col) => {
        if (row === this.size) return true;
        if (col === this.size) return fill(row + 1, 0);
        if (board[row][col] !== 0) return fill(row, col + 1);
  
        for (let num = 1; num <= this.size; num++) {
          if (this.isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fill(row, col + 1)) return true;
            board[row][col] = 0;  // 回溯
          }
        }
        return false;
      };
  
      fill(0, 0);
    }
  
    /**
     * 随机删除棋盘上的数字，形成谜题
     */
    removeNumbers(board) {
      let attempts = 30;  // 控制难度
      while (attempts > 0) {
        const row = Math.floor(Math.random() * this.size);
        const col = Math.floor(Math.random() * this.size);
        if (board[row][col] !== 0) {
          const backup = board[row][col];
          board[row][col] = 0;
          const copy = JSON.parse(JSON.stringify(board));
          if (!this.hasUniqueSolution(copy)) {
            board[row][col] = backup;  // 恢复原值
          }
          attempts--;
        }
      }
    }
  
    /**
     * 检查数独是否只有一个解
     */
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
  
    /**
     * 检查是否可以在指定位置放置数字
     */
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
    
    /**
     * 检查数独是否完成
     */
    isComplete() {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.grid[row][col] === 0) return false;
        }
      }
      return true;
    }
  
    /**
     * 检查在指定位置放置数字是否有效
     * @param {Array} board 当前棋盘
     * @param {number} row 行号
     * @param {number} col 列号
     * @param {number} num 填入的数字
     */
    isValid(board, row, col, num) {
        // Row and Column Validation
        for (let i = 0; i < this.size; i++) {
            if ((board[row][i] === num && i !== col) || 
                (board[i][col] === num && i !== row)) {
                return false;
            }
        }
    
        // 3x3 Grid Validation
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
    
    placeSelectedNumber(x, y) {
        const boardSize = Math.min(canvas.width * 0.9, canvas.height * 0.7);
        const startX = (canvas.width - boardSize) / 2;
        const startY = canvas.height * 0.15;
        const cellSize = boardSize / this.size;
        
        if (x >= startX && x <= startX + boardSize && y >= startY && y <= startY + boardSize) {
            const col = Math.floor((x - startX) / cellSize);
            const row = Math.floor((y - startY) / cellSize);
        
            const selectedNumber = GameGlobal.databus.selectedNumber;
            if (selectedNumber) {
                this.placeNumber(row, col, selectedNumber);  // Always place the number
                console.log(`Placed ${selectedNumber} at row: ${row}, col: ${col}`);
            } else {
                console.log("No number selected!");
            }
        } else {
            console.log("Touched outside the board.");
        }
    }
  }
  