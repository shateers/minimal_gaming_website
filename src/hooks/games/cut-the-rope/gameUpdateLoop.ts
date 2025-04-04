
import { GameState, GameRefs } from './types';
import { toast } from '@/components/ui/use-toast';
import { updateGameEntities } from './gameLogic';
import { renderGame } from './gameRenderer';
import { getLevelCount } from './levelManager';

export const updateGameState = (
  timestamp: number,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gameState: GameState,
  gameRefsRef: React.MutableRefObject<GameRefs>,
  lastUpdateTimeRef: React.MutableRefObject<number>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  endGame: (success: boolean) => void
): boolean => {
  if (!canvasRef.current || gameState.levelCompleted) return false;
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  
  const deltaTime = timestamp - lastUpdateTimeRef.current;
  lastUpdateTimeRef.current = timestamp;
  gameRefsRef.current.lastUpdateTime = timestamp;
  
  // Update game entities
  const gameOver = updateGameEntities(
    gameRefsRef.current,
    canvas.width,
    canvas.height,
    timestamp,
    (newScoreOrFn) => {
      if (typeof newScoreOrFn === 'function') {
        setGameState(prev => {
          const newScore = newScoreOrFn(prev.score);
          return {
            ...prev,
            score: newScore
          };
        });
      } else {
        setGameState(prev => ({
          ...prev, 
          score: newScoreOrFn
        }));
      }
    },
    (completed) => {
      if (completed) {
        setGameState(prev => ({...prev, levelCompleted: true}));
        
        // Add notification
        toast({
          title: `Level ${gameState.currentLevel + 1} Complete!`,
          description: "Great job! Click Next Level to continue.",
        });
        
        // Check for end of game
        const totalLevels = getLevelCount();
        if (gameState.currentLevel >= totalLevels - 1) {
          endGame(true);
        }
      }
    }
  );
  
  // Render the game
  renderGame(ctx, canvas.width, canvas.height, gameRefsRef.current);
  
  if (gameOver) {
    endGame(false);
    return false;
  }
  
  return true;
};
