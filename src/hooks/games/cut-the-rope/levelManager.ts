
import { levels } from './levels';

export const isGameOver = (gameState: { currentLevel: number }): boolean => {
  // Game over when we've completed all levels
  return gameState.currentLevel >= levels.length;
};

export const getLevelCount = (): number => {
  return levels.length;
};
