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

export function renderNewGameButton(ctx, x, y, width) {
    const buttonHeight = width / 14;  // Slightly larger height for better balance
    const iconSize = buttonHeight * 0.6;  // "+" size based on button height
    const textPadding = 14;  // Space between "+" and "New Game"
    const textColor = '#bbb';  // Grey-white for text

    // Set font size equal to the icon size
    ctx.font = `${iconSize}px Arial`;
    const textWidth = ctx.measureText('New Game').width;

    const buttonWidth = iconSize + textPadding + textWidth + 30;  // Slightly wider button

    // Draw the rounded rectangle border
    const radius = 10;  // Smooth rounded corners
    ctx.lineWidth = 2;
    ctx.strokeStyle = textColor;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + buttonWidth - radius, y);
    ctx.quadraticCurveTo(x + buttonWidth, y, x + buttonWidth, y + radius);
    ctx.lineTo(x + buttonWidth, y + buttonHeight - radius);
    ctx.quadraticCurveTo(x + buttonWidth, y + buttonHeight, x + buttonWidth - radius, y + buttonHeight);
    ctx.lineTo(x + radius, y + buttonHeight);
    ctx.quadraticCurveTo(x, y + buttonHeight, x, y + buttonHeight - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();

    // Draw "+" icon (Left side)
    const iconX = x + buttonHeight * 0.7;  // Adjusted to center within the height
    const iconY = y + buttonHeight / 2;

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(iconX - iconSize / 2, iconY);  // Horizontal line
    ctx.lineTo(iconX + iconSize / 2, iconY);
    ctx.moveTo(iconX, iconY - iconSize / 2);  // Vertical line
    ctx.lineTo(iconX, iconY + iconSize / 2);
    ctx.stroke();

    // Draw "New Game" text (Align with "+")
    ctx.font = `${iconSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillStyle = textColor;
    ctx.fillText(
        'New Game',
        iconX + iconSize / 1.2 + textPadding,  // Closer to the "+"
        y + buttonHeight / 1.55
    );

    // Store button area for touch detection
    GameGlobal.sudokuBoard.newGameButtonArea = {
        x: x,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };
}

export function renderDifficultyBar(ctx, canvas) {
    const barHeight = canvas.height / 3;
    const buttonHeight = 60;
    const buttonWidth = canvas.width / 2.5;
    const x = (canvas.width - buttonWidth) / 2;
    const y = canvas.height - barHeight;

    // Background overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

    const difficulties = ['Easy', 'Medium', 'Hard'];

    difficulties.forEach((difficulty, index) => {
        const btnY = y + index * 80;

        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(x, btnY, buttonWidth, buttonHeight);
        ctx.strokeRect(x, btnY, buttonWidth, buttonHeight);

        ctx.fillStyle = '#000';
        ctx.font = '28px Arial';
        ctx.fillText(
            difficulty,
            x + buttonWidth / 2,
            btnY + buttonHeight / 2 + 10
        );

        // Track each difficulty button area
        GameGlobal.sudokuBoard[`difficultyButton_${difficulty.toLowerCase()}`] = {
            x,
            y: btnY,
            width: buttonWidth,
            height: buttonHeight
        };
    });
}