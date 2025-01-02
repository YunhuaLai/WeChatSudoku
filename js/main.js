import { renderBoard, renderNumberButtons, renderUndoButton } from './game/renderSudoku';
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
        GameGlobal.databus.selectedNumber = null;  // Clear selected number on restart
        this.render();  
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
        console.log(`Touch at: x=${clientX}, y=${clientY}`);
    
        const redoArea = GameGlobal.sudokuBoard.redoButtonArea;
        const btnArea = GameGlobal.sudokuBoard.buttonArea;
    
        // Debug button areas
        console.log('Redo Area:', redoArea);
        console.log('Button Area:', btnArea);
    
        // Handle Undo Button Touch
        if (
            redoArea &&
            clientX >= redoArea.x &&
            clientX <= redoArea.x + redoArea.width &&
            clientY >= redoArea.y &&
            clientY <= redoArea.y + redoArea.height
        ) {
            GameGlobal.sudokuBoard.undoLastMove();
            console.log("Undo button pressed");
            return;
        }
    
        // Handle Number Button Touch
        if (
            btnArea &&
            clientY >= btnArea.y &&
            clientY <= btnArea.y + btnArea.buttonSize &&
            clientX >= btnArea.x &&
            clientX <= btnArea.x + 9 * btnArea.buttonSize
        ) {
            const selectedNumber = Math.floor((clientX - btnArea.x) / btnArea.buttonSize) + 1;
            GameGlobal.databus.selectedNumber = selectedNumber;
            console.log(`Selected Number: ${selectedNumber}`);
            return;
        }
    
        // Place number on Sudoku grid
        GameGlobal.sudokuBoard.placeSelectedNumber(clientX, clientY);
    }
    
    update() {
        if (GameGlobal.databus.isGameOver) return;
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const boardSize = Math.min(canvas.width * 0.9, canvas.height * 0.7);
        const startX = (canvas.width - boardSize) / 2;
        const startY = canvas.height * 0.15;

        renderBoard(ctx, this.sudokuBoard, boardSize, startX, startY);
        renderNumberButtons(ctx, startX, startY + boardSize + 20, boardSize, GameGlobal.databus.selectedNumber);
        renderUndoButton(ctx, startX, startY + boardSize + 100, boardSize);
        this.gameInfo.render(ctx);
    }

    loop() {
        this.update();
        this.render();
        this.aniId = requestAnimationFrame(this.loop.bind(this));
    }
}
