
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveGameScore } from '@/services/scoreService';
import { GameState } from './types';
import { initializeGameEntities, updateGameEntities } from './gameLogic';
import { renderGame } from './gameRenderer';

export * from './types';

export const useDoodleJumpGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    isPlaying: false,
    isGameOver: false
  });
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const gameRefsRef = useRef({
    platforms: [],
    player: { x: 0, y: 0, width: 50, height: 50, velocityY: 0, velocityX: 0 },
    springs: [],
    viewportOffset: 0,
    keys: {},
    requestId: 0,
    lastUpdateTime: 0
  });
  
  const { user } = useAuth();

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Initialize game entities using the extracted function
    const gameEntities = initializeGameEntities(canvasWidth, canvasHeight);
    gameRefsRef.current = gameEntities;
    
    setGameState({
      score: 0,
      highScore: gameState.highScore,
      isPlaying: true,
      isGameOver: false
    });
  }, [gameState.highScore]);
  
  const updateGameState = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = timestamp - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = timestamp;
    
    // Update game entities
    const isGameOver = updateGameEntities(
      gameRefsRef.current,
      canvas.width,
      canvas.height,
      timestamp,
      (newScore) => {
        if (newScore > gameState.score) {
          setGameState(prev => ({...prev, score: newScore}));
        }
      }
    );
    
    // Render the game
    renderGame(ctx, canvas.width, canvas.height, gameRefsRef.current);
    
    if (isGameOver) {
      endGame();
      return;
    }
    
    if (gameState.isPlaying && !gameState.isGameOver) {
      requestRef.current = requestAnimationFrame(updateGameState);
    }
  }, [gameState.isPlaying, gameState.isGameOver, gameState.score]);
  
  const startGame = useCallback(() => {
    cancelAnimationFrame(requestRef.current);
    initGame();
    lastUpdateTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateGameState);
  }, [initGame, updateGameState]);
  
  const endGame = useCallback(async () => {
    cancelAnimationFrame(requestRef.current);
    
    const finalScore = gameState.score;
    const newHighScore = finalScore > gameState.highScore;
    
    if (newHighScore) {
      setGameState(prev => ({...prev, highScore: finalScore}));
      localStorage.setItem('doodleJumpHighScore', finalScore.toString());
    }
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }));
    
    if (user && finalScore > 0) {
      try {
        await saveGameScore({
          user_id: user.id,
          game_name: 'doodle-jump',
          score: finalScore,
          completed: true
        });
        toast({
          title: 'Score saved!',
          description: `Your score of ${finalScore} has been saved.`
        });
      } catch (error) {
        console.error('Error saving score:', error);
        toast({
          title: 'Score not saved',
          description: 'There was an error saving your score.',
          variant: 'destructive'
        });
      }
    }
  }, [gameState.score, gameState.highScore, user]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameRefsRef.current.keys[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      gameRefsRef.current.keys[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useEffect(() => {
    const savedHighScore = localStorage.getItem('doodleJumpHighScore');
    if (savedHighScore) {
      setGameState(prev => ({
        ...prev,
        highScore: parseInt(savedHighScore)
      }));
    }
  }, []);
  
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
  
  return {
    canvasRef,
    gameState,
    startGame,
    endGame
  };
};

export default useDoodleJumpGame;
