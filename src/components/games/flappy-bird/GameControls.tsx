
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
          className="px-6 py-3 text-lg"
          onClick={onStart}
        >
          Start Game
        </Button>
      )}
      
      {gameState === "playing" && (
        <Button 
          className="px-6 py-3 text-lg"
          onClick={onJump}
        >
          Jump (Space)
        </Button>
      )}
      
      {gameState === "gameover" && (
        <Button 
          className="px-6 py-3 text-lg"
          onClick={onRestart}
        >
          Play Again
        </Button>
      )}
    </div>
  );
};

export default GameControls;
