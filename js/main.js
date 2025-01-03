import { 
    renderBoard, 
    renderNumberButtons, 
    renderUndoButton, 
    renderMarkingButton, 
    renderTimer,
    renderPauseButton  
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
 

        // Pause button logic
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
    
        // Render Sudoku grid and numbers
        renderBoard(ctx, this.sudokuBoard, boardSize, startX, startY);

        // Render timer and pause/resume
        renderTimer(ctx, startX, startY - 50, boardSize);
        renderPauseButton(ctx, startX, startY - 50, boardSize);
    
        // Render number buttons
        const buttonY = startY + boardSize + 20;
        renderNumberButtons(ctx, startX, buttonY, boardSize, GameGlobal.databus.selectedNumber);
    
        // Render undo button below number buttons
        renderUndoButton(ctx, startX, buttonY + 60, boardSize);
    
        // Render marking mode button below undo button
        renderMarkingButton(ctx, startX, buttonY + 120, boardSize);
    
        // Render game info (score, errors, etc.)
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
