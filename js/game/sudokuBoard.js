import { placeNumber as handlePlaceNumber, placeMark as handlePlaceMark, undoLastMove as handleUndoLastMove, eraseSelectedCell as handleErase} from './moveHandler';
import { generateSudoku,isValid } from './sudokuGenerator';
import DataBus from '../databus';  // Import DataBus instance
const databus = new DataBus();  // Singleton instance of DataBus


export default class SudokuBoard {
    constructor() {
        this.grid = [];  // Sudoku grid
        this.originalGrid = [];  // Unsolved grid
        this.solution = [];  
        this.mistakes = {};
        this.moveHistory = [];
        this.marks = {};
        this.size = 9;
        this.markingMode = false;
    }

    init() {
        const { board, solution } = generateSudoku();
        this.grid = board;
        this.solution = solution;
        this.originalGrid = JSON.parse(JSON.stringify(this.grid));
        this.mistakes = {};
        databus.setSudokuGrid(this.grid, this.solution);
    }

    // Toggle marking mode
    toggleMarkingMode() {
        this.markingMode = !this.markingMode;
        console.log(`Marking Mode: ${this.markingMode ? "ON" : "OFF"}`);
    }
  
    canPlaceNumber(x, y, value) {
      if (this.originalGrid[x][y] !== 0) return false;  // 初始格子不可修改
      return isValid(this.grid, x, y, value);
    }

    isValid(board, row, col, num) {
        return isValid(board, row, col, num, this.size);
    }
    
    placeNumber(x, y, value) {
        handlePlaceNumber(this, x, y, value);  // Call imported placeNumber
    }
    
    undoLastMove() {
        handleUndoLastMove(this);  // Call imported undoLastMove
    }
    
    placeMark(x, y, value) {
        handlePlaceMark(this, x, y, value);  // Call imported placeMark
    }

    eraseSelectedCell() {
        handleErase(this);  // Call the imported erase function
    }
    
    isComplete() {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          if (this.grid[row][col] === 0) return false;
        }
      }
      return true;
    }

    highlightSameNumber() {
        const selectedCell = GameGlobal.databus.selectedCell;
        if (!selectedCell) return;
    
        const { x, y } = selectedCell;
        const currentNumber = this.grid[y][x];
    
        // Highlight the current number if present
        if (currentNumber !== 0) {
            GameGlobal.databus.setHighlightedNumber(currentNumber);
        } else {
            GameGlobal.databus.setHighlightedNumber(null);  // Reset if empty cell
        }
    }
    
    placeSelectedNumber(selectedNumber) {
        const selectedCell = GameGlobal.databus.selectedCell;
        const highlightedNumber = GameGlobal.databus.highlightedNumber;
        if (selectedCell) {
            const { x, y } = selectedCell;  // x = col, y = row
    
            if (this.markingMode) {
                this.placeMark(y, x, selectedNumber);  // y = row, x = col
            } 
            else {
                this.placeNumber(y, x, selectedNumber);  // y = row, x = col
            }
    
            console.log(`Placed ${selectedNumber} at row: ${y}, col: ${x}`);
        } else {
            console.log("No cell selected! Tap a cell first.");
        }
    }
}
  