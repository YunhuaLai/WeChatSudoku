export function renderWelcomeScreen(ctx, canvasWidth, canvasHeight) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';  // Semi-transparent background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sudoku', canvasWidth / 2, canvasHeight / 3);

    ctx.font = '24px Arial';
    ctx.fillText('Tap to Start', canvasWidth / 2, canvasHeight / 2);

    // Track button area for interaction
    GameGlobal.sudokuBoard.startButtonArea = {
        x: canvasWidth / 2 - 100,
        y: canvasHeight / 2 - 30,
        width: 200,
        height: 60
    };
}

export function renderDifficultyScreen(ctx, canvas) {
    const width = canvas.width / 2;
    const height = 60;
    const x = canvas.width / 4;
    const y = canvas.height / 2;

    const difficulties = ['Easy', 'Medium', 'Hard'];

    // Render difficulty buttons
    difficulties.forEach((difficulty, index) => {
        const btnY = y + index * 80;

        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(x, btnY, width, height);
        ctx.strokeRect(x, btnY, width, height);

        ctx.fillStyle = '#000';
        ctx.font = '28px Arial';
        ctx.fillText(
            difficulty,
            x + width / 2,
            btnY + height / 2 + 8
        );

        // Store button area for click detection
        GameGlobal.sudokuBoard[`difficultyButton_${difficulty.toLowerCase()}`] = {
            x,
            y: btnY,
            width,
            height
        };
    });

    // 🔹 Add a Resume Button if a game is in progress
    if (!GameGlobal.databus.isWelcomeScreen && !GameGlobal.databus.isGameOver) {
        const resumeBtnY = y + difficulties.length * 80 + 40; // Position below the last difficulty button

        ctx.fillStyle = '#aaf0d1';  // Light green for Resume button
        ctx.fillRect(x, resumeBtnY, width, height);
        ctx.strokeRect(x, resumeBtnY, width, height);

        ctx.fillStyle = '#000';
        ctx.font = '28px Arial';
        ctx.fillText(
            'Resume',
            x + width / 2,
            resumeBtnY + height / 2 + 8
        );

        // Store Resume button area for interaction
        GameGlobal.sudokuBoard.resumeButtonArea = {
            x,
            y: resumeBtnY,
            width,
            height
        };
    }
}