/* 
  === Sudoku Button Rendering & Icon Drawing ===

  This file contains:
    • renderNumberButtons – Renders the nine number buttons along the bottom.
    • renderControlButtons – Renders four control buttons (undo, Mark, Erase, Hint) with icons.
    • drawModernButton – Helper function to draw a button with rounded corners, gradient, and drop shadow.
    • drawRoundedRect, createVerticalGradient, lightenColor – Helper functions.
    • Icon functions: drawundoIcon, drawPencilIcon, drawEraserIcon, drawLightBulbIcon.
*/
import { Icons, drawIcon } from '../icons/icons.js'
/* ---------------------- Number Buttons ---------------------- */
/**
 * Renders number buttons (1-9) with a gradient background and rounded buttons.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} x - Left coordinate of the button bar.
 * @param {number} y - Top coordinate.
 * @param {number} width - Total width available.
 * @param {number} selectedNumber - The number to highlight.
 */
export function renderNumberButtons(ctx, x, y, width, selectedNumber) {
    const buttonSize = Math.max(width / 9, 40);
    const barGradient = createVerticalGradient(ctx, x, y, width, buttonSize, '#555', '#333');
    ctx.fillStyle = barGradient;
    ctx.fillRect(x, y, width, buttonSize);
  
    for (let i = 1; i <= 9; i++) {
      const margin = 5;
      const btnX = x + (i - 1) * buttonSize + margin;
      const btnY = y + margin;
      const btnInnerSize = buttonSize - 2 * margin;
      const baseColor = selectedNumber === i ? "#4caf50" : "#888";
      const btnGradient = createVerticalGradient(
        ctx,
        btnX,
        btnY,
        btnInnerSize,
        btnInnerSize,
        lightenColor(baseColor, 20),
        baseColor
      );
  
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      drawRoundedRect(ctx, btnX, btnY, btnInnerSize, btnInnerSize, 8, btnGradient, null);
      ctx.restore();
  
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i, btnX + btnInnerSize / 2, btnY + btnInnerSize / 2);
    }
  
    // Set the detection area for touch/click events
    GameGlobal.sudokuBoard.buttonArea = {
      x,
      y,
      width,
      height: buttonSize,
      buttonSize: buttonSize
    };
  }
  
  /* --------------------- Control Buttons ---------------------- */
  /**
   * Renders control buttons (undo, Mark, Erase, Hint) with icons.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} x - Left coordinate.
   * @param {number} y - Top coordinate.
   * @param {number} width - Total width available.
   */
  export function renderControlButtons(ctx, x, y, width) {
    const numButtons = 4;
    const spacing = 15;
    const buttonWidth = (width - (numButtons - 1) * spacing) / numButtons;
    const buttonHeight = buttonWidth * 0.6;
    const barPadding = 10;
    const barHeight = buttonHeight + 2 * barPadding;
  
    // Draw the background bar with a gradient and drop shadow.
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    const bgGradient = createVerticalGradient(ctx, x, y, width, barHeight, "#555", "#333");
    drawRoundedRect(ctx, x, y, width, barHeight, 10, bgGradient, "#222");
    ctx.restore();
  
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Arial';
  
    let btnX = x;
    let btnY = y + barPadding;
    
    // 1. undo Button
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Undo", "undo", {
      iconColor: 'red', bgColor: "#666"
    });
    GameGlobal.sudokuBoard.undoButtonArea = {
      x: btnX, y: btnY, width: buttonWidth, height: buttonHeight
    };
  
    // 2. Mark Button (Pencil)
    btnX = x + buttonWidth + spacing;
    const markingMode = GameGlobal.sudokuBoard.markingMode;
    const markBgColor = markingMode ? "#4caf50" : "#666";
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Mark", "pencil", {
      iconColor: '#fff', bgColor: markBgColor
    });
    GameGlobal.sudokuBoard.markButtonArea = {
      x: btnX, y: btnY, width: buttonWidth, height: buttonHeight
    };
  
    // 3. Erase Button
    btnX = x + (buttonWidth + spacing) * 2;
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Erase", "erase", {
      iconColor: '#fff', bgColor: "#666"
    });
    GameGlobal.sudokuBoard.eraseButtonArea = {
      x: btnX, y: btnY, width: buttonWidth, height: buttonHeight
    };
  
    // 4. Hint Button
    btnX = x + (buttonWidth + spacing) * 3;
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Hint", "hint", {
      iconColor: '#fff', bgColor: "#666"
    });
    GameGlobal.sudokuBoard.hintButtonArea = {
      x: btnX, y: btnY, width: buttonWidth, height: buttonHeight
    };
  }
  
  
  /** Draws a modern–styled button with a PNG icon and a label. */
  function drawModernButton(ctx, x, y, width, height, label, iconKey, options = {}) {
    const radius = 8;
    const grad = createVerticalGradient(
      ctx,
      x,
      y,
      width,
      height,
      lightenColor(options.bgColor, 20),
      options.bgColor
    );
  
    // Draw the button background with a drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    drawRoundedRect(ctx, x, y, width, height, radius, grad, null);
    ctx.restore();
  
    // Draw the PNG icon near the top center
    const iconX = x + width / 2;
    const iconY = y + height / 2 - 8;
    drawIcon(ctx, iconKey, iconX, iconY, 20, 20); 
    // 20x20 is a suggested icon size; tweak as desired.
  
    // Draw the label near the bottom center
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x + width / 2, y + height - 4);
  }
  
  /** Same as before: draws a rounded rectangle. */
  function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle) {
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
    ctx.closePath();
  
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  }
  
  /** Same as before: creates a vertical gradient. */
  function createVerticalGradient(ctx, x, y, width, height, colorTop, colorBottom) {
    const grad = ctx.createLinearGradient(x, y, x, y + height);
    grad.addColorStop(0, colorTop);
    grad.addColorStop(1, colorBottom);
    return grad;
  }
  
  /** Same as before: lighten a hex color. */
  function lightenColor(color, percent) {
    let num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    R = R < 255 ? (R < 0 ? 0 : R) : 255;
    G = G < 255 ? (G < 0 ? 0 : G) : 255;
    B = B < 255 ? (B < 0 ? 0 : B) : 255;
    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
  }