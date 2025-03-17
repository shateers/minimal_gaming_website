
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveGameScore } from "@/services/scoreService";
import { Player, BoardState, GameStatus } from "./types";
import { calculateWinner } from "./utils";

export const useTicTacToeGame = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [winner, setWinner] = useState<Player | "draw">(null);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    // Start timer
    if (gameStatus === "playing") {
      const interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [gameStatus]);

  useEffect(() => {
    // Check for winner
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      setGameStatus("over");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Save score if user is logged in
      saveScore(currentWinner);
    } else if (!board.includes(null)) {
      // If no winner and board is full, it's a draw
      setWinner("draw");
      setGameStatus("over");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Save score if user is logged in
      saveScore("draw");
    }
  }, [board, timerInterval]);

  const saveScore = async (result: Player | "draw") => {
    if (!user) return;
    
    try {
      let score = 0;
      if (result === "X") score = 10;
      else if (result === "O") score = 5;
      else if (result === "draw") score = 3;
      
      await saveGameScore({
        user_id: user.id,
        game_name: "tic-tac-toe",
        score: score,
        time_taken: timer,
        moves: moves,
        completed: true
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || gameStatus !== "playing") {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setMoves(moves + 1);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus("playing");
    setWinner(null);
    setTimer(0);
    setMoves(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handlePauseResume = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused");
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else if (gameStatus === "paused") {
      setGameStatus("playing");
      const interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  return {
    board,
    isXNext,
    gameStatus,
    winner,
    timer,
    moves,
    handleClick,
    handleReset,
    handlePauseResume
  };
};
