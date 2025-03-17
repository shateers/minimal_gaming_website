
import { Board, Position } from "./types";

// Check if a queen can be placed at the given position
export const canPlaceQueen = (
  row: number,
  col: number,
  boardState: Board
): boolean => {
  const size = boardState.length;

  // Check row
  for (let j = 0; j < size; j++) {
    if (j !== col && boardState[row][j]) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < size; i++) {
    if (i !== row && boardState[i][col]) {
      return false;
    }
  }

  // Check diagonals
  // Up-left
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (boardState[i][j]) return false;
  }

  // Up-right
  for (let i = row - 1, j = col + 1; i >= 0 && j < size; i--, j++) {
    if (boardState[i][j]) return false;
  }

  // Down-left
  for (let i = row + 1, j = col - 1; i < size && j >= 0; i--, j--) {
    if (boardState[i][j]) return false;
  }

  // Down-right
  for (let i = row + 1, j = col + 1; i < size && j < size; i++, j++) {
    if (boardState[i][j]) return false;
  }

  return true;
};

// Find all conflicts on the board
export const findConflicts = (board: Board): Position[] => {
  const size = board.length;
  const conflicts: Position[] = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j]) {
        const tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[i][j] = false;

        if (!canPlaceQueen(i, j, tempBoard)) {
          conflicts.push([i, j]);
        }
      }
    }
  }

  return conflicts;
};

// Initialize an empty board of the given size
export const createEmptyBoard = (size: number): Board => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));
};
