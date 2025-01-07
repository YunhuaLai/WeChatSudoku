export function renderBoard(ctx, sudokuBoard, boardSize, startX, startY) {
    const cellSize = boardSize / sudokuBoard.size;

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;  // Default thinner lines for the small grid

    // Highlight the selected row, column, and 3x3 box
    highlightSelection(ctx, sudokuBoard, boardSize, startX, startY);

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
    const mainFontSize = `${Math.max(cellSize / 4, 15)}px Arial`;  // Store main font size
    ctx.font = mainFontSize;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const highlightedNumber = GameGlobal.databus.highlightedNumber;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const key = `${row},${col}`;
            const value = grid[row][col];

            if (!grid[row] || grid[row][col] === undefined) continue;

            // 1. Highlight matching numbers
            if (highlightedNumber && value === highlightedNumber) {
                ctx.fillStyle = '#d6d6d6';  // Light grey for highlight
                ctx.fillRect(
                    startX + col * cellSize,
                    startY + row * cellSize,
                    cellSize,
                    cellSize
                );
            }

            // 2. Draw main grid numbers
            if (value !== 0) {
                ctx.font = mainFontSize;  // Reset to main font size
                if (mistakes[key]) {
                    ctx.fillStyle = '#ff4d4d';
                } else if (originalGrid[row][col] !== 0) {
                    ctx.fillStyle = '#bbb';
                } else {
                    ctx.fillStyle = '#007bff';
                }
                ctx.fillText(
                    value,
                    startX + col * cellSize + cellSize / 2,
                    startY + row * cellSize + cellSize / 2
                );
            }

            // 3. Draw marks (small numbers)
            if (marks[key]) {
                const markFontSize = `${Math.max(cellSize / 5, 12)}px Arial`;
                ctx.font = markFontSize;  // Set smaller font for marks
                ctx.fillStyle = '#888';
                const markArray = Array.from(marks[key]);
                
                for (let mark of markArray) {
                    const { offsetX, offsetY } = getMarkPosition(mark, cellSize);
                    
                    // Highlight marks that match the selected number
                    if (highlightedNumber && mark === highlightedNumber) {
                        ctx.fillStyle = '#ffcc80';  // Light orange for mark highlight
                    } else {
                        ctx.fillStyle = '#888';
                    }

                    ctx.fillText(
                        mark,
                        startX + col * cellSize + offsetX,
                        startY + row * cellSize + offsetY
                    );
                }

                // Reset to the main font size after rendering marks
                ctx.font = mainFontSize;
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


function highlightSelection(ctx, sudokuBoard, boardSize, startX, startY) {
    const selectedCell = GameGlobal.databus.selectedCell;
    if (!selectedCell) return;  // No selection, skip highlighting

    const { x, y } = selectedCell;
    const cellSize = boardSize / sudokuBoard.size;
    const subGridSize = 3;

    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';  // Light grey for highlights

    // Highlight row and column
    ctx.fillRect(startX, startY + y * cellSize, boardSize, cellSize);  // Row
    ctx.fillRect(startX + x * cellSize, startY, cellSize, boardSize);  // Column

    // Highlight 3x3 subgrid
    const boxStartRow = Math.floor(y / subGridSize) * subGridSize;
    const boxStartCol = Math.floor(x / subGridSize) * subGridSize;

    for (let row = 0; row < subGridSize; row++) {
        for (let col = 0; col < subGridSize; col++) {
            ctx.fillRect(
                startX + (boxStartCol + col) * cellSize,
                startY + (boxStartRow + row) * cellSize,
                cellSize,
                cellSize
            );
        }
    }
}

