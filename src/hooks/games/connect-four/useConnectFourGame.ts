
import { useState, useCallback, useEffect } from 'react';

// Number of rows and columns for the game board
const ROWS = 6;
const COLS = 7;

// Player types
type Player = 1 | 2;
type BoardCell = Player | null;
type GameBoard = BoardCell[][];
type GameStatus = 'playing' | 'paused' | 'won' | 'draw';

export const useConnectFourGame = () => {
  const [board, setBoard] = useState<GameBoard>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);

  // Create an empty game board
  function createEmptyBoard(): GameBoard {
    return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  }

  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setGameStatus('playing');
    setWinner(null);
    setTimer(0);
    setMoves(0);
    setWinningCells([]);
  }, []);

  // Handle dropping a piece in a column
  const dropPiece = useCallback((col: number) => {
    if (gameStatus !== 'playing') return;

    const newBoard = [...board];
    
    // Find the lowest empty row in the selected column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === null) {
        row = r;
        break;
      }
    }

    // If column is full, do nothing
    if (row === -1) return;

    // Place the piece
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setMoves(prev => prev + 1);

    // Check for win
    if (checkWin(newBoard, row, col, currentPlayer)) {
      setGameStatus('won');
      setWinner(currentPlayer);
      return;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setGameStatus('draw');
      return;
    }

    // Switch player
    setCurrentPlayer(current => (current === 1 ? 2 : 1));
  }, [board, currentPlayer, gameStatus]);

  // Check for a win
  const checkWin = (board: GameBoard, row: number, col: number, player: Player): boolean => {
    // Define directions: horizontal, vertical, diagonal up-right, diagonal up-left
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal up-right
      [1, -1], // diagonal up-left
    ];

    for (const [dx, dy] of directions) {
      const connectedCells: [number, number][] = [];
      
      // Check in both directions
      for (let dir = -1; dir <= 1; dir += 2) {
        if (dir === 0) continue;
        
        let r = row;
        let c = col;
        
        // Count consecutive pieces
        for (let i = 0; i < 3; i++) {
          r += dir * dx;
          c += dir * dy;
          
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== player) {
            break;
          }
          
          connectedCells.push([r, c]);
        }
      }
      
      // Add the current cell
      connectedCells.push([row, col]);
      
      // If 4 or more connected, it's a win
      if (connectedCells.length >= 4) {
        setWinningCells(connectedCells);
        return true;
      }
    }
    
    return false;
  };

  // Check for a draw (board full)
  const checkDraw = (board: GameBoard): boolean => {
    return board[0].every(cell => cell !== null);
  };

  // Toggle pause/resume
  const togglePause = useCallback(() => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
    } else if (gameStatus === 'paused') {
      setGameStatus('playing');
    }
  }, [gameStatus]);

  // Timer effect
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (gameStatus === 'playing') {
      intervalId = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [gameStatus]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    board,
    currentPlayer,
    gameStatus,
    winner,
    timer,
    moves,
    winningCells,
    dropPiece,
    resetGame,
    togglePause,
    formatTime
  };
};
