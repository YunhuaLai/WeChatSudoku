## 源码目录介绍

```
├── audio                                      // 音频资源
├── images                                     // 图片资源
├── js
│   ├── base
│   │   ├── animatoin.js                       // 帧动画的简易实现
│   │   ├── pool.js                            // 对象池的简易实现
│   │   └── sprite.js                          // 游戏基本元素精灵类
│   ├── libs
│   │   └── tinyemitter.js                     // 事件监听和触发
│   ├── npc
│   │   └── enemy.js                           // 敌机类
│   ├── player
│   │   ├── bullet.js                          // 子弹类
│   │   └── index.js                           // 玩家类
│   ├── runtime
│   │   ├── background.js                      // 背景类
│   │   ├── gameinfo.js                        // 用于展示分数和结算界面
│   │   └── music.js                           // 全局音效管理器
│   ├── databus.js                             // 管控游戏状态
│   ├── main.js                                // 游戏入口主函数
│   └── render.js                              // 基础渲染信息
├── .eslintrc.js                               // 代码规范
├── game.js                                    // 游戏逻辑主入口
├── game.json                                  // 游戏运行时配置
├── project.config.json                        // 项目配置
└── project.private.config.json                // 项目个人配置
```
Sudoku WeChat Mini-Game

Introduction

This is a Sudoku game designed as a WeChat Mini-Program. The game provides an interactive and user-friendly experience, allowing players to solve Sudoku puzzles with different difficulty levels. The application supports essential features such as number input, hints, marking mode, pause/resume functionality, and error tracking.

Features

Welcome Screen: Tap to start the game.

Difficulty Selection: Choose between Easy, Medium, and Hard modes.

Interactive Sudoku Board: Players can select and place numbers with touch interaction.

Error Tracking: Tracks and highlights incorrect inputs.

Marking Mode: Allows players to mark possible numbers in a cell.

Undo & Erase Functionality: Players can undo their last move or erase a selected cell.

Pause & Resume: Players can pause and resume the game at any time.

Hints: Provides hints for players who need help.

Project Structure

The project is structured into several JavaScript modules:

game.js: Entry point that initializes the game (Main class).

databus.js: Global state manager that maintains game status, score, errors, and selected elements.

render.js: Manages the canvas rendering settings.

main.js: Core game logic, handling events, rendering, and player inputs.

renderWelcome.js: Renders the welcome screen UI.

renderTopButtons.js: Renders the top bar, including the pause button, difficulty level, and timer.

renderBoard.js: Handles rendering of the Sudoku board, including number placements and highlights.

renderBottomButtons.js: Renders the number selection and control buttons.

gameinfo.js: Manages error display and game information.

moveHandler.js: Handles number placements, marking, undo, and erase operations.

sudokuGenerator.js: Generates a new Sudoku puzzle with a unique solution based on the selected difficulty.

sudokuBoard.js: Manages the Sudoku board logic, including validation and highlighting.

How to Play

Start the Game: Tap on the screen to proceed from the welcome screen.

Select Difficulty: Choose Easy, Medium, or Hard.

Input Numbers: Tap a cell and select a number from the bottom panel.

Marking Mode: Toggle marking mode to add small notes inside cells.

Undo/Erase: Undo the last move or erase the selected cell.

Pause & Resume: Pause the game and resume at any time.

Hints: Tap the hint button for assistance.

Win the Game: Complete the board correctly without errors!

Setup & Development

Prerequisites

WeChat Developer Tools

JavaScript (ES6+)

HTML5 Canvas API

Steps to Run Locally

Clone the repository.

Open the project in WeChat Developer Tools.

Run the mini-game in the WeChat simulator.

Modify the source code as needed for enhancements.

Future Improvements

Multiplayer Mode: Implement a competitive mode for multiple players.

Daily Challenges: Introduce daily Sudoku puzzles with leaderboards.

Achievements & Rewards: Reward players for completing puzzles.

Enhanced UI/UX: Improve graphics and animations for a better experience.

Contributors

Developer: Yunhua Lai

Technology Stack: JavaScript (ES6), HTML5 Canvas, WeChat Mini-Program API