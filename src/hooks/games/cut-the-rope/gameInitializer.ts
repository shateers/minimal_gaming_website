
import { GameState, GameRefs } from './types';
import { initializeGameEntities } from './gameLogic';

export const initializeLevel = (
  canvas: HTMLCanvasElement | null,
  currentLevel: number,
  gameRefsRef: React.MutableRefObject<GameRefs>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
): void => {
  if (!canvas) return;
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // Initialize game entities for current level
  const gameEntities = initializeGameEntities(canvasWidth, canvasHeight, currentLevel);
  gameRefsRef.current = gameEntities;
  
  setGameState(prev => ({
    ...prev,
    levelCompleted: false
  }));
};

export const initializeGame = (
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  initLevel: () => void
): void => {
  setGameState(prev => ({
    ...prev,
    score: 0,
    isPlaying: true,
    isGameOver: false,
    currentLevel: 0,
    levelCompleted: false
  }));
  
  // Initialize first level
  initLevel();
};

export const loadSavedHighScore = (): number => {
  const savedHighScore = localStorage.getItem('cutTheRopeHighScore');
  return savedHighScore ? parseInt(savedHighScore) : 0;
};
