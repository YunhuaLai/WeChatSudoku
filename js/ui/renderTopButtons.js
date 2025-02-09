import { UI_CONFIG } from './config.js';
import { drawRoundedRect, drawCenteredText,createVerticalGradient } from './utils.js';
import { LAYOUT } from './layoutConfig.js';

/**
 * Renders the "New Game" button on the top row.
 * The text is vertically centered with the "+" icon.
 */
export function renderNewGameButton(ctx, x, y, boardSize) {
  const buttonHeight = boardSize / 14;
  const iconSize = buttonHeight * 0.6;
  const textPadding = 14;
  const textColor = UI_CONFIG.colors.defaultText;
  const light = 'rgba(200, 200, 200, 0.3)'

  // Set font and alignments.
  ctx.font = `${iconSize}px ${UI_CONFIG.fonts.base}`;
  ctx.textBaseline = 'middle'; // Use middle baseline for vertical centering
  const textWidth = ctx.measureText('New Game').width;
  const buttonWidth = iconSize + textPadding + textWidth + 30;

  // Draw the rounded rectangle border.
  drawRoundedRect(ctx, x, y, buttonWidth, buttonHeight, 10, light, UI_CONFIG.lineWidth);

  // Draw the "+" icon.
  const iconX = x + buttonHeight * 0.7;
  const iconY = y + buttonHeight / 2;  // Centered vertically in the button
  ctx.lineWidth = UI_CONFIG.lineWidth;
  ctx.beginPath();
  ctx.moveTo(iconX - iconSize / 2, iconY);
  ctx.lineTo(iconX + iconSize / 2, iconY);
  ctx.moveTo(iconX, iconY - iconSize / 2);
  ctx.lineTo(iconX, iconY + iconSize / 2);
  ctx.stroke();

  // Draw "New Game" text, aligned vertically with the icon.
  ctx.font = `${iconSize}px ${UI_CONFIG.fonts.base}`;
  ctx.textAlign = 'left';
  ctx.fillStyle = textColor;
  // Use y + buttonHeight/2 to center text vertically
  ctx.fillText('New Game', iconX + iconSize + textPadding, y + buttonHeight / 2);

  GameGlobal.sudokuBoard.newGameButtonArea = {
    x,
    y,
    width: buttonWidth,
    height: buttonHeight
  };
}

/**
 * Renders the status bar row containing difficulty, error count, and timer.
 * The timer text is shifted left to avoid overlapping with the pause button.
 */
export function renderStatusBar(ctx, canvas, boardSize, statusBarY, statusBarHeight) {
  const boardX = (canvas.width - boardSize) / 2;
  const time = GameGlobal.databus.getElapsedTime();
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const errors = GameGlobal.databus.errors;
  const difficulty = GameGlobal.databus.difficulty || 'Easy';

  const fontSize = Math.max(boardSize / 20, 24);
  ctx.font = `${fontSize}px ${UI_CONFIG.fonts.base}`;
  ctx.textBaseline = 'middle';
  const centerY = statusBarY + statusBarHeight / 2;

  // Calculate pause button width to reserve space for timer text.
  const pauseButtonSize = boardSize / 12;
  const barWidth = pauseButtonSize / 6;
  const pauseButtonWidth = barWidth * 2 + UI_CONFIG.padding.small;

  // Render difficulty (left-aligned).
  ctx.textAlign = 'left';
  ctx.fillStyle = UI_CONFIG.colors.defaultText;
  ctx.fillText(difficulty, boardX + UI_CONFIG.padding.medium, centerY);

  // Render error count (centered).
  ctx.textAlign = 'center';
  ctx.fillStyle = UI_CONFIG.colors.errorText;
  ctx.fillText(`Errors: ${errors}`, boardX + boardSize / 2, centerY);

  // Render timer (right-aligned) with extra space reserved for the pause button.
  ctx.textAlign = 'right';
  ctx.fillStyle = UI_CONFIG.colors.resumeButton;
  const timerX = boardX + boardSize - UI_CONFIG.padding.medium - pauseButtonWidth - 5;
  ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, timerX, centerY);
}

/**
 * Renders the pause button on the right side of the status bar row.
 */
export function renderPauseButton(ctx, canvasWidth, statusBarY, statusBarHeight, boardSize) {
  const buttonSize = boardSize / 12;
  const barWidth = buttonSize / 6;
  const barHeight = buttonSize / 1.5;

  ctx.strokeStyle = UI_CONFIG.colors.pauseBar;
  ctx.lineWidth = UI_CONFIG.lineWidth;

  // Calculate board's left edge.
  const boardX = (canvasWidth - boardSize) / 2;
  // Position the pause button flush to the board's right edge.
  const pauseButtonX = boardX + boardSize - UI_CONFIG.padding.medium - (barWidth * 2 + UI_CONFIG.padding.small);
  // Center the pause button vertically within the status bar row.
  const pauseButtonY = statusBarY + (statusBarHeight - barHeight) / 2;

  // Draw the two vertical bars.
  ctx.strokeRect(pauseButtonX, pauseButtonY, barWidth, barHeight);
  ctx.strokeRect(pauseButtonX + barWidth + UI_CONFIG.padding.small, pauseButtonY, barWidth, barHeight);

  GameGlobal.sudokuBoard.pauseButtonArea = {
    x: pauseButtonX,
    y: pauseButtonY,
    width: barWidth * 2 + UI_CONFIG.padding.small,
    height: barHeight
  };
}

/**
 * Renders the pause overlay (for when the game is paused).
 */
import { drawModernButton } from './utils';

export function renderPauseOverlay(ctx, boardSize, startX, startY) {
  const overlayColor = UI_CONFIG.colors.overlay;
  const buttonWidth = boardSize / 3;
  const buttonHeight = boardSize / 10;
  const buttonSpacing = buttonHeight * 0.4; // Space between buttons

  // Draw overlay background.
  ctx.fillStyle = overlayColor;
  ctx.fillRect(startX, startY, boardSize, boardSize);

  // Center the buttons.
  const btnX = startX + (boardSize - buttonWidth) / 2;
  const btnY = startY + (boardSize - buttonHeight) / 2;

  // Draw Resume button.
  drawModernButton(ctx, btnX, btnY, buttonWidth, buttonHeight, "Resume", "resume", {
    bgColor: UI_CONFIG.colors.resumeButton,
  });

  // Draw Save button below Resume.
  const saveBtnY = btnY + buttonHeight + buttonSpacing;
  drawModernButton(ctx, btnX, saveBtnY, buttonWidth, buttonHeight, "Save", "save", {
    bgColor: UI_CONFIG.colors.saveButton || '#4CAF50', // Default green
  });

  // Store button areas for interaction.
  GameGlobal.sudokuBoard.resumeButtonArea = {
    x: btnX,
    y: btnY,
    width: buttonWidth,
    height: buttonHeight
  };

  GameGlobal.sudokuBoard.saveButtonArea = {
    x: btnX,
    y: saveBtnY,
    width: buttonWidth,
    height: buttonHeight
  };
}

  
/**
 * Renders the difficulty selection bar at the bottom.
 */
export function renderDifficultyBar(ctx, canvas) {
  const barHeight = canvas.height / 3;
  const buttonHeight = 60;
  const buttonWidth = canvas.width / 2.5;
  const x = (canvas.width - buttonWidth) / 2;
  const y = canvas.height - barHeight;

  ctx.fillStyle = UI_CONFIG.colors.overlayBg;
  ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  difficulties.forEach((difficulty, index) => {
    const btnY = y + index * 80;

    ctx.fillStyle = UI_CONFIG.colors.difficultyButtonBg;
    ctx.fillRect(x, btnY, buttonWidth, buttonHeight);
    ctx.strokeStyle = UI_CONFIG.colors.defaultText;
    ctx.lineWidth = UI_CONFIG.lineWidth;
    ctx.strokeRect(x, btnY, buttonWidth, buttonHeight);

    ctx.font = `28px ${UI_CONFIG.fonts.base}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = UI_CONFIG.colors.difficultyButtonText;
    ctx.fillText(difficulty, x + buttonWidth / 2, btnY + buttonHeight / 2);

    GameGlobal.sudokuBoard[`difficultyButton_${difficulty.toLowerCase()}`] = {
      x,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight
    };
  });
}

/**
 * Combined header render function.
 * This renders two separate rows:
 *   - The first row (top row) contains the New Game button.
 *   - The second row (status row) contains the status bar (difficulty, errors, timer)
 *     and the pause button (aligned on its right).
 */
export function renderHeaderUI(ctx, canvas, boardSize) {
  // Calculate board's left edge.
  const boardX = (canvas.width - boardSize) / 2;
  // Top of header block.
  const headerTop = LAYOUT.headerTopMargin;

  // --- Render New Game Button Row ---
  const newGameButtonHeight = boardSize / 14;
  renderNewGameButton(ctx, boardX + UI_CONFIG.padding.medium, headerTop, boardSize);

  // --- Render Status Bar Row ---
  const headerSpacing = LAYOUT.headerSpacing;
  // Status bar row starts below the New Game button.
  const statusBarY = headerTop + newGameButtonHeight + headerSpacing;
  const statusBarHeight = boardSize / 10;

  // Render the status bar (difficulty, errors, timer).
  renderStatusBar(ctx, canvas, boardSize, statusBarY, statusBarHeight);
  // Render the pause button within the same status row.
  renderPauseButton(ctx, canvas.width, statusBarY, statusBarHeight, boardSize);
}

export function renderSaveButton(ctx, canvasWidth, y, boardSize) {
    const buttonWidth = boardSize / 4;
    const buttonHeight = boardSize / 12;
    const x = canvasWidth - buttonWidth - 20;

    ctx.fillStyle = '#007bff';
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Save", x + buttonWidth / 2, y + buttonHeight / 2 + 5);

    GameGlobal.sudokuBoard.saveButtonArea = { x, y, width: buttonWidth, height: buttonHeight };
}






export function renderLoadButton(ctx, canvasWidth, y, boardSize) {
    const buttonWidth = boardSize / 4;
    const buttonHeight = boardSize / 12;
    const x = canvasWidth - buttonWidth * 2 - 40;

    ctx.fillStyle = '#28a745';
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Load", x + buttonWidth / 2, y + buttonHeight / 2 + 5);

    GameGlobal.sudokuBoard.loadButtonArea = { x, y, width: buttonWidth, height: buttonHeight };
}