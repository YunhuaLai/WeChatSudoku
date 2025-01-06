export function renderTimer(ctx, x, y, width) {
    const time = GameGlobal.databus.getElapsedTime();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    ctx.font = `${Math.max(width / 18, 24)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#aaf0d1';

    ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, x + width / 2, y + 30);
}

export function renderPauseButton(ctx, x, y, width) {
    const buttonSize = width / 6;
    const barWidth = buttonSize / 6;
    const barHeight = buttonSize / 2;

    ctx.fillStyle = GameGlobal.databus.isPaused ? '#aaf0d1' : '#f0f0f0';
    ctx.fillRect(x + width - buttonSize - 20, y, buttonSize, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x + width - buttonSize - 20, y, buttonSize, barHeight);

    ctx.fillStyle = '#000';

    if (GameGlobal.databus.isPaused) {
        ctx.beginPath();
        ctx.moveTo(x + width - buttonSize / 2 - 20, y + barHeight / 4);
        ctx.lineTo(x + width - buttonSize / 2 + 10, y + barHeight / 2);
        ctx.lineTo(x + width - buttonSize / 2 - 20, y + (barHeight * 3) / 4);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.fillRect(x + width - buttonSize / 2 - barWidth - 20, y + barHeight / 4, barWidth, barHeight / 2);
        ctx.fillRect(x + width - buttonSize / 2 + barWidth - 20, y + barHeight / 4, barWidth, barHeight / 2);
    }

    GameGlobal.sudokuBoard.pauseButtonArea = {
        x: x + width - buttonSize - 20,
        y,
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