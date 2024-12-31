import './render'; // 初始化Canvas
import SudokuBoard from './game/sudokuBoard'; // 导入数独棋盘类
import GameInfo from './runtime/gameinfo'; // 导入游戏UI类
import DataBus from './databus'; // 导入数据类，用于管理游戏状态和数据

const ctx = canvas.getContext('2d'); // 获取canvas的2D绘图上下文;

GameGlobal.databus = new DataBus(); // 全局数据管理
GameGlobal.sudokuBoard = new SudokuBoard(); // 创建数独棋盘实例

/**
 * 游戏主函数
 */
export default class Main {
  aniId = 0; // 动画帧ID
  sudokuBoard = GameGlobal.sudokuBoard // 初始化数独棋盘
  gameInfo = new GameInfo(); // 创建游戏信息UI

  constructor() {
    // 监听重新开始的事件
    this.gameInfo.on('restart', this.start.bind(this));
  
    // 绑定触摸事件
    wx.onTouchStart(this.handleTouch.bind(this));
  
    // 开始游戏
    this.start();
  }
  

  /**
   * 开始或重启游戏
   */
  start() {
    GameGlobal.databus.reset();
    this.sudokuBoard.init();
    this.render();  // Force initial render to ensure buttonArea is created
    cancelAnimationFrame(this.aniId);
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }
  

  /**
   * 监听玩家点击数字填充数独棋盘的逻辑
   */
  playerInput(x, y, value) {
    if (this.sudokuBoard.canPlaceNumber(x, y, value)) {
      this.sudokuBoard.placeNumber(x, y, value);
      GameGlobal.databus.score += 1; // 每次正确填入增加分数
    } else {
      GameGlobal.databus.errors += 1; // 填错增加错误次数
    }

    if (this.sudokuBoard.isComplete()) {
      GameGlobal.databus.gameOver(); // 游戏完成
    }
  }

  // 触摸事件处理函数
  handleTouch(event) {
    const { clientX, clientY } = event.touches[0];
    const btnArea = GameGlobal.sudokuBoard.buttonArea;
  
    // 如果buttonArea未定义，防止报错
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
  
    // 点击棋盘放置数字
    GameGlobal.sudokuBoard.placeSelectedNumber(clientX, clientY);
  }
  
  /**
   * 游戏逻辑更新函数
   */
  update() {
    if (GameGlobal.databus.isGameOver) {
      return;
    }
  }

  /**
   * 渲染函数，每帧重新绘制游戏画面
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
  
    this.sudokuBoard.render(ctx);  // 绘制数独棋盘
    this.sudokuBoard.renderNumberButtons(
      ctx,
      (canvas.width - Math.min(canvas.width * 0.9, canvas.height * 0.7)) / 2,
      canvas.height * 0.15 + Math.min(canvas.width * 0.9, canvas.height * 0.7) + 20,
      Math.min(canvas.width * 0.9, canvas.height * 0.7)
    );
  
    this.gameInfo.render(ctx);  // 绘制UI
  }
  

  /**
   * 游戏主循环
   */
  loop() {
    this.update(); // 更新逻辑
    this.render(); // 渲染画面

    this.aniId = requestAnimationFrame(this.loop.bind(this)); // 请求下一帧动画
  }
}
