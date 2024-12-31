export default class SudokuBoard {
    constructor() {
      this.grid = []; // 9x9 Sudoku grid
      this.originalGrid = []; // Stores the initial unsolved grid for reference
      this.size = 9; // Standard Sudoku size
    }
  
    /**
     * 初始化棋盘，生成一个新的数独
     */
    init() {
      this.grid = this.generateSudoku();
      this.originalGrid = JSON.parse(JSON.stringify(this.grid)); // 保存初始棋盘状态
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
      this.grid[x][y] = value;
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
      for (let i = 0; i < this.size; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
      }
  
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
  
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (board[startRow + r][startCol + c] === num) return false;
        }
      }
      return true;
    }
  
    /**
     * 渲染数独棋盘
     */
    render(ctx) {
        const boardSize = Math.min(canvas.width * 0.9, canvas.height * 0.7);
        const cellSize = boardSize / this.size;
      
        const startX = (canvas.width - boardSize) / 2;
        const startY = canvas.height * 0.15;
      
        // 绘制数独棋盘
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(startX, startY, boardSize, boardSize);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
      
        for (let i = 0; i <= this.size; i++) {
          ctx.beginPath();
          ctx.moveTo(startX + i * cellSize, startY);
          ctx.lineTo(startX + i * cellSize, startY + boardSize);
          ctx.stroke();
      
          ctx.beginPath();
          ctx.moveTo(startX, startY + i * cellSize);
          ctx.lineTo(startX + boardSize, startY + i * cellSize);
          ctx.stroke();
        }
      
        // 绘制数字
        ctx.font = `${cellSize / 2}px Arial`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      
        for (let row = 0; row < this.size; row++) {
          for (let col = 0; col < this.size; col++) {
            if (this.grid[row][col] !== 0) {
              ctx.fillText(
                this.grid[row][col],
                startX + col * cellSize + cellSize / 2,
                startY + row * cellSize + cellSize / 2
              );
            }
          }
        }
      
        // 绘制数字选择按钮
        this.renderNumberButtons(ctx, startX, startY + boardSize + 20, boardSize);
    }
      
      // 绘制1-9数字按钮
    renderNumberButtons(ctx, x, y, width) {
        const buttonSize = width / 9;
        ctx.strokeStyle = '#000';
      
        for (let i = 1; i <= 9; i++) {
          const btnX = x + (i - 1) * buttonSize;
          
          // Highlight selected number
          if (GameGlobal.databus.selectedNumber === i) {
            ctx.fillStyle = '#dcdcdc';
          } else {
            ctx.fillStyle = '#f0f0f0';
          }
      
          ctx.fillRect(btnX, y, buttonSize, buttonSize);
          ctx.strokeRect(btnX, y, buttonSize, buttonSize);
      
          ctx.fillStyle = '#000';
          ctx.fillText(i, btnX + buttonSize / 2, y + buttonSize / 2);
        }
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
            if (this.canPlaceNumber(row, col, selectedNumber)) {
                this.placeNumber(row, col, selectedNumber);
            } else {
                console.log("Number can't be placed here.");  // Feedback for invalid placement
            }
            } else {
            console.log("Select a number first.");  // Feedback for no selection
            }
        }
        }
      
      
      
  }
  