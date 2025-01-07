let instance;

/**
 * 全局状态管理器
 * 负责管理游戏的状态，包括帧数、分数、错误次数和游戏完成状态
 */
export default class DataBus {
    score = 0;
    errors = 0;
    isGameOver = false;
    sudokuGrid = [];  // Store the active Sudoku grid
    solution = [];  // Store the full solution for validation
    selectedCell = null;
    highlightedNumber = null;
    isWelcomeScreen = true;  
    isDifficultyScreen = false;
    difficulty = 'easy';  // Default to easy
    showDifficultyBar = false;

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    reset() {
        this.score = 0;
        this.errors = 0;
        this.isGameOver = false;
        this.sudokuGrid = this.createEmptyGrid();
        this.selectedCell = null;
        this.highlightedNumber = null;

        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.isPaused = false;
        this.highlightedNumber = null;
        this.isWelcomeScreen = true;  
        this.showDifficultyBar = false;
    }

    start(){
        this.isWelcomeScreen = false; 
        this.isDifficultyScreen = true; 
    }

    startGame(difficulty = 'easy') {
        console.log(`Starting new ${difficulty} game`);
        this.reset();
        this.difficulty = difficulty;
        this.sudokuBoard.init();
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

    gameOver() {
        this.isGameOver = true;
        this.elapsedTime += Date.now() - this.startTime;  // Stop timer on game over
        this.isPaused = true;
    }

    // Set Sudoku Grid and Solution
    setSudokuGrid(grid, solution) {
        this.sudokuGrid = JSON.parse(JSON.stringify(grid));
        this.solution = solution;
        console.log("Sudoku Grid and Solution Set in DataBus");
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.isDifficultyScreen = false;  // Exit difficulty screen
        this.isGameRunning = true;        // Start game
        GameGlobal.sudokuBoard.init();    // Re-generate Sudoku with difficulty
        this.startTime = Date.now();

    }

    updateCell(x, y, value) {
        this.sudokuGrid[y][x] = value;
        this.selectedCell = { y, x };  // Track the currently updated cell

        console.log(`Updated DataBus at [${x}, ${y}] with ${value}`);

        const currentValue = this.sudokuGrid[y][x];
        this.highlightedNumber = currentValue !== 0 ? currentValue : null;

        if (this.checkCompletion()) {
            this.gameOver();
        }
    }

    createEmptyGrid() {
        return Array.from({ length: 9 }, () => Array(9).fill(0));
    }

    selectCell(x, y) {
        this.selectedCell = { x, y };
        const currentValue = this.sudokuGrid[y][x];
        
        // Highlight the number if the cell has a value
        this.highlightedNumber = currentValue !== 0 ? currentValue : null;
        console.log(`Selected Cell: [${x}, ${y}], Highlighting: ${this.highlightedNumber}`);
    }

    checkCompletion() {
        return this.sudokuGrid.every((row) => row.every((cell) => cell !== 0));
    }
}
