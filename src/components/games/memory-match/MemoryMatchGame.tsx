
import { useEffect, useState } from "react";
import { Card } from "./Card";
import { useMemoryMatchGame, Difficulty } from "@/hooks/games/memory-match/useMemoryMatchGame";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MemoryMatchGameProps {
  soundEnabled: boolean;
}

const MemoryMatchGame = ({ soundEnabled }: MemoryMatchGameProps) => {
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  
  const {
    cards,
    moves,
    gameTime,
    gameStatus,
    matchedPairs,
    totalPairs,
    gridSize,
    flipCard,
    initializeGame,
  } = useMemoryMatchGame(difficulty);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame, difficulty]);

  // Play sounds
  useEffect(() => {
    if (!soundEnabled) return;
    
    if (gameStatus === "completed") {
      // Play victory sound
      const audio = new Audio("/sounds/victory.mp3");
      audio.play().catch(e => console.error("Error playing sound:", e));
      
      // Show toast notification
      toast({
        title: "You win!",
        description: `You completed the game in ${moves} moves and ${gameTime} seconds!`,
      });
    }
  }, [gameStatus, soundEnabled, moves, gameTime, toast]);

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty as Difficulty);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Game header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="stats grid grid-cols-3 gap-4 w-full sm:w-auto">
          <div className="stat bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-sm text-gray-500">Moves</div>
            <div className="text-2xl font-bold">{moves}</div>
          </div>
          <div className="stat bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-sm text-gray-500">Time</div>
            <div className="text-2xl font-bold">{gameTime}s</div>
          </div>
          <div className="stat bg-white p-3 rounded-lg shadow-sm text-center">
            <div className="text-sm text-gray-500">Pairs</div>
            <div className="text-2xl font-bold">{matchedPairs}/{totalPairs}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button onClick={initializeGame}>New Game</Button>
          <Tabs defaultValue="easy" value={difficulty} onValueChange={handleDifficultyChange}>
            <TabsList>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Game board */}
      <div 
        className="grid gap-2 bg-white p-4 rounded-xl shadow-md"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: '100%',
          maxWidth: `${gridSize * 70}px`
        }}
      >
        {cards.map((card) => (
          <Card 
            key={card.id}
            card={card}
            onFlip={() => flipCard(card.id)}
            soundEnabled={soundEnabled}
          />
        ))}
      </div>
      
      {/* Game completion message */}
      {gameStatus === "completed" && (
        <div className="mt-6 bg-green-100 border border-green-500 text-green-700 p-4 rounded-lg text-center">
          <h3 className="text-lg font-bold">Congratulations!</h3>
          <p>
            You completed the game in {moves} moves and {gameTime} seconds!
          </p>
          <Button onClick={initializeGame} variant="outline" className="mt-2">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemoryMatchGame;
