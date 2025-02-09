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
        this.autoSaveTimer = null; // Timer for auto-saving
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
            this.autoSaveGame()
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
        this.elapsedTime += Date.now() - this.startTime;
        this.isPaused = true;
        clearInterval(GameGlobal.main.timer);  // Stop timer after game over
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
        } else {
            this.autoSaveGame(); 
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
        return JSON.stringify(this.sudokuGrid) === JSON.stringify(this.solution);
    }

    saveGameState(name = 'LastGame') {
        const fs = wx.getFileSystemManager();
        const gameState = {
            sudokuGrid: this.sudokuGrid,
            solution: this.solution,
            elapsedTime: this.getElapsedTime(),
            difficulty: this.difficulty,
            timestamp: new Date().toISOString()
        };

        const savePath = `${wx.env.USER_DATA_PATH}/${name}.json`;
 
        fs.writeFile({
            filePath: savePath,
            data: JSON.stringify(gameState),
            encoding: 'utf8',
            success: () => {
                console.log("Game state saved successfully!");
                if (name != 'LastGame') {
                    wx.showToast({ title: 'Game Saved!', icon: 'success' });
                }
            },
            fail: (err) => {
                console.error("Failed to save game state:", err);
                wx.showToast({ title: 'Save Failed', icon: 'none' });
            }
        });
    }

    loadGameState(name = 'LastGame') {
        return new Promise((resolve, reject) => {
            const fs = wx.getFileSystemManager();
            const savePath = `${wx.env.USER_DATA_PATH}/name.json`;
    
            fs.readFile({
                filePath: savePath,
                encoding: 'utf8',
                success: (res) => {
                    const gameState = JSON.parse(res.data);
                    this.sudokuGrid = gameState.sudokuGrid;
                    this.solution = gameState.solution;
                    this.difficulty = gameState.difficulty;
                    this.elapsedTime = gameState.elapsedTime;
                    this.startTime = Date.now() - (this.elapsedTime * 1000);
                    this.isPaused = false;
    
                    console.log("Auto-saved game loaded!");
                    resolve(true);  // Notify that loading is successful
                },
                fail: (err) => {
                    console.log("No auto-save found, starting a new game.");
                    resolve(false);  // Notify that no saved game exists
                }
            });
        });
    }
    
    autoSaveGame() {
        if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer); // Clear previous timer

        // Set a new timer to save after 2 seconds of inactivity
        this.autoSaveTimer = setTimeout(() => {
            this.saveGameState();
        }, 2000);
    }


}
