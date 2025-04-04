
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameState } from '@/hooks/games/doodle-jump/useDoodleJumpGame';

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onStart
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="default" 
          className="game-control-button"
          onClick={onStart}
          disabled={gameState.isPlaying && !gameState.isGameOver}
        >
          {gameState.isGameOver ? 'Play Again' : gameState.isPlaying ? 'Playing...' : 'Start Game'}
        </Button>
      </div>
      
      <div className="flex items-center gap-4 bg-secondary/50 py-2 px-4 rounded-md">
        <div className="flex items-center">
          <span className="font-medium mr-2">Score:</span>
          <span className="font-bold">{gameState.score}</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-2">High Score:</span>
          <span className="font-bold">{gameState.highScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
