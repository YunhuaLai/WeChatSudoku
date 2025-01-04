export function renderBoard(ctx, sudokuBoard, boardSize, startX, startY) {
    const cellSize = boardSize / sudokuBoard.size;

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;  // Default thinner lines for the small grid

    // Draw the 9x9 grid lines
    for (let i = 0; i <= sudokuBoard.size; i++) {
        ctx.beginPath();
        
        // Horizontal lines
        ctx.moveTo(startX, startY + i * cellSize);
        ctx.lineTo(startX + boardSize, startY + i * cellSize);

        // Vertical lines
        ctx.moveTo(startX + i * cellSize, startY);
        ctx.lineTo(startX + i * cellSize, startY + boardSize);

        // Use thicker lines for 3x3 boxes and the outer border
        if (i % 3 === 0 || i === sudokuBoard.size) {
            ctx.strokeStyle = '#ddd';  // Light grey-white for emphasis
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = '#ddd';  // Standard black for regular lines
            ctx.lineWidth = 1;
        }
        ctx.stroke();
    }

    // Render numbers and marks after drawing grid
    renderNumbers(ctx, sudokuBoard.grid, sudokuBoard.originalGrid, sudokuBoard.marks, sudokuBoard.mistakes, sudokuBoard.size, boardSize, startX, startY);
    renderHighlight(ctx, GameGlobal.databus.lastPlacement, sudokuBoard.size, boardSize, startX, startY);
}

export function renderNumbers(ctx, grid, originalGrid, marks, mistakes, gridSize, boardSize, startX, startY) {
    const cellSize = boardSize / gridSize;
    ctx.font = `${Math.max(cellSize / 4, 15)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const key = `${row},${col}`;

            // Prevent accessing undefined rows
            if (!grid[row] || grid[row][col] === undefined) continue;

            // Determine color for the number
            if (grid[row][col] !== 0) {
                if (mistakes[key]) {
                    ctx.fillStyle = '#ff4d4d';  // Red for mistakes
                } else if (originalGrid[row][col] !== 0) {
                    ctx.fillStyle = '#bbb';  // Grey-white for original numbers
                } else {
                    ctx.fillStyle = '#007bff';  // Blue for user input
                }

                ctx.fillText(
                    grid[row][col],
                    startX + col * cellSize + cellSize / 2,
                    startY + row * cellSize + cellSize / 2
                );
            }

            // Render marks in 3x3 layout
            if (marks[key]) {
                ctx.font = `${Math.max(cellSize / 5, 12)}px Arial`;
                ctx.fillStyle = '#888';  // Light gray for marks
                const markArray = Array.from(marks[key]);

                for (let mark of markArray) {
                    const { offsetX, offsetY } = getMarkPosition(mark, cellSize);

                    ctx.fillText(
                        mark,
                        startX + col * cellSize + offsetX,
                        startY + row * cellSize + offsetY
                    );
                }
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

export function renderUndoAndMarkingButtons(ctx, x, y, width) {
    const buttonWidth = width / 2 - 10;  // Divide width by 2 with spacing
    const buttonHeight = width / 10;

    // Render Undo Button (Left Side)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.strokeRect(x, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Undo", x + buttonWidth / 2, y + buttonHeight / 2);

    // Store Undo Button Area
    GameGlobal.sudokuBoard.redoButtonArea = {
        x: x,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };

    // Render Marking Mode Button (Right Side)
    ctx.fillStyle = GameGlobal.sudokuBoard.markingMode ? '#aaf0d1' : '#f0f0f0';
    ctx.fillRect(x + buttonWidth + 20, y, buttonWidth, buttonHeight);  // +20 for spacing
    ctx.strokeRect(x + buttonWidth + 20, y, buttonWidth, buttonHeight);

    ctx.fillStyle = '#000';
    ctx.fillText("Mark", x + buttonWidth + 20 + buttonWidth / 2, y + buttonHeight / 2);

    // Store Marking Button Area
    GameGlobal.sudokuBoard.markButtonArea = {
        x: x + buttonWidth + 20,
        y: y,
        width: buttonWidth,
        height: buttonHeight
    };
}

function getMarkPosition(mark, cellSize) {
    const positions = {
        1: { x: 0, y: 0 },
        2: { x: 1, y: 0 },
        3: { x: 2, y: 0 },
        4: { x: 0, y: 1 },
        5: { x: 1, y: 1 },
        6: { x: 2, y: 1 },
        7: { x: 0, y: 2 },
        8: { x: 1, y: 2 },
        9: { x: 2, y: 2 }
    };

    const pos = positions[mark];
    const offsetX = pos.x * (cellSize / 3) + cellSize / 6;
    const offsetY = pos.y * (cellSize / 3) + cellSize / 6;

    return { offsetX, offsetY };
}

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

    ctx.fillStyle = GameGlobal.databus.isPaused ? '#aaf0d1' : '#f0f0f0';  // Green when paused
    ctx.fillRect(x + width - buttonSize - 20, y, buttonSize, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x + width - buttonSize - 20, y, buttonSize, barHeight);

    ctx.fillStyle = '#000';

    if (GameGlobal.databus.isPaused) {
        // Draw play icon (▶️) when paused
        ctx.beginPath();
        ctx.moveTo(x + width - buttonSize / 2 - 20, y + barHeight / 4);
        ctx.lineTo(x + width - buttonSize / 2 + 10, y + barHeight / 2);
        ctx.lineTo(x + width - buttonSize / 2 - 20, y + (barHeight * 3) / 4);
        ctx.closePath();
        ctx.fill();
    } else {
        // Draw two vertical bars (||) when running
        ctx.fillRect(
            x + width - buttonSize / 2 - barWidth - 20,
            y + barHeight / 4,
            barWidth,
            barHeight / 2
        );
        ctx.fillRect(
            x + width - buttonSize / 2 + barWidth - 20,
            y + barHeight / 4,
            barWidth,
            barHeight / 2
        );
    }

    // Track pause button area for touch detection
    GameGlobal.sudokuBoard.pauseButtonArea = {
        x: x + width - buttonSize - 20,
        y,
        width: buttonSize,
        height: barHeight
    };
}

export function renderPauseOverlay(ctx, boardSize, startX, startY) {
    const overlayColor = 'rgba(0, 0, 0, 0.6)';  // Semi-transparent dark overlay
    const buttonWidth = boardSize / 3;
    const buttonHeight = boardSize / 10;

    // Draw overlay covering the entire canvas
    ctx.fillStyle = overlayColor;
    ctx.fillRect(startX, startY, boardSize, boardSize);

    // Draw the resume button in the center
    ctx.fillStyle = '#aaf0d1';
    ctx.fillRect(
        startX + (boardSize - buttonWidth) / 2,
        startY + (boardSize - buttonHeight) / 2,
        buttonWidth,
        buttonHeight
    );

    ctx.strokeStyle = '#000';
    ctx.strokeRect(
        startX + (boardSize - buttonWidth) / 2,
        startY + (boardSize - buttonHeight) / 2,
        buttonWidth,
        buttonHeight
    );

    ctx.fillStyle = '#000';
    ctx.font = `${buttonHeight / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(
        "Resume",
        startX + boardSize / 2,
        startY + boardSize / 2 + buttonHeight / 4
    );

    // Track resume button area for touch detection
    GameGlobal.sudokuBoard.resumeButtonArea = {
        x: startX + (boardSize - buttonWidth) / 2,
        y: startY + (boardSize - buttonHeight) / 2,
        width: buttonWidth,
        height: buttonHeight
    };
}
