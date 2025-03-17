
import { useState, useEffect, useCallback } from "react";
import { Board, Position, Difficulty, QueensGameState } from "./types";
import { DIFFICULTIES } from "./constants";
import { canPlaceQueen, findConflicts, createEmptyBoard } from "./boardUtils";

const useQueensGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [conflicts, setConflicts] = useState<Position[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [queensPlaced, setQueensPlaced] = useState(0);

  // Initialize board based on difficulty
  const initializeBoard = useCallback(() => {
    const size = DIFFICULTIES[difficulty].size;
    const newBoard = createEmptyBoard(size);

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

  // Update conflicts and check game state
  const updateConflictsAndCheckGame = useCallback((boardState: Board) => {
    const newConflicts = findConflicts(boardState);
    setConflicts(newConflicts);
    
    // Check for game completion
    const noConflicts = newConflicts.length === 0;
    const allQueensPlaced = boardState.flat().filter(Boolean).length === boardState.length;
    
    if (noConflicts && allQueensPlaced) {
      setGameCompleted(true);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
    
    return noConflicts;
  }, [timerInterval]);

  // Handle cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameCompleted) return;

      const newBoard = [...board.map((row) => [...row])];
      const current = newBoard[row][col];

      // If we're placing a queen, check if it's valid
      if (!current && !canPlaceQueen(row, col, newBoard)) {
        // Highlight conflicts
        updateConflictsAndCheckGame(board);
        return;
      }

      // Toggle queen
      newBoard[row][col] = !current;

      // Update queens count
      setQueensPlaced((prev) => (current ? prev - 1 : prev + 1));

      setBoard(newBoard);
      setSelectedCell([row, col]);
      setMoves((prev) => prev + 1);

      // Check for conflicts and game completion
      updateConflictsAndCheckGame(newBoard);
    },
    [board, updateConflictsAndCheckGame, gameCompleted]
  );

  // Get a hint
  const getHint = useCallback(() => {
    const size = board.length;

    // Try to place a queen in each empty cell
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!board[i][j] && canPlaceQueen(i, j, board)) {
          const newBoard = [...board.map((row) => [...row])];
          newBoard[i][j] = true;
          setBoard(newBoard);
          setSelectedCell([i, j]);
          setMoves((prev) => prev + 1);
          setQueensPlaced((prev) => prev + 1);
          updateConflictsAndCheckGame(newBoard);
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
      updateConflictsAndCheckGame(newBoard);
    }
  }, [board, conflicts, updateConflictsAndCheckGame]);

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
