
import { Button } from "@/components/ui/button";
import { GameState } from "../../../hooks/games/flappy-bird/useFlappyBirdGame";

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onRestart: () => void;
  onJump: () => void;
}

const GameControls = ({ gameState, onStart, onRestart, onJump }: GameControlsProps) => {
  return (
    <div className="flex justify-center gap-4 my-6">
      {gameState === "waiting" && (
        <Button 
          className="px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
          onClick={onStart}
        >
          Start Game
        </Button>
      )}
      
      {gameState === "playing" && (
        <Button 
          className="px-6 py-3 text-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md animate-pulse"
          onClick={onJump}
        >
          Jump (Space)
        </Button>
      )}
      
      {gameState === "gameover" && (
        <Button 
          className="px-6 py-3 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md"
          onClick={onRestart}
        >
          Play Again
        </Button>
      )}
    </div>
  );
};

export default GameControls;
