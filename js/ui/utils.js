  // utils.js: Helper functions for drawing

  import { UI_CONFIG } from './config.js';
  export function drawRoundedRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
  }
  
  export function drawCenteredText(ctx, text, centerX, centerY, fontSize, color) {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${UI_CONFIG.fonts.base}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
  }