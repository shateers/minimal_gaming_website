
import { useState, useCallback, useEffect } from "react";

export type Choice = "rock" | "paper" | "scissors" | null;
export type GameResult = "win" | "lose" | "draw" | null;

export const useRockPaperScissorsGame = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Generate computer choice
  const generateComputerChoice = useCallback((): Choice => {
    const choices: Choice[] = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  }, []);

  // Determine winner
  const determineWinner = useCallback((player: Choice, computer: Choice): GameResult => {
    if (!player || !computer) return null;
    
    if (player === computer) return "draw";
    
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  }, []);

  // Handle player choice
  const makeChoice = useCallback((choice: Choice) => {
    // Don't allow new choices while animating
    if (isAnimating) return;
    
    setPlayerChoice(choice);
    setIsAnimating(true);
    setShowResult(false);
    
    // Simulate computer "thinking"
    setTimeout(() => {
      const computerSelection = generateComputerChoice();
      setComputerChoice(computerSelection);
      
      const gameResult = determineWinner(choice, computerSelection);
      setResult(gameResult);
      
      // Update scores
      if (gameResult === "win") {
        setPlayerScore(prev => prev + 1);
      } else if (gameResult === "lose") {
        setComputerScore(prev => prev + 1);
      }
      
      setRoundsPlayed(prev => prev + 1);
      setIsAnimating(false);
      setShowResult(true);
    }, 1000);
  }, [isAnimating, generateComputerChoice, determineWinner]);

  // Reset game
  const resetGame = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setPlayerScore(0);
    setComputerScore(0);
    setRoundsPlayed(0);
    setShowResult(false);
  }, []);

  return {
    playerChoice,
    computerChoice,
    result,
    playerScore,
    computerScore,
    roundsPlayed,
    isAnimating,
    showResult,
    makeChoice,
    resetGame
  };
};
