import {
    renderBoard,
    renderNumbers,
    renderHighlight,
    renderNumberButtons,
    renderRedoButton
} from './renderSudoku';

export default class SudokuBoard {
    constructor() {
        this.grid = [];  // 9x9 Sudoku grid
        this.originalGrid = [];  // Initial unsolved grid
        this.mistakes = {};  // Track incorrect cells
        this.moveHistory = [];  // Store placed numbers for redo
        this.size = 9;
      }
    
      init() {
        this.grid = this.generateSudoku();
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.mistakes = {};  // Reset mistakes when restarting
      }
    
    /**
     * 生成一个有效的数独棋盘
     */
    generateSudoku() {
      let board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  
      this.fillBoard(board);  // 填充完整的棋盘
      this.removeNumbers(board);  // 删除部分数字，生成谜题
  
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
  
    /**
     * 检查是否可以在指定位置放置数字
     */
    canPlaceNumber(x, y, value) {
      if (this.originalGrid[x][y] !== 0) return false;  // 初始格子不可修改
      return this.isValid(this.grid, x, y, value);
    }
  
    /**
     * 在数独中放置数字
     */
    placeNumber(x, y, value) {
        console.log(`Attempting to place ${value} at [${x}, ${y}]`);
    
        // Prevent overwriting original numbers
        if (this.originalGrid[x][y] !== 0) {
            console.log("This cell cannot be changed. It's part of the original puzzle.");
            return;
        }
    
        // Store move for undo (track the previous value)
        this.moveHistory.push({ x, y, value: this.grid[x][y] });
    
        // Place the number temporarily
        this.grid[x][y] = value;
    
        // Track the last placement for highlighting
        GameGlobal.databus.lastPlacement = { row: x, col: y };
    
        // Validate placement using isValid
        if (!this.isValid(this.grid, x, y, value)) {
            this.mistakes[`${x},${y}`] = true;  // Mark mistake if invalid
            GameGlobal.databus.errors += 1;  // Increment error count
            console.log(`Error! ${value} is invalid at [${x}, ${y}]. Total errors: ${GameGlobal.databus.errors}`);
        } else {
            delete this.mistakes[`${x},${y}`];  // Remove mistake if corrected
            console.log(`Correct placement of ${value} at [${x}, ${y}]`);
        }
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
    
    undoLastMove() {
        if (this.moveHistory.length > 0) {
          const lastMove = this.moveHistory.pop();
          const { x, y, value } = lastMove;
      
          console.log(`Undo: Replacing [${x}, ${y}] with ${value}`);
          this.grid[x][y] = value;  // Restore the original value
      
          // Remove from mistakes if it was a wrong placement
          delete this.mistakes[`${x},${y}`];
      
          // Update the last placement for visual feedback
          GameGlobal.databus.lastPlacement = { row: x, col: y };
        } else {
          console.log("No moves to undo.");
        }
    }

    renderRedoButton(ctx, x, y, width) {
        const buttonSize = width / 2;
      
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(x + width / 4, y, buttonSize, buttonSize / 2);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x + width / 4, y, buttonSize, buttonSize / 2);
      
        ctx.fillStyle = '#000';
        ctx.font = `${buttonSize / 3}px Arial`;
        ctx.fillText("Undo", x + width / 2, y + buttonSize / 4);
        
        // Store redo button area for touch events
        this.redoButtonArea = {
          x: x + width / 4,
          y,
          width: buttonSize,
          height: buttonSize / 2
        };
    }
      

  }
  