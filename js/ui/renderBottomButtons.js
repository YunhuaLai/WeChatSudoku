/* 
  === Sudoku Button Rendering & Icon Drawing ===

  This file contains:
    • renderNumberButtons – Renders the nine number buttons along the bottom.
    • renderControlButtons – Renders four control buttons (Redo, Mark, Erase, Hint) with icons.
    • drawModernButton – Helper function to draw a button with rounded corners, gradient, and drop shadow.
    • drawRoundedRect, createVerticalGradient, lightenColor – Helper functions.
    • Icon functions: drawRedoIcon, drawPencilIcon, drawEraserIcon, drawLightBulbIcon.
*/

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
   * Renders control buttons (Redo, Mark, Erase, Hint) with icons.
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
    
    // 1. Redo Button – Anticlockwise arrow covering 270°
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Redo", drawRedoIcon, {
      iconColor: 'red', bgColor: "#666"
    });
    GameGlobal.sudokuBoard.redoButtonArea = { x: btnX, y: btnY, width: buttonWidth, height: buttonHeight };
  
    // 2. Mark Button – Pencil icon (may indicate marking mode)
    btnX = x + buttonWidth + spacing;
    const markingMode = GameGlobal.sudokuBoard.markingMode;
    const markBgColor = markingMode ? "#4caf50" : "#666";
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Mark", drawPencilIcon, {
      iconColor: '#fff', bgColor: markBgColor
    });
    GameGlobal.sudokuBoard.markButtonArea = { x: btnX, y: btnY, width: buttonWidth, height: buttonHeight };
  
    // 3. Erase Button – Eraser icon.
    btnX = x + (buttonWidth + spacing) * 2;
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Erase", drawEraserIcon, {
      iconColor: '#fff', bgColor: "#666"
    });
    GameGlobal.sudokuBoard.eraseButtonArea = { x: btnX, y: btnY, width: buttonWidth, height: buttonHeight };
  
    // 4. Hint Button – Light bulb icon.
    btnX = x + (buttonWidth + spacing) * 3;
    drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Hint", drawLightBulbIcon, {
      iconColor: '#fff', bgColor: "#666"
    });
    GameGlobal.sudokuBoard.hintButtonArea = { x: btnX, y: btnY, width: buttonWidth, height: buttonHeight };
  }
  
  /* ---------------------- Helper Functions ---------------------- */
  /**
   * Draws a modern–styled button with rounded corners, gradient, and drop shadow.
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x - Top–left x coordinate.
   * @param {number} y - Top–left y coordinate.
   * @param {number} width - Button width.
   * @param {number} height - Button height.
   * @param {string} label - Button label.
   * @param {Function} iconFunction - Function to draw the icon.
   * @param {object} options - Options (iconColor, bgColor).
   */
  function drawModernButton(ctx, x, y, width, height, label, iconFunction, options = {}) {
    const radius = 8;
    const grad = createVerticalGradient(ctx, x, y, width, height, lightenColor(options.bgColor, 20), options.bgColor);
  
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    drawRoundedRect(ctx, x, y, width, height, radius, grad, null);
    ctx.restore();
  
    // Draw the icon (positioned slightly above the center)
    const iconX = x + width / 2;
    const iconY = y + height / 2 - 8;
    iconFunction(ctx, iconX, iconY, options);
  
    // Draw the label at the bottom of the button
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x + width / 2, y + height - 4);
  }
  
  /**
   * Draws a rounded rectangle.
   */
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
  
  /**
   * Creates a vertical gradient.
   */
  function createVerticalGradient(ctx, x, y, width, height, colorTop, colorBottom) {
    const grad = ctx.createLinearGradient(x, y, x, y + height);
    grad.addColorStop(0, colorTop);
    grad.addColorStop(1, colorBottom);
    return grad;
  }
  
  /**
   * Lightens a hex color by a given percent.
   */
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
  
  /* ---------------------- Icon Functions ---------------------- */

  function drawRedoIcon(ctx, x, y, options) {
    ctx.save();
    ctx.strokeStyle = options.iconColor || 'red';
    ctx.fillStyle = options.iconColor || 'red';
    ctx.lineWidth = 2;
  
    const radius = 10;
    const startAngle = -Math.PI / 2;       // Top (–90°)
    const arcSpan = 1.5 * Math.PI;           // 270° arc
    const endAngle = startAngle - arcSpan;   // End angle (drawn anticlockwise)
    
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, true);
    ctx.stroke();
  
    // Compute the arrowhead at the start of the arc.
    const tipX = x + radius * Math.cos(startAngle);
    const tipY = y + radius * Math.sin(startAngle);
    const tangentAngle = startAngle - Math.PI / 2;
    const arrowLength = 5;
    const arrowAngleOffset = 0.4;
    const leftWingX = tipX + arrowLength * Math.cos(tangentAngle + arrowAngleOffset);
    const leftWingY = tipY + arrowLength * Math.sin(tangentAngle + arrowAngleOffset);
    const rightWingX = tipX + arrowLength * Math.cos(tangentAngle - arrowAngleOffset);
    const rightWingY = tipY + arrowLength * Math.sin(tangentAngle - arrowAngleOffset);
  
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftWingX, leftWingY);
    ctx.lineTo(rightWingX, rightWingY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  function drawPencilIcon(ctx, x, y, options) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = options.iconColor || '#fff';
    ctx.strokeStyle = options.iconColor || '#fff';
    ctx.lineWidth = 1.5;
    
    // Pencil body
    ctx.beginPath();
    ctx.rect(-10, -2, 14, 4);
    ctx.fill();
    ctx.stroke();
    
    // Pencil tip as a triangle
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.lineTo(8, 0);
    ctx.lineTo(4, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  
  function drawEraserIcon(ctx, x, y, options) {
    ctx.save();
    ctx.translate(x, y);
    
    // Dimensions and slant offset
    const eraserWidth = 20;
    const eraserHeight = 12;
    const slant = 4;
    
    // Create a gradient for a dual-tone fill.
    const baseColor = options.bgColor || "#ccc";
    const gradient = ctx.createLinearGradient(-eraserWidth / 2, -eraserHeight / 2, eraserWidth / 2, eraserHeight / 2);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(1, lightenColor(baseColor, 20));
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = options.iconColor || "#fff";
    ctx.lineWidth = 1;
    
    // Draw the eraser shape as a trapezoid.
    ctx.beginPath();
    ctx.moveTo(-eraserWidth / 2, eraserHeight / 2);          // Bottom–left
    ctx.lineTo(eraserWidth / 2, eraserHeight / 2);             // Bottom–right
    ctx.lineTo(eraserWidth / 2 - slant, -eraserHeight / 2);    // Top–right (slanted)
    ctx.lineTo(-eraserWidth / 2 + slant, -eraserHeight / 2);   // Top–left (slanted)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Optionally, add a highlight line along the top edge.
    ctx.beginPath();
    ctx.moveTo(-eraserWidth / 2 + slant, -eraserHeight / 2);
    ctx.lineTo(eraserWidth / 2 - slant, -eraserHeight / 2);
    ctx.strokeStyle = lightenColor(options.iconColor || "#fff", 20);
    ctx.stroke();
    
    ctx.restore();
  }
  
  function drawLightBulbIcon(ctx, x, y, options) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = options.iconColor || '#fff';
    ctx.strokeStyle = options.iconColor || '#fff';
    ctx.lineWidth = 1.5;
    
    // Bulb
    ctx.beginPath();
    ctx.arc(0, -3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Base
    ctx.beginPath();
    ctx.rect(-3, 2, 6, 3);
    ctx.fill();
    ctx.stroke();
    
    // Filament
    ctx.beginPath();
    ctx.moveTo(-2, -1);
    ctx.lineTo(2, -1);
    ctx.stroke();
    ctx.restore();
  }
  