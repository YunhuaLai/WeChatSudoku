export function renderNumberButtons(ctx, x, y, width, selectedNumber) {
    const buttonSize = width / 9;

    // Draw dark grey background bar for the number buttons
    ctx.fillStyle = '#444';  // Dark grey
    ctx.fillRect(x, y, width, buttonSize);

    for (let i = 1; i <= 9; i++) {
        const btnX = x + (i - 1) * buttonSize;

        // Highlight the selected button with a lighter grey
        ctx.fillStyle = selectedNumber === i ? '#666' : '#444';
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

    // Draw dark grey bar background for control buttons
    const barHeight = buttonHeight + 20;
    ctx.fillStyle = '#444';  // Dark grey background
    ctx.fillRect(x, y, width + spacing * 3, barHeight);

    ctx.lineWidth = 2;  // Stroke thickness for icons
    ctx.strokeStyle = '#fff';  // White outline for icons
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';

    // 1. Undo Button (Anti-clockwise Arrow)
    ctx.fillStyle = '#666';
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x, y, buttonWidth, buttonHeight);

    drawUndoIcon(ctx, x + buttonWidth / 2, y + buttonHeight / 2);
    ctx.fillStyle = '#fff';
    ctx.fillText("Undo", x + buttonWidth / 2, y + buttonHeight + 15);

    GameGlobal.sudokuBoard.redoButtonArea = {
        x: x,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // 2. Marking Mode Button (Pencil)
    ctx.fillStyle = GameGlobal.sudokuBoard.markingMode ? '#aaf0d1' : '#666';
    ctx.fillRect(x + buttonWidth + spacing, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x + buttonWidth + spacing, y, buttonWidth, buttonHeight);

    drawPencilIcon(ctx, x + buttonWidth + spacing + buttonWidth / 2, y + buttonHeight / 2 - 5);  
    ctx.fillStyle = '#fff';
    ctx.fillText("Mark", x + buttonWidth + spacing + buttonWidth / 2, y + buttonHeight + 15);

    GameGlobal.sudokuBoard.markButtonArea = {
        x: x + buttonWidth + spacing,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // 3. Erase Button (Rubber)
    ctx.fillStyle = '#666';
    ctx.fillRect(x + (buttonWidth + spacing) * 2, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x + (buttonWidth + spacing) * 2, y, buttonWidth, buttonHeight);

    drawEraserIcon(ctx, x + (buttonWidth + spacing) * 2 + buttonWidth / 2, y + buttonHeight / 2 - 5);  
    ctx.fillStyle = '#fff';
    ctx.fillText("Erase", x + (buttonWidth + spacing) * 2 + buttonWidth / 2, y + buttonHeight + 15);

    GameGlobal.sudokuBoard.eraseButtonArea = {
        x: x + (buttonWidth + spacing) * 2,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // 4. Hint Button (Light Bulb)
    ctx.fillStyle = '#666';
    ctx.fillRect(x + (buttonWidth + spacing) * 3, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x + (buttonWidth + spacing) * 3, y, buttonWidth, buttonHeight);

    drawLightBulbIcon(ctx, x + (buttonWidth + spacing) * 3 + buttonWidth / 2, y + buttonHeight / 2 - 5);  
    ctx.fillStyle = '#fff';
    ctx.fillText("Hint", x + (buttonWidth + spacing) * 3 + buttonWidth / 2, y + buttonHeight + 15);

    GameGlobal.sudokuBoard.hintButtonArea = {
        x: x + (buttonWidth + spacing) * 3,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };
}

function drawUndoIcon(ctx, x, y) {
    const radius = 10;  // Radius for the arc
    const arrowSize = 6;  // Size of the arrowhead

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = "red";  // Default color
    ctx.lineWidth = 5;  // Default size

    ctx.beginPath();
}


function drawPencilIcon(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 6);
    ctx.lineTo(x, y - 6);
    ctx.lineTo(x + 6, y + 6);
    ctx.lineTo(x - 6, y + 6);
    ctx.stroke();
}

function drawEraserIcon(ctx, x, y) {
    ctx.beginPath();
    ctx.rect(x - 8, y - 4, 16, 8);
    ctx.stroke();
}

function drawLightBulbIcon(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y - 4, 6, Math.PI, 0);
    ctx.moveTo(x - 4, y);
    ctx.lineTo(x + 4, y);
    ctx.stroke();
}
