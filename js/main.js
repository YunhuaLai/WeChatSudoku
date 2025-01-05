import { 
    renderBoard, 
    renderNumberButtons, 
    renderControlButtons,
    renderTimer,
    renderPauseButton,
    renderPauseOverlay 
} from './game/renderSudoku';
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
        this.gameInfo.on('restart', this.start.bind(this));
        wx.onTouchStart(this.handleTouch.bind(this));  // Bind touch event
        this.start();
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
        clearInterval(this.timer);  // Clear existing interval if present
        this.timer = setInterval(() => {
            if (!GameGlobal.databus.isPaused) {
                this.render();  // Force re-render every second
            }
        }, 1000); 
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
    
        // Button Areas
        const {
            redoButtonArea,
            markButtonArea,
            eraseButtonArea,
            hintButtonArea,
            pauseButtonArea,
            resumeButtonArea,
            buttonArea
        } = GameGlobal.sudokuBoard;
    
        // Helper function to check if touch is inside a button
        const isInside = (area) => {
            return area &&
                clientX >= area.x &&
                clientX <= area.x + area.width &&
                clientY >= area.y &&
                clientY <= area.y + area.height;
        };
    
        // 1. Handle Pause/Resume Interaction
        if (GameGlobal.databus.isPaused) {
            if (isInside(resumeButtonArea)) {
                GameGlobal.databus.togglePause();
                console.log("Game Resumed");
            } else {
                console.log("Touch blocked while paused.");
            }
            return;
        }
    
        if (isInside(pauseButtonArea)) {
            GameGlobal.databus.togglePause();
            console.log(GameGlobal.databus.isPaused ? 'Paused' : 'Resumed');
            return;
        }
    
        // 2. Handle Control Buttons (Undo, Mark, Erase, Hint)
        if (isInside(redoButtonArea)) {
            GameGlobal.sudokuBoard.undoLastMove();
            console.log("Undo pressed");
            return;
        }
    
        if (isInside(markButtonArea)) {
            GameGlobal.sudokuBoard.toggleMarkingMode();
            console.log("Marking mode toggled");
            return;
        }
    
        if (isInside(eraseButtonArea)) {
            GameGlobal.sudokuBoard.eraseSelectedCell();
            console.log("Erase pressed");
            return;
        }
    
        if (isInside(hintButtonArea)) {
            GameGlobal.sudokuBoard.provideHint();
            console.log("Hint pressed");
            return;
        }
    
        // 3. Handle Number Selection (Bottom Row of Numbers)
        if (buttonArea &&
            clientY >= buttonArea.y &&
            clientY <= buttonArea.y + buttonArea.buttonSize &&
            clientX >= buttonArea.x &&
            clientX <= buttonArea.x + 9 * buttonArea.buttonSize) {
    
            const selectedNumber = Math.floor((clientX - buttonArea.x) / buttonArea.buttonSize) + 1;
            GameGlobal.sudokuBoard.placeSelectedNumber(selectedNumber);
            return;
        }
    
        // 4. Handle Cell Selection by Tapping the Board
        const row = Math.floor((clientY - startY) / cellSize);  // Row (y-axis)
        const col = Math.floor((clientX - startX) / cellSize);  // Column (x-axis)
    
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

        // Render Timer and Pause Button at Top
        renderTimer(ctx, startX, startY - 50, boardSize);
        renderPauseButton(ctx, startX, startY - 50, boardSize);

        // If paused, only render the overlay (hide grid and numbers)
        if (GameGlobal.databus.isPaused) {
            renderPauseOverlay(ctx, boardSize, startX, startY);
        } else {
            // Render the Sudoku grid and numbers if not paused
            renderBoard(ctx, this.sudokuBoard, boardSize, startX, startY);
            renderNumberButtons(ctx, startX, startY + boardSize + 20, boardSize, GameGlobal.databus.selectedNumber);
            renderControlButtons(ctx, startX, startY + boardSize + 100, boardSize);
        }

        this.gameInfo.render(ctx);
    }
    
    loop() {
        if (!GameGlobal.databus.isPaused) {
            this.update();
        }
        this.render();
        this.aniId = requestAnimationFrame(this.loop.bind(this));
    }
}
