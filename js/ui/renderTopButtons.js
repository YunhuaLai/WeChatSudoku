export function renderPauseButton(ctx, x, y, width) {
    const buttonSize = width / 12;  // Smaller button size
    const barWidth = buttonSize / 6;
    const barHeight = buttonSize / 1.5;

    const offsetY = barHeight / 2;  // Center the button by adjusting vertically

    ctx.strokeStyle = '#fff';  // White for the hollow columns
    ctx.lineWidth = 3;

    // Calculate the Y position to vertically center the button relative to y
    const centerY = y - 20 - barHeight / 2;

    // Draw two hollow vertical bars (||) for pause
    ctx.strokeRect(
        x + width - buttonSize - 20,
        centerY,
        barWidth,
        barHeight
    );
    ctx.strokeRect(
        x + width - buttonSize + barWidth - 15,
        centerY,
        barWidth,
        barHeight
    );

    // Store pause button area for touch detection
    GameGlobal.sudokuBoard.pauseButtonArea = {
        x: x + width - buttonSize - 20,
        y: centerY,
        width: buttonSize,
        height: barHeight
    };
}

export function renderPauseOverlay(ctx, boardSize, startX, startY) {
    const overlayColor = 'rgba(0, 0, 0, 0.6)';
    const buttonWidth = boardSize / 3;
    const buttonHeight = boardSize / 10;

    ctx.fillStyle = overlayColor;
    ctx.fillRect(startX, startY, boardSize, boardSize);

    ctx.fillStyle = '#aaf0d1';
    ctx.fillRect(startX + (boardSize - buttonWidth) / 2, startY + (boardSize - buttonHeight) / 2, buttonWidth, buttonHeight);
    ctx.strokeRect(startX + (boardSize - buttonWidth) / 2, startY + (boardSize - buttonHeight) / 2, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.font = `${buttonHeight / 2}px Arial`;
    ctx.fillText("Resume", startX + boardSize / 2, startY + boardSize / 2 + buttonHeight / 4);

    GameGlobal.sudokuBoard.resumeButtonArea = {
        x: startX + (boardSize - buttonWidth) / 2,
        y: startY + (boardSize - buttonHeight) / 2,
        width: buttonWidth,
        height: buttonHeight
    };
}

export function renderTopStatusBar(ctx, x, y, width) {
    const time = GameGlobal.databus.getElapsedTime();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const errors = GameGlobal.databus.errors;
    const difficulty = GameGlobal.databus.difficulty || 'Easy';

    const fontSize = Math.max(width / 20, 24);

    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#bbb';  // Light grey for default text

    // Difficulty
    ctx.fillText(`${difficulty}`, x + 20, y-20);

    // Error Counter
    ctx.fillStyle = '#ff4d4d';  // Red for mistakes
    ctx.fillText(`Errors: ${errors}`, x + width / 3, y-20 );

    // Timer
    ctx.fillStyle = '#aaf0d1';  // Light green for the timer
    ctx.textAlign = 'right';
    ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, x + width - 60, y-20);
}