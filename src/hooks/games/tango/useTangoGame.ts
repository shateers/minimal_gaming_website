
import { useState, useEffect } from 'react';

type CellValue = 0 | 1 | null;
type Board = CellValue[][];

type Difficulty = keyof typeof DIFFICULTIES;

const DIFFICULTIES = {
  easy: { size: 4 },
  medium: { size: 6 },
  hard: { size: 8 }
};

export const useTangoGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  // Initialize board based on difficulty
  useEffect(() => {
    initializeBoard();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);

  const initializeBoard = () => {
    const size = DIFFICULTIES[difficulty].size;
    const newBoard: Board = Array(size).fill(null).map(() => Array(size).fill(null));
    
    // Pre-fill some cells to make the puzzle solvable
    const filledCellCount = Math.floor(size * size * 0.3);
    let cellsFilled = 0;
    
    while (cellsFilled < filledCellCount) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      if (newBoard[row][col] === null) {
        // Randomly fill with 0 or 1
        newBoard[row][col] = Math.random() > 0.5 ? 1 : 0;
        cellsFilled++;
      }
    }
    
    setBoard(newBoard);
    setSelectedCell(null);
    setGameCompleted(false);
    setMoves(0);
    
    // Reset and start timer
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Check if the current board state is valid according to Tango rules
  const isValidBoard = () => {
    const size = board.length;
    
    // Check for incomplete cells
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null) return false;
      }
    }
    
    // Check rows
    for (let i = 0; i < size; i++) {
      // Count 0s and 1s in the row
      const rowCount = { 0: 0, 1: 0 };
      for (let j = 0; j < size; j++) {
        rowCount[board[i][j] as 0 | 1]++;
      }
      
      // Each row must have equal number of 0s and 1s
      if (rowCount[0] !== rowCount[1]) return false;
      
      // Check for more than two identical adjacent symbols
      for (let j = 0; j < size - 2; j++) {
        if (board[i][j] === board[i][j+1] && board[i][j] === board[i][j+2]) return false;
      }
    }
    
    // Check columns
    for (let j = 0; j < size; j++) {
      // Count 0s and 1s in the column
      const colCount = { 0: 0, 1: 0 };
      for (let i = 0; i < size; i++) {
        colCount[board[i][j] as 0 | 1]++;
      }
      
      // Each column must have equal number of 0s and 1s
      if (colCount[0] !== colCount[1]) return false;
      
      // Check for more than two identical adjacent symbols
      for (let i = 0; i < size - 2; i++) {
        if (board[i][j] === board[i+1][j] && board[i][j] === board[i+2][j]) return false;
      }
    }
    
    // All checks passed
    return true;
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameCompleted) return;
    
    const newBoard = [...board];
    const currentValue = newBoard[row][col];
    
    // Cycle through values: null -> 0 -> 1 -> null
    if (currentValue === null) {
      newBoard[row][col] = 0;
    } else if (currentValue === 0) {
      newBoard[row][col] = 1;
    } else {
      newBoard[row][col] = null;
    }
    
    setBoard(newBoard);
    setSelectedCell([row, col]);
    setMoves(moves + 1);
    
    // Check for game completion
    if (isValidBoard()) {
      setGameCompleted(true);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  // Reset the game
  const resetGame = () => {
    initializeBoard();
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  // Helper function to provide a hint
  const getHint = (): [number, number, CellValue] | null => {
    const size = board.length;
    
    // Try to find a cell where only one value is possible
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] !== null) continue;
        
        // Try both 0 and 1
        const tempBoard0 = JSON.parse(JSON.stringify(board));
        tempBoard0[i][j] = 0;
        const valid0 = checkPartialValidity(tempBoard0, i, j);
        
        const tempBoard1 = JSON.parse(JSON.stringify(board));
        tempBoard1[i][j] = 1;
        const valid1 = checkPartialValidity(tempBoard1, i, j);
        
        if (valid0 && !valid1) return [i, j, 0];
        if (!valid0 && valid1) return [i, j, 1];
      }
    }
    
    // If no obvious hint, find a random empty cell
    const emptyCells = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === null) emptyCells.push([i, j]);
      }
    }
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      return [row, col, Math.random() > 0.5 ? 1 : 0];
    }
    
    return null;
  };
  
  // Helper function to check if a board is partially valid
  const checkPartialValidity = (board: Board, row: number, col: number): boolean => {
    const size = board.length;
    
    // Check for three consecutive identical values in the row
    for (let j = Math.max(0, col - 2); j <= Math.min(size - 3, col); j++) {
      if (board[row][j] !== null && 
          board[row][j] === board[row][j+1] && 
          board[row][j] === board[row][j+2]) {
        return false;
      }
    }
    
    // Check for three consecutive identical values in the column
    for (let i = Math.max(0, row - 2); i <= Math.min(size - 3, row); i++) {
      if (board[i][col] !== null && 
          board[i][col] === board[i+1][col] && 
          board[i][col] === board[i+2][col]) {
        return false;
      }
    }
    
    // Check if the row has too many of one value
    const rowCount = { 0: 0, 1: 0 };
    for (let j = 0; j < size; j++) {
      if (board[row][j] === 0) rowCount[0]++;
      if (board[row][j] === 1) rowCount[1]++;
    }
    if (rowCount[0] > size/2 || rowCount[1] > size/2) return false;
    
    // Check if the column has too many of one value
    const colCount = { 0: 0, 1: 0 };
    for (let i = 0; i < size; i++) {
      if (board[i][col] === 0) colCount[0]++;
      if (board[i][col] === 1) colCount[1]++;
    }
    if (colCount[0] > size/2 || colCount[1] > size/2) return false;
    
    return true;
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const provideHint = () => {
    const hint = getHint();
    if (hint) {
      const [row, col, value] = hint;
      const newBoard = [...board];
      newBoard[row][col] = value;
      setBoard(newBoard);
      setSelectedCell([row, col]);
      setMoves(moves + 1);
    }
  };

  return {
    board,
    difficulty,
    gameCompleted,
    selectedCell,
    timer,
    moves,
    handleCellClick,
    resetGame,
    handleDifficultyChange,
    formatTime,
    provideHint
  };
};
