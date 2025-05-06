
import { useState, useCallback, useEffect } from "react";

// Define types for the game
export type Player = 1 | 2;
export type CellValue = Player | null;
export type Board = CellValue[][];
export type GameStatus = "playing" | "won" | "draw";

interface ConnectFourState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winningCells: [number, number][];
  moveCount: number;
}

// Create a new empty board
const createEmptyBoard = (): Board => {
  const rows = 6;
  const cols = 7;
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
};

export const useConnectFourGame = () => {
  const [state, setState] = useState<ConnectFourState>({
    board: createEmptyBoard(),
    currentPlayer: 1,
    status: "playing",
    winningCells: [],
    moveCount: 0,
  });

  // Check if a column has space for a new piece
  const isValidMove = useCallback((col: number): boolean => {
    return state.board[0][col] === null;
  }, [state.board]);

  // Find the next available row in a column
  const findAvailableRow = useCallback((col: number): number => {
    for (let row = state.board.length - 1; row >= 0; row--) {
      if (state.board[row][col] === null) {
        return row;
      }
    }
    return -1;
  }, [state.board]);

  // Check for a win
  const checkForWin = useCallback((board: Board, row: number, col: number): [number, number][] | null => {
    const player = board[row][col];
    if (!player) return null;
    
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ];
    
    for (const [dx, dy] of directions) {
      const winningCells: [number, number][] = [[row, col]];
      
      // Check both directions
      for (const multiplier of [1, -1]) {
        const dirX = dx * multiplier;
        const dirY = dy * multiplier;
        
        let r = row + dirX;
        let c = col + dirY;
        let count = 1;
        
        while (
          r >= 0 && r < board.length &&
          c >= 0 && c < board[0].length &&
          board[r][c] === player &&
          count < 4
        ) {
          winningCells.push([r, c]);
          r += dirX;
          c += dirY;
          count++;
        }
      }
      
      // If we found 4 or more in a row, we have a winner
      if (winningCells.length >= 4) {
        return winningCells.slice(0, 4);
      }
    }
    
    return null;
  }, []);

  // Check if the board is full
  const isBoardFull = useCallback((board: Board): boolean => {
    return board[0].every(cell => cell !== null);
  }, []);

  // Make a move
  const makeMove = useCallback((col: number) => {
    if (state.status !== "playing" || !isValidMove(col)) {
      return;
    }

    const newBoard = state.board.map(row => [...row]);
    const row = findAvailableRow(col);
    
    if (row === -1) return; // Column is full
    
    newBoard[row][col] = state.currentPlayer;
    
    const winningCells = checkForWin(newBoard, row, col);
    const newMoveCount = state.moveCount + 1;
    
    let newStatus: GameStatus = "playing";
    if (winningCells) {
      newStatus = "won";
    } else if (isBoardFull(newBoard) || newMoveCount === 42) { // 6 rows × 7 columns = 42 maximum moves
      newStatus = "draw";
    }
    
    setState({
      board: newBoard,
      currentPlayer: state.currentPlayer === 1 ? 2 : 1,
      status: newStatus,
      winningCells: winningCells || [],
      moveCount: newMoveCount,
    });
  }, [state, isValidMove, findAvailableRow, checkForWin, isBoardFull]);

  // Reset the game
  const resetGame = useCallback(() => {
    setState({
      board: createEmptyBoard(),
      currentPlayer: 1,
      status: "playing",
      winningCells: [],
      moveCount: 0,
    });
  }, []);

  return {
    board: state.board,
    currentPlayer: state.currentPlayer,
    status: state.status,
    winningCells: state.winningCells,
    moveCount: state.moveCount,
    makeMove,
    resetGame,
    isValidMove
  };
};
