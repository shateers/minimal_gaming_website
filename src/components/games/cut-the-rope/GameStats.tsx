
import { Candy } from "lucide-react";
import { GameState } from "@/hooks/games/cut-the-rope/types";
import { Badge } from "@/components/ui/badge";

interface GameStatsProps {
  gameState: GameState;
}

const GameStats = ({ gameState }: GameStatsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <Candy className="text-pink-500" />
        <div className="text-lg font-medium">Cut the Rope</div>
        <Badge variant="outline" className="ml-2">
          Level {gameState.currentLevel + 1}
        </Badge>
      </div>
      
      <div className="flex gap-6">
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="text-xl font-bold">{gameState.score}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground">High Score</span>
          <span className="text-xl font-bold">{gameState.highScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
