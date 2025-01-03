

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
    
    /**
     * 在数独中放置数字
     */
    placeNumber(x, y, value) {
        console.log(`Attempting to place ${value} at [${x}, ${y}]`);

        if (this.markingMode) {
            this.placeMark(x, y, value);  // Place candidate mark if marking mode is on
        } else {
            // Standard number placement
            if (this.originalGrid[x][y] !== 0) {
                console.log("This cell cannot be changed.");
                return;
            }

            this.moveHistory.push({ x, y, value: this.grid[x][y] });
            this.grid[x][y] = value;
            GameGlobal.databus.lastPlacement = { row: x, col: y };

            if (!this.isValid(this.grid, x, y, value)) {
                this.mistakes[`${x},${y}`] = true;
                GameGlobal.databus.errors += 1;
                console.log(`Error! ${value} is invalid at [${x}, ${y}].`);
            } else {
                delete this.mistakes[`${x},${y}`];
            }
        }
    }

    // Place marks (small candidates)
    placeMark(x, y, value) {
        if (this.originalGrid[x][y] !== 0) return;

        const key = `${x},${y}`;
        if (!this.marks[key]) {
            this.marks[key] = new Set();  // Initialize mark set if not present
        }

        // Toggle mark – if the number is already marked, remove it
        if (this.marks[key].has(value)) {
            this.marks[key].delete(value);
        } else {
            this.marks[key].add(value);
        }
        console.log(`Marks at [${x}, ${y}]:`, Array.from(this.marks[key]));
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
  