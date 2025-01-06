export function renderNumberButtons(ctx, x, y, width, selectedNumber) {
    const buttonSize = width / 9;

    for (let i = 1; i <= 9; i++) {
        const btnX = x + (i - 1) * buttonSize;
        ctx.fillStyle = selectedNumber === i ? '#dcdcdc' : '#e0e0e0';  // Light grey base
        ctx.fillRect(btnX, y, buttonSize, buttonSize);

        ctx.fillStyle = '#007bff';  // Blue text for numbers
        ctx.fillText(i, btnX + buttonSize / 2, y + buttonSize / 2);
    }

    // Initialize button area for touch detection
    GameGlobal.sudokuBoard.buttonArea = {
        x,
        y,
        width,         
        height: buttonSize,
        buttonSize: buttonSize
    };
}

export function renderControlButtons(ctx, x, y, width) {
    const buttonWidth = width / 4 - 15; 
    const buttonHeight = width / 10;
    const spacing = 20;  

    // 1. Undo Button (First from Left)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Undo", x + buttonWidth / 2, y + buttonHeight / 2);

    GameGlobal.sudokuBoard.redoButtonArea = {
        x: x,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // 2. Marking Mode Button (Second Button)
    ctx.fillStyle = GameGlobal.sudokuBoard.markingMode ? '#aaf0d1' : '#f0f0f0';
    ctx.fillRect(x + buttonWidth + spacing, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x + buttonWidth + spacing, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Mark", x + buttonWidth + spacing + buttonWidth / 2, y + buttonHeight / 2);

    GameGlobal.sudokuBoard.markButtonArea = {
        x: x + buttonWidth + spacing,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // 3. Erase Button (Third Button)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x + (buttonWidth + spacing) * 2, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x + (buttonWidth + spacing) * 2, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Erase", x + (buttonWidth + spacing) * 2 + buttonWidth / 2, y + buttonHeight / 2);

    GameGlobal.sudokuBoard.eraseButtonArea = {
        x: x + (buttonWidth + spacing) * 2,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // 4. Hint Button (Fourth Button)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x + (buttonWidth + spacing) * 3, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x + (buttonWidth + spacing) * 3, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Hint", x + (buttonWidth + spacing) * 3 + buttonWidth / 2, y + buttonHeight / 2);

    GameGlobal.sudokuBoard.hintButtonArea = {
        x: x + (buttonWidth + spacing) * 3,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };
}