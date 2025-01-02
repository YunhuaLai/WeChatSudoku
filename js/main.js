import './render';
import SudokuBoard from './game/sudokuBoard';
import GameInfo from './runtime/gameinfo';
import DataBus from './databus';

const ctx = canvas.getContext('2d');

GameGlobal.databus = new DataBus();
GameGlobal.sudokuBoard = new SudokuBoard();  // Create a single instance globally

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
    this.render();  // Ensure initial render before game loop starts
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
    const btnArea = GameGlobal.sudokuBoard.buttonArea;

    if (!btnArea) {
      console.log("Button area not initialized yet.");
      return;
    }

    if (
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

    GameGlobal.sudokuBoard.placeSelectedNumber(clientX, clientY);
  }

  update() {
    if (GameGlobal.databus.isGameOver) return;
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.sudokuBoard.render(ctx);
    this.sudokuBoard.renderNumberButtons(
      ctx,
      (canvas.width - Math.min(canvas.width * 0.9, canvas.height * 0.7)) / 2,
      canvas.height * 0.15 + Math.min(canvas.width * 0.9, canvas.height * 0.7) + 20,
      Math.min(canvas.width * 0.9, canvas.height * 0.7)
    );
    this.gameInfo.render(ctx);
  }

  loop() {
    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }
}
