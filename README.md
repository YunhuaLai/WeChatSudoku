# Sudoku WeChat Mini-Game
## Introduction

This is a Sudoku game designed as a WeChat Mini-Program. The game provides an interactive and user-friendly experience, allowing players to solve Sudoku puzzles with different difficulty levels. The application supports essential features such as number input, hints, marking mode, pause/resume functionality, and error tracking.

## Features

Welcome Screen: Tap to start the game.

Difficulty Selection: Choose between Easy, Medium, and Hard modes.

Interactive Sudoku Board: Players can select and place numbers with touch interaction.

Error Tracking: Tracks and highlights incorrect inputs.

Marking Mode: Allows players to mark possible numbers in a cell.

Undo & Erase Functionality: Players can undo their last move or erase a selected cell.

Pause & Resume: Players can pause and resume the game at any time.

Hints: Provides hints for players who need help.

## Project Structure
```
├── audio                                      // Audio resources
├── images                                     // Image resources
├── js
│   ├── game
│   │   ├── sudokuBoard.js                     // Sudoku game logic
│   │   ├── moveHandler.js                     // Handles game moves
│   │   ├── sudokuGenerator.js                 // Sudoku puzzle generator
│   ├── runtime
│   │   ├── gameinfo.js                        // Displays score and game results
│   ├── ui
│   │   ├── renderWelcome.js                   // Renders the welcome screen
│   │   ├── renderTopButtons.js                // Renders the top buttons
│   │   ├── renderBoard.js                     // Renders the Sudoku board
│   │   ├── renderBottomButtons.js             // Renders the bottom buttons
│   ├── databus.js                             // Manages game state
│   ├── main.js                                // Main game entry point
│   ├── render.js                              // Base rendering functions
├── .eslintrc.js                               // Code style rules
├── game.js                                    // Game logic entry point
├── game.json                                  // Game runtime configuration
├── project.config.json                        // Project configuration
├── project.private.config.json                // Personal project configuration
```
## How to Play

Start the Game: Tap on the screen to proceed from the welcome screen.

Select Difficulty: Choose Easy, Medium, or Hard.

Input Numbers: Tap a cell and select a number from the bottom panel.

Marking Mode: Toggle marking mode to add small notes inside cells.

Undo/Erase: Undo the last move or erase the selected cell.

Pause & Resume: Pause the game and resume at any time.

Hints: Tap the hint button for assistance.

Win the Game: Complete the board correctly without errors!

## Setup & Development

### Prerequisites

WeChat Developer Tools

JavaScript (ES6+)

HTML5 Canvas API

### Steps to Run Locally

Clone the repository.

Open the project in WeChat Developer Tools.

Run the mini-game in the WeChat simulator.

Modify the source code as needed for enhancements.

## Future Improvements

Multiplayer Mode: Implement a competitive mode for multiple players.

Daily Challenges: Introduce daily Sudoku puzzles with leaderboards.

Achievements & Rewards: Reward players for completing puzzles.

Enhanced UI/UX: Improve graphics and animations for a better experience.

## Contributors

Developer: Yunhua Lai

Technology Stack: JavaScript (ES6), HTML5 Canvas, WeChat Mini-Program API