import Emitter from '../libs/tinyemitter';
import { SCREEN_WIDTH } from '../render';

export default class GameInfo extends Emitter {
  constructor() {
    super();
  }

  /**
   * 设置字体和颜色
   */
  setFont(ctx) {
    ctx.fillStyle = '#ff4d4d';  // Red color for errors
    ctx.font = '24px Arial';
  }

  /**
   * 渲染错误次数
   */
}
