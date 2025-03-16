
import { useState, useEffect, useCallback } from "react";

type CellValue = boolean;
type Board = CellValue[][];
type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES = {
  easy: { size: 4 },
  medium: { size: 6 },
  hard: { size: 8 },
};

const useQueensGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [conflicts, setConflicts] = useState<[number, number][]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [queensPlaced, setQueensPlaced] = useState(0);

  // Initialize board based on difficulty
  const initializeBoard = useCallback(() => {
    const size = DIFFICULTIES[difficulty].size;
    const newBoard: Board = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));

    setBoard(newBoard);
    setSelectedCell(null);
    setConflicts([]);
    setGameCompleted(false);
    setMoves(0);
    setQueensPlaced(0);

    // Reset and start timer
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    const interval = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  }, [difficulty, timerInterval]);

  // Initialize board on difficulty change
  useEffect(() => {
    initializeBoard();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty, initializeBoard, timerInterval]);

  // Check if a queen can be placed at the given position
  const canPlaceQueen = (
    row: number,
    col: number,
    boardState: Board = board
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
    for (let i = row - 1, j = col + 1; i >= 0 && j < size; i++, j++) {
      if (boardState[i][j]) return false;
    }

    // Down-left
    for (let i = row + 1, j = col - 1; i < size && j >= 0; i++, j--) {
      if (boardState[i][j]) return false;
    }

    // Down-right
    for (let i = row + 1, j = col + 1; i < size && j < size; i++, j++) {
      if (boardState[i][j]) return false;
    }

    return true;
  };

  // Find all conflicts on the board
  const findConflicts = useCallback(() => {
    const size = board.length;
    const newConflicts: [number, number][] = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j]) {
          const tempBoard = JSON.parse(JSON.stringify(board));
          tempBoard[i][j] = false;

          if (!canPlaceQueen(i, j, tempBoard)) {
            newConflicts.push([i, j]);
          }
        }
      }
    }

    setConflicts(newConflicts);
    return newConflicts.length === 0;
  }, [board]);

  // Handle cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameCompleted) return;

      const newBoard = [...board.map((row) => [...row])];
      const current = newBoard[row][col];

      // If we're placing a queen, check if it's valid
      if (!current && !canPlaceQueen(row, col, newBoard)) {
        // Highlight conflicts and return
        findConflicts();
        return;
      }

      // Toggle queen
      newBoard[row][col] = !current;

      // Update queens count
      setQueensPlaced((prev) => (current ? prev - 1 : prev + 1));

      setBoard(newBoard);
      setSelectedCell([row, col]);
      setMoves((prev) => prev + 1);

      // Check for conflicts
      const noConflicts = findConflicts();

      // Check for game completion
      if (noConflicts && newBoard.flat().filter(Boolean).length === newBoard.length) {
        setGameCompleted(true);
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      }
    },
    [board, findConflicts, gameCompleted, timerInterval]
  );

  // Get a hint
  const getHint = useCallback(() => {
    const size = board.length;

    // Try to place a queen in each empty cell
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!board[i][j] && canPlaceQueen(i, j)) {
          const newBoard = [...board.map((row) => [...row])];
          newBoard[i][j] = true;
          setBoard(newBoard);
          setSelectedCell([i, j]);
          setMoves((prev) => prev + 1);
          setQueensPlaced((prev) => prev + 1);
          findConflicts();
          return;
        }
      }
    }

    // If no valid move found, suggest removing a problematic queen
    if (conflicts.length > 0) {
      const [row, col] = conflicts[0];
      const newBoard = [...board.map((row) => [...row])];
      newBoard[row][col] = false;
      setBoard(newBoard);
      setSelectedCell([row, col]);
      setMoves((prev) => prev + 1);
      setQueensPlaced((prev) => prev - 1);
      findConflicts();
    }
  }, [board, conflicts, findConflicts]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  return {
    board,
    selectedCell,
    conflicts,
    gameCompleted,
    timer,
    moves,
    queensPlaced,
    difficulty,
    boardSize: board.length,
    handleCellClick,
    getHint,
    handleDifficultyChange,
    initializeBoard,
  };
};

export default useQueensGame;
