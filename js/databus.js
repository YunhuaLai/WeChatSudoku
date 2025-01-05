let instance;

/**
 * 全局状态管理器
 * 负责管理游戏的状态，包括帧数、分数、错误次数和游戏完成状态
 */
export default class DataBus {
    score = 0;  // 当前分数（填写正确的次数）
    errors = 0; // 错误次数
    isGameOver = false; // 游戏是否结束
    sudokuGrid = []; // 当前数独棋盘数据
    solution = []; // 数独解法
    selectedCell = null; // 当前选中的单元格
    highlightedNumber = null;

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    /**
     * 重置游戏状态
     * 每次重启游戏时调用
     */
    reset() {
        this.score = 0;
        this.errors = 0;
        this.isGameOver = false;
        this.sudokuGrid = this.createEmptyGrid();  // 重新生成空棋盘
        this.selectedCell = null;

        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isPaused = false;
        this.highlightedNumber = null;
    }

    // Pause or resume the game
    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.elapsedTime += Date.now() - this.startTime;  // Track elapsed time
        } else {
            this.startTime = Date.now();  // Restart from pause
        }
    }

    // Get current elapsed time in seconds
    getElapsedTime() {
        if (this.isPaused) {
            return Math.floor(this.elapsedTime / 1000);
        } else {
            return Math.floor((this.elapsedTime + (Date.now() - this.startTime)) / 1000);
        }
    }

  /**
   * 游戏结束
   */
  gameOver() {
    this.isGameOver = true;
    this.elapsedTime += Date.now() - this.startTime;  // Stop timer on game over
    this.isPaused = true;
}


  /**
   * 设置新的数独棋盘
   * @param {Array} grid 9x9数独棋盘
   * @param {Array} solution 数独的完整解法
   */
  setSudokuGrid(grid, solution) {
    this.sudokuGrid = grid;
    this.solution = solution;
  }

  /**
   * 更新棋盘单元格的值
   * @param {number} x 行号
   * @param {number} y 列号
   * @param {number} value 填入的值
   */
  updateCell(x, y, value) {
    if (this.sudokuGrid[x][y] === 0) {
      if (this.solution[x][y] === value) {
        this.sudokuGrid[x][y] = value;
        this.score += 1;  // 正确填入加分
      } else {
        this.errors += 1;  // 填错增加错误
      }

      // 检查游戏是否完成
      if (this.checkCompletion()) {
        this.gameOver();
      }
    }
  }

  /**
   * 创建空的9x9数独棋盘
   */
  createEmptyGrid() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  /**
   * 选择单元格，用于高亮或输入
   * @param {number} x 行号
   * @param {number} y 列号
   */
    selectCell(x, y) {
        this.selectedCell = { x, y };
        const currentValue = this.sudokuGrid[y][x];
        
        // Highlight the number if the cell has a value
        this.highlightedNumber = currentValue !== 0 ? currentValue : null;
        console.log(`Selected Cell: [${x}, ${y}], Highlighting: ${this.highlightedNumber}`);
    }

  /**
   * 检查棋盘是否已完成
   * 所有格子都填满时返回true
   */
  checkCompletion() {
    return this.sudokuGrid.every((row) => row.every((cell) => cell !== 0));
  }
}
