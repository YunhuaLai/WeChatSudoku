import Emitter from '../libs/tinyemitter';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const atlas = wx.createImage();
atlas.src = 'images/Common.png';

export default class GameInfo extends Emitter {
  constructor() {
    super();

    this.btnArea = {
      startX: SCREEN_WIDTH / 2 - 60,
      startY: SCREEN_HEIGHT / 2 + 100,
      endX: SCREEN_WIDTH / 2 + 60,
      endY: SCREEN_HEIGHT / 2 + 150,
    };

    // 绑定触摸事件监听器
    wx.onTouchStart(this.touchEventHandler.bind(this));
  }

  /**
   * 设置字体和颜色
   */
  setFont(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
  }

  /**
   * 渲染游戏信息，包括分数和错误次数
   */
  render(ctx) {
    this.renderGameStatus(ctx, GameGlobal.databus.score, GameGlobal.databus.errors);

    // 游戏结束时，绘制游戏结束画面
    if (GameGlobal.databus.isGameOver) {
      this.renderGameOver(ctx, GameGlobal.databus.score);
    }
  }

  /**
   * 渲染游戏状态（分数和错误）
   */
  renderGameStatus(ctx, score, errors) {
    this.setFont(ctx);
    ctx.fillText(`分数: ${score}`, 100, canvas.height * 0.1);  // 向下移动
    ctx.fillText(`错误: ${errors}`, canvas.width - 100, canvas.height * 0.1);
  }

  /**
   * 游戏结束画面
   */
  renderGameOver(ctx, score) {
    this.drawGameOverImage(ctx);
    this.drawGameOverText(ctx, score);
    this.drawRestartButton(ctx);
  }

  /**
   * 绘制游戏结束的图标
   */
  drawGameOverImage(ctx) {
    ctx.drawImage(
      atlas,
      0,
      0,
      119,
      108,
      SCREEN_WIDTH / 2 - 150,
      SCREEN_HEIGHT / 2 - 120,
      300,
      300
    );
  }

  /**
   * 绘制游戏结束文本
   */
  drawGameOverText(ctx, score) {
    this.setFont(ctx);
    ctx.fillText(
      '游戏结束',
      SCREEN_WIDTH / 2 - 50,
      SCREEN_HEIGHT / 2 - 50
    );
    ctx.fillText(
      `最终得分: ${score}`,
      SCREEN_WIDTH / 2 - 50,
      SCREEN_HEIGHT / 2 + 10
    );
  }

  /**
   * 绘制重新开始按钮
   */
  drawRestartButton(ctx) {
    ctx.drawImage(
      atlas,
      120,
      6,
      39,
      24,
      SCREEN_WIDTH / 2 - 60,
      SCREEN_HEIGHT / 2 + 100,
      120,
      40
    );
    ctx.fillText(
      '重新开始',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 + 130
    );
  }

  /**
   * 触摸事件处理函数
   */
  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0]; // 获取触摸点的坐标

    if (GameGlobal.databus.isGameOver) {
      if (
        clientX >= this.btnArea.startX &&
        clientX <= this.btnArea.endX &&
        clientY >= this.btnArea.startY &&
        clientY <= this.btnArea.endY
      ) {
        this.emit('restart'); // 触发重启事件
      }
    }
  }
}
