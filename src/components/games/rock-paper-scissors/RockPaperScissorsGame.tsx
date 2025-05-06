
import { useState, useEffect } from "react";
import { useRockPaperScissorsGame } from "@/hooks/games/rock-paper-scissors/useRockPaperScissorsGame";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const RockPaperScissorsGame = () => {
  const { toast } = useToast();
  const {
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
  } = useRockPaperScissorsGame();

  // Define choice icons and their display elements
  const choiceIcons = {
    rock: "👊",
    paper: "✋",
    scissors: "✌️",
    null: "❓"
  };

  // Play victory sound if player wins
  useEffect(() => {
    if (result === "win" && showResult) {
      // Show toast notification
      toast({
        title: "You win!",
        description: `Your ${playerChoice} beats ${computerChoice}!`,
      });
    }
  }, [result, showResult, toast, playerChoice, computerChoice]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Game status */}
      <div className="w-full flex justify-between items-center gap-4">
        <div className="stats grid grid-cols-3 gap-4 w-full">
          <div className="stat bg-white p-3 rounded-lg border text-center">
            <div className="text-sm text-gray-500">Player</div>
            <div className="text-2xl font-bold">{playerScore}</div>
          </div>
          <div className="stat bg-white p-3 rounded-lg border text-center">
            <div className="text-sm text-gray-500">Rounds</div>
            <div className="text-2xl font-bold">{roundsPlayed}</div>
          </div>
          <div className="stat bg-white p-3 rounded-lg border text-center">
            <div className="text-sm text-gray-500">Computer</div>
            <div className="text-2xl font-bold">{computerScore}</div>
          </div>
        </div>
        
        <div>
          <Button onClick={resetGame} variant="outline">Reset Game</Button>
        </div>
      </div>

      {/* Game arena */}
      <div className="flex flex-col items-center gap-6">
        {/* Choice display */}
        <div className="flex justify-center items-center w-full gap-8 md:gap-16 py-8">
          {/* Player choice */}
          <div className="text-center">
            <p className="text-sm font-medium mb-2">You</p>
            <motion.div 
              className="text-6xl md:text-7xl bg-blue-50 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full border-4 border-blue-200"
              animate={isAnimating ? { rotate: [0, 10, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {playerChoice ? choiceIcons[playerChoice] : "❓"}
            </motion.div>
          </div>
          
          {/* VS indicator */}
          <div className="text-xl font-bold text-gray-400">VS</div>
          
          {/* Computer choice */}
          <div className="text-center">
            <p className="text-sm font-medium mb-2">Computer</p>
            <motion.div 
              className="text-6xl md:text-7xl bg-red-50 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full border-4 border-red-200"
              animate={isAnimating ? { rotate: [0, 10, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {computerChoice ? choiceIcons[computerChoice] : "❓"}
            </motion.div>
          </div>
        </div>
        
        {/* Game result */}
        {showResult && (
          <motion.div 
            className={`text-center p-4 rounded-lg text-xl font-bold ${
              result === "win" ? "bg-green-100 text-green-700" :
              result === "lose" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {result === "win" && "You Win! 🎉"}
            {result === "lose" && "You Lose! 😢"}
            {result === "draw" && "It's a Draw! 🤝"}
          </motion.div>
        )}
        
        {/* Choice buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => makeChoice("rock")}
            disabled={isAnimating}
            size="lg"
            className="text-2xl py-8 px-8"
          >
            👊 Rock
          </Button>
          <Button
            onClick={() => makeChoice("paper")}
            disabled={isAnimating}
            size="lg"
            className="text-2xl py-8 px-8"
          >
            ✋ Paper
          </Button>
          <Button
            onClick={() => makeChoice("scissors")}
            disabled={isAnimating}
            size="lg"
            className="text-2xl py-8 px-8"
          >
            ✌️ Scissors
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissorsGame;
