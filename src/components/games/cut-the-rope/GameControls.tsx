
import { Button } from "@/components/ui/button";
import { Scissors, Play, RotateCcw } from "lucide-react";
import { GameState } from "@/hooks/games/cut-the-rope/types";

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onReset: () => void;
  onNextLevel: () => void;
}

const GameControls = ({
  gameState,
  onStart,
  onReset,
  onNextLevel,
}: GameControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-4">
      {!gameState.isPlaying && !gameState.isGameOver && (
        <Button
          className="game-control-button flex items-center gap-2"
          onClick={onStart}
        >
          <Play size={18} />
          <span>Start Game</span>
        </Button>
      )}

      {gameState.isPlaying && !gameState.levelCompleted && (
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={onReset}
        >
          <RotateCcw size={18} />
          <span>Reset Level</span>
        </Button>
      )}

      {gameState.levelCompleted && (
        <Button
          className="game-control-button flex items-center gap-2"
          onClick={onNextLevel}
        >
          <Play size={18} />
          <span>Next Level</span>
        </Button>
      )}

      {gameState.isGameOver && (
        <Button
          className="game-control-button flex items-center gap-2"
          onClick={onStart}
        >
          <Play size={18} />
          <span>Play Again</span>
        </Button>
      )}
    </div>
  );
};

export default GameControls;
