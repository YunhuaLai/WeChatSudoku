export function renderBoard(ctx, sudokuBoard, boardSize, startX, startY) {
    const cellSize = boardSize / sudokuBoard.size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(startX, startY, boardSize, boardSize);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    for (let i = 0; i <= sudokuBoard.size; i++) {
        ctx.beginPath();
        ctx.moveTo(startX + i * cellSize, startY);
        ctx.lineTo(startX + i * cellSize, startY + boardSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(startX, startY + i * cellSize);
        ctx.lineTo(startX + boardSize, startY + i * cellSize);
        ctx.stroke();
    }

    renderNumbers(ctx, sudokuBoard.grid, sudokuBoard.mistakes, sudokuBoard.size, boardSize, startX, startY);
    renderHighlight(ctx, GameGlobal.databus.lastPlacement, sudokuBoard.size, boardSize, startX, startY);
}

export function renderNumbers(ctx, grid, mistakes, gridSize, boardSize, startX, startY) {
    const cellSize = boardSize / gridSize;

    ctx.font = `${cellSize / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] !== 0) {
                ctx.fillStyle = mistakes[`${row},${col}`] ? '#ff4d4d' : '#000';
                ctx.fillText(
                    grid[row][col],
                    startX + col * cellSize + cellSize / 2,
                    startY + row * cellSize + cellSize / 2
                );
            }
        }
    }
}

export function renderHighlight(ctx, lastPlacement, gridSize, boardSize, startX, startY) {
    if (lastPlacement) {
        const { row, col } = lastPlacement;
        const cellSize = boardSize / gridSize;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(
            startX + col * cellSize,
            startY + row * cellSize,
            cellSize,
            cellSize
        );
    }
}

export function renderNumberButtons(ctx, x, y, width, selectedNumber) {
    const buttonSize = width / 9;

    for (let i = 1; i <= 9; i++) {
        const btnX = x + (i - 1) * buttonSize;
        ctx.fillStyle = selectedNumber === i ? '#dcdcdc' : '#f0f0f0';
        ctx.fillRect(btnX, y, buttonSize, buttonSize);
        ctx.strokeRect(btnX, y, buttonSize, buttonSize);

        ctx.fillStyle = '#000';
        ctx.fillText(i, btnX + buttonSize / 2, y + buttonSize / 2);
    }

    // Initialize button area for touch detection
    GameGlobal.sudokuBoard.buttonArea = {
        x,
        y,
        buttonSize
    };
}

export function renderUndoButton(ctx, x, y, width) {
    const buttonSize = width / 2;
    const buttonHeight = buttonSize / 2;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x + width / 4, y, buttonSize, buttonHeight);
    ctx.strokeRect(x + width / 4, y, buttonSize, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Undo", x + width / 2, y + buttonHeight / 2);

    // Initialize redo button area for touch detection
    GameGlobal.sudokuBoard.redoButtonArea = {
        x: x + width / 4,
        y,
        width: buttonSize,
        height: buttonHeight
    };
}

