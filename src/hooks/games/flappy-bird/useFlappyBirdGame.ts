
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveGameScore } from "@/services/scoreService";
import { toast } from "sonner";

export type GameState = "waiting" | "playing" | "gameover";

export const useFlappyBirdGame = () => {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { user } = useAuth();

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("flappyBirdHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
  }, []);

  // Reset the game
  const restartGame = useCallback(() => {
    setGameState("waiting");
    setScore(0);
  }, []);

  // Make the bird jump
  const jumpBird = useCallback(() => {
    if (gameState === "waiting") {
      startGame();
    }
  }, [gameState, startGame]);

  // Handle game over
  const handleGameOver = useCallback(async () => {
    setGameState("gameover");
    
    // Update high score if necessary
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("flappyBirdHighScore", score.toString());
      toast.success("New high score!");
    }
    
    // Save score to database if user is logged in
    if (user) {
      try {
        await saveGameScore({
          user_id: user.id,
          game_name: "flappy-bird",
          score: score,
          time_taken: null,
          moves: null,
          completed: true
        });
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  }, [score, highScore, user]);

  // Update score
  const updateScore = useCallback(() => {
    setScore(prevScore => prevScore + 1);
  }, []);

  return {
    gameState,
    score,
    highScore,
    startGame,
    restartGame,
    jumpBird,
    updateScore,
    handleGameOver
  };
};
