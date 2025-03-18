
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { saveGameScore } from "@/services/scoreService";
import { toast } from "@/components/ui/use-toast";

const useDinoGame = () => {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load best score from localStorage
    const savedBestScore = localStorage.getItem("dino-run-best-score");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
    
    // Update best score if current score is higher
    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem("dino-run-best-score", newScore.toString());
    }
  }, [bestScore]);

  const handleGameOver = useCallback(() => {
    setGameOver(true);
    
    // Save score to Supabase if user is logged in
    if (user && score > 0) {
      saveGameScore({
        user_id: user.id,
        game_name: "dino-run",
        score: score,
        time_taken: null,
        moves: null,
        difficulty: null,
        completed: true
      })
      .then(({ error }) => {
        if (error) {
          console.error("Error saving score:", error);
          toast({
            title: "Error",
            description: "Failed to save your score.",
            variant: "destructive",
          });
        }
      });
    }
  }, [user, score]);

  const resetGame = useCallback(() => {
    // Reload the page to restart the game
    window.location.reload();
  }, []);

  return {
    score,
    bestScore,
    gameOver,
    handleScoreUpdate,
    handleGameOver,
    resetGame
  };
};

export default useDinoGame;
