import { 
    renderBoard, 
} from './ui/renderBoard';
import {
    renderDifficultyBar,
    renderHeaderUI,
    renderPauseOverlay
} from './ui/renderTopButtons';
import {
    renderWelcomeScreen,
    renderDifficultyScreen
} from './ui/renderWelcome';
import {
    renderNumberButtons,
    renderControlButtons
} from './ui/renderBottomButtons';
import { preloadIcons } from '../images/icons/icons.js';


import SudokuBoard from './game/sudokuBoard';
import GameInfo from './runtime/gameinfo';
import DataBus from './databus';

const ctx = canvas.getContext('2d');

GameGlobal.databus = new DataBus();
GameGlobal.sudokuBoard = new SudokuBoard();

export default class Main {
    aniId = 0;
    sudokuBoard = GameGlobal.sudokuBoard;  // Use the global instance
    gameInfo = new GameInfo();

    constructor() {
        // Preload the SVG icons first
        preloadIcons('js/icons/')
          .then(() => {
            // Once icons are loaded, we can safely start the game
            this.gameInfo.on('restart', this.start.bind(this));
    
            // Bind touch events (WeChat Mini Game environment)
            wx.onTouchStart(this.handleTouch.bind(this));
    
            // Finally, start the game
            this.start();
          })
          .catch(err => {
            console.error('Failed to preload icons:', err);
          });
      }

    start() {
        GameGlobal.databus.reset();
        this.sudokuBoard.init();
        GameGlobal.databus.selectedNumber = null;

        // Ensure timer renders immediately
        this.render();
        cancelAnimationFrame(this.aniId);
        this.aniId = requestAnimationFrame(this.loop.bind(this));
        this.startTimer();
    }

    startTimer() {
        cancelAnimationFrame(this.aniId);
        this.aniId = requestAnimationFrame(this.loop.bind(this));
    }
    
    playerInput(x, y, value) {
        if (this.sudokuBoard.canPlaceNumber(x, y, value)) {
            this.sudokuBoard.placeNumber(x, y, value);
            GameGlobal.databus.score += 1;
            } else {
            GameGlobal.databus.errors += 1;
        }

        if (this.sudokuBoard.isComplete()) {
            GameGlobal.databus.gameOver();
        }
    }

    handleTouch(event) {
        const { clientX, clientY } = event.touches[0];
        const boardSize = Math.min(canvas.width * 0.9, canvas.height * 0.7);
        const startX = (canvas.width - boardSize) / 2;
        const startY = canvas.height * 0.15;
        const cellSize = boardSize / 9;
    
        const {
            startButtonArea,
            redoButtonArea,
            markButtonArea,
            eraseButtonArea,
            hintButtonArea,
            pauseButtonArea,
            resumeButtonArea,
            newGameButtonArea,
            buttonArea
        } = GameGlobal.sudokuBoard;
        
        // Helper to check button area
        const isInside = (area) =>
            area &&
            clientX >= area.x &&
            clientX <= area.x + area.width &&
            clientY >= area.y &&
            clientY <= area.y + area.height;
    
        // Welcome Screen Handling
        if (GameGlobal.databus.isWelcomeScreen) {
            if (startButtonArea && isInside(startButtonArea)) {
                GameGlobal.databus.isWelcomeScreen = false; 
                GameGlobal.databus.isDifficultyScreen = true;
                console.log("Game Started!");
                return;
            }
            return;  // Block touch if still on welcome screen
        }

        if (GameGlobal.databus.isDifficultyScreen) {
            const buttons = ['easy', 'medium', 'hard'];
            console.log("Selected difficulted")
            for (const level of buttons) {
                const btnArea = GameGlobal.sudokuBoard[`difficultyButton_${level}`];
                if (
                    clientX >= btnArea.x &&
                    clientX <= btnArea.x + btnArea.width &&
                    clientY >= btnArea.y &&
                    clientY <= btnArea.y + btnArea.height
                ) {
                    GameGlobal.databus.setDifficulty(level);
                    console.log(`Difficulty selected: ${level}`);
                    return;
                }
            }
        }

        if (isInside(newGameButtonArea)) {
            GameGlobal.databus.isDifficultyScreen = true;
            console.log('New Game button clicked');
            return;
        }
        
        // Pause/Resume
        if (GameGlobal.databus.isPaused) {
            if (resumeButtonArea && isInside(resumeButtonArea)) {
                GameGlobal.databus.togglePause();
                console.log("Game Resumed");
            } else {
                console.log("Paused - Interaction Blocked");
            }
            return;
        }
    
        if (pauseButtonArea && isInside(pauseButtonArea)) {
            GameGlobal.databus.togglePause();
            console.log(GameGlobal.databus.isPaused ? 'Paused' : 'Resumed');
            return;
        }
    
        // Control Buttons
        if (redoButtonArea && isInside(redoButtonArea)) {
            GameGlobal.sudokuBoard.undoLastMove();
            console.log("Undo Pressed");
            return;
        }
    
        if (markButtonArea && isInside(markButtonArea)) {
            GameGlobal.sudokuBoard.toggleMarkingMode();
            console.log("Marking Mode Toggled");
            return;
        }
    
        if (eraseButtonArea && isInside(eraseButtonArea)) {
            GameGlobal.sudokuBoard.eraseSelectedCell();
            console.log("Erase Pressed");
            return;
        }
    
        if (hintButtonArea && isInside(hintButtonArea)) {
            GameGlobal.sudokuBoard.provideHint();
            console.log("Hint Pressed");
            return;
        }
    
        // Number Selection
        if (buttonArea && isInside(buttonArea)) { 
            const selectedNumber = Math.floor((clientX - buttonArea.x) / buttonArea.buttonSize) + 1;
            GameGlobal.sudokuBoard.placeSelectedNumber(selectedNumber);
            return;
        }
    
        // Board Cell Selection
        const row = Math.floor((clientY - startY) / cellSize);
        const col = Math.floor((clientX - startX) / cellSize);
    
        if (col >= 0 && col < 9 && row >= 0 && row < 9) {
            GameGlobal.databus.selectCell(col, row);
            console.log(`Selected Cell: [${col}, ${row}]`);
        }
    }
    
    // Toggle marking mode with a button press
    toggleMarkingMode() {
        GameGlobal.sudokuBoard.toggleMarkingMode();
    }
    
    update() {
        if (GameGlobal.databus.isGameOver) return;
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const boardSize = Math.min(canvas.width * 0.9, canvas.height * 0.7);
        const startX = (canvas.width - boardSize) / 2;
        const startY = canvas.height * 0.15;

        if (GameGlobal.databus.isWelcomeScreen) {
            renderWelcomeScreen(ctx, canvas.width, canvas.height);
        } else if (GameGlobal.databus.isDifficultyScreen) {
            renderDifficultyScreen(ctx, canvas); 
        } else if (   GameGlobal.databus.showDifficultyBar) {
            renderDifficultyBar(ctx, canvas);
        } else {
            // Render Timer and Pause Button at Top
            renderHeaderUI(ctx, canvas, boardSize);

            // If paused, only render the overlay (hide grid and numbers)
            if (GameGlobal.databus.isPaused) {
                renderPauseOverlay(ctx, boardSize, startX, startY);
            } else {
                // Render the Sudoku grid and numbers if not paused
                renderBoard(ctx, this.sudokuBoard, boardSize, startX, startY);
                renderNumberButtons(ctx, startX, startY + boardSize + 20, boardSize, GameGlobal.databus.selectedNumber);
                renderControlButtons(ctx, startX, startY + boardSize + 100, boardSize);
            }
        }
    }
    
    loop() {
        if (!GameGlobal.databus.isPaused) {
            this.update();
        }
        this.render();
        this.aniId = requestAnimationFrame(this.loop.bind(this));
    }
}
