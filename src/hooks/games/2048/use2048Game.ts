
import { useState, useCallback, useEffect } from "react";

// Game board is a 4x4 grid
const GRID_SIZE = 4;
const WINNING_TILE = 2048;

// Initialize an empty board
const createEmptyBoard = (): number[][] => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

// Add a new tile (2 or 4) to a random empty cell
const addRandomTile = (board: number[][]): number[][] => {
  const emptyCells: [number, number][] = [];
  
  // Find all empty cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  
  // If there are no empty cells, return the original board
  if (emptyCells.length === 0) return board;
  
  // Randomly select an empty cell
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  
  // Place a new tile (90% chance of 2, 10% chance of 4)
  const newValue = Math.random() < 0.9 ? 2 : 4;
  const newBoard = [...board.map(row => [...row])];
  newBoard[row][col] = newValue;
  
  return newBoard;
};

// Initialize board with two random tiles
const initializeBoard = (): number[][] => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

// Check if any moves are possible
const isGameOver = (board: number[][]): boolean => {
  // Check if there are any empty cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) return false;
    }
  }
  
  // Check if there are any adjacent cells with the same value
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const current = board[i][j];
      
      // Check right neighbor
      if (j < GRID_SIZE - 1 && board[i][j + 1] === current) return false;
      
      // Check bottom neighbor
      if (i < GRID_SIZE - 1 && board[i + 1][j] === current) return false;
    }
  }
  
  return true;
};

// Check if player has won (has a 2048 tile)
const checkForWin = (board: number[][]): boolean => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === WINNING_TILE) {
        return true;
      }
    }
  }
  return false;
};

// The main game hook
const use2048Game = () => {
  const [board, setBoard] = useState<number[][]>(() => initializeBoard());
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem("2048_best_score");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  
  // Save best score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("2048_best_score", bestScore.toString());
  }, [bestScore]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setIsWinner(false);
  }, []);
  
  // Move tiles in a direction and merge them
  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return false;
    
    let newBoard = [...board.map(row => [...row])];
    let moved = false;
    let newScore = score;
    
    const rotateBoard = (board: number[][]): number[][] => {
      const n = board.length;
      const rotated = Array(n).fill(null).map(() => Array(n).fill(0));
      
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          rotated[j][n - 1 - i] = board[i][j];
        }
      }
      
      return rotated;
    };
    
    // Move all tiles to the left and merge them
    const moveLeft = (board: number[][]): [number[][], boolean, number] => {
      let moved = false;
      let newScore = 0;
      
      for (let i = 0; i < GRID_SIZE; i++) {
        let row = board[i].filter(val => val !== 0); // Remove zeros
        let newRow = [];
        
        // Merge tiles
        for (let j = 0; j < row.length; j++) {
          if (j < row.length - 1 && row[j] === row[j + 1]) {
            const mergedValue = row[j] * 2;
            newRow.push(mergedValue);
            newScore += mergedValue;
            j++; // Skip the next tile as it's been merged
          } else {
            newRow.push(row[j]);
          }
        }
        
        // Pad with zeros
        while (newRow.length < GRID_SIZE) {
          newRow.push(0);
        }
        
        // Check if the row has changed
        if (newRow.toString() !== board[i].toString()) {
          moved = true;
        }
        
        board[i] = newRow;
      }
      
      return [board, moved, newScore];
    };
    
    // Different handling based on direction
    switch (direction) {
      case 'left':
        [newBoard, moved, newScore] = moveLeft(newBoard);
        break;
        
      case 'right':
        // Rotate 180 degrees, move left, then rotate back
        newBoard = [...newBoard.map(row => [...row.reverse()])];
        [newBoard, moved, newScore] = moveLeft(newBoard);
        newBoard = [...newBoard.map(row => [...row.reverse()])];
        break;
        
      case 'up':
        // Transpose, mirror, move left, then transpose and mirror back
        newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)));
        [newBoard, moved, newScore] = moveLeft(newBoard);
        newBoard = rotateBoard(newBoard);
        break;
        
      case 'down':
        // Transpose, move left, then transpose back
        newBoard = rotateBoard(newBoard);
        [newBoard, moved, newScore] = moveLeft(newBoard);
        newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)));
        break;
    }
    
    // If tiles moved, add a new random tile and update state
    if (moved) {
      newBoard = addRandomTile(newBoard);
      
      // Update score
      const updatedScore = score + newScore;
      setScore(updatedScore);
      
      // Update best score if needed
      if (updatedScore > bestScore) {
        setBestScore(updatedScore);
      }
      
      // Update board
      setBoard(newBoard);
      
      // Check for win or game over
      if (!isWinner && checkForWin(newBoard)) {
        setIsWinner(true);
      } else if (isGameOver(newBoard)) {
        setGameOver(true);
      }
      
      return true;
    }
    
    return false;
  }, [board, score, bestScore, gameOver, isWinner]);
  
  // Handle keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveTiles('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveTiles('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveTiles('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveTiles('right');
        break;
    }
  }, [moveTiles, gameOver]);
  
  // Handle swipe controls for mobile
  const handleSwipe = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    moveTiles(direction);
  }, [moveTiles]);
  
  return {
    board,
    score,
    bestScore,
    gameOver,
    isWinner,
    handleKeyDown,
    handleSwipe,
    resetGame
  };
};

export default use2048Game;
