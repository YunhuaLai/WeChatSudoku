import { 
    renderBoard, 
    renderNumberButtons, 
    renderUndoAndMarkingButtons,
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
        const redoArea = GameGlobal.sudokuBoard.redoButtonArea;
        const btnArea = GameGlobal.sudokuBoard.buttonArea;
        const markButtonArea = GameGlobal.sudokuBoard.markButtonArea; 
        const pauseArea = GameGlobal.sudokuBoard.pauseButtonArea;
        const resumeArea = GameGlobal.sudokuBoard.resumeButtonArea;  

        // If paused, only allow touch on the resume button
        if (GameGlobal.databus.isPaused) {
            if (
                resumeArea &&
                clientX >= resumeArea.x &&
                clientX <= resumeArea.x + resumeArea.width &&
                clientY >= resumeArea.y &&
                clientY <= resumeArea.y + resumeArea.height
            ) {
                GameGlobal.databus.togglePause();
                console.log("Game Resumed");
            } else {
                console.log("Touch blocked while paused.");
            }
            return;  // Prevent touches on the board while paused
        }

        // Handle pause button click
        if (
            pauseArea &&
            clientX >= pauseArea.x &&
            clientX <= pauseArea.x + pauseArea.width &&
            clientY >= pauseArea.y &&
            clientY <= pauseArea.y + pauseArea.height
        ) {
            GameGlobal.databus.togglePause();
            console.log(GameGlobal.databus.isPaused ? 'Paused' : 'Resumed');
            return;
        }
    
        // Handle undo button
        if (redoArea && 
            clientX >= redoArea.x && 
            clientX <= redoArea.x + redoArea.width && 
            clientY >= redoArea.y && 
            clientY <= redoArea.y + redoArea.height) {
            GameGlobal.sudokuBoard.undoLastMove();
            return;
        }
    
        // Handle marking mode button
        if (markButtonArea && 
            clientX >= markButtonArea.x && 
            clientX <= markButtonArea.x + markButtonArea.width && 
            clientY >= markButtonArea.y && 
            clientY <= markButtonArea.y + markButtonArea.height) {
            GameGlobal.sudokuBoard.toggleMarkingMode();
            console.log("Marking mode toggled");
            return;
        }
    
        // Handle number selection (mark or place)
        if (btnArea && 
            clientY >= btnArea.y &&
            clientY <= btnArea.y + btnArea.buttonSize &&
            clientX >= btnArea.x &&
            clientX <= btnArea.x + 9 * btnArea.buttonSize) {
            const selectedNumber = Math.floor((clientX - btnArea.x) / btnArea.buttonSize) + 1;
            GameGlobal.databus.selectedNumber = selectedNumber;
            return;
        }

        // Resume button logic (when overlay is present)
        if (
            GameGlobal.databus.isPaused &&
            resumeArea &&
            clientX >= resumeArea.x &&
            clientX <= resumeArea.x + resumeArea.width &&
            clientY >= resumeArea.y &&
            clientY <= resumeArea.y + resumeArea.height
        ) {
            GameGlobal.databus.togglePause();
            console.log("Game Resumed");
            return;
        }
    
        // Place number or mark on Sudoku grid
        GameGlobal.sudokuBoard.placeSelectedNumber(clientX, clientY);
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
            renderUndoAndMarkingButtons(ctx, startX, startY + boardSize + 100, boardSize);
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
