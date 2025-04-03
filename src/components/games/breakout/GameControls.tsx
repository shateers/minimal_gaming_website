
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameState } from '@/hooks/games/breakout/useBreakoutGame';

interface GameControlsProps {
  gameState: GameState;
  onReset: () => void;
  onTogglePause: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onReset,
  onTogglePause,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="game-control-button"
          onClick={onReset}
        >
          New Game
        </Button>
        
        <Button 
          variant="outline" 
          className="game-control-button"
          onClick={onTogglePause}
          disabled={gameState.isGameOver || gameState.restartDelay > 0}
        >
          {gameState.isPaused ? 'Continue' : 'Pause'}
        </Button>
      </div>
      
      <div className="flex items-center gap-4 bg-secondary/50 py-2 px-4 rounded-md">
        <div className="flex items-center">
          <span className="font-medium mr-2">Score:</span>
          <span className="font-bold">{gameState.score}</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-2">Lives:</span>
          <span className="font-bold">{gameState.lives}</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-2">Level:</span>
          <span className="font-bold">{gameState.level}</span>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
