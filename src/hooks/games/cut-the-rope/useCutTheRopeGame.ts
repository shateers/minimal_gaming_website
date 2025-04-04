
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveGameScore } from '@/services/scoreService';
import { GameState, GameRefs } from './types';
import { initializeGameEntities, updateGameEntities, getLevelCount } from './gameLogic';
import { renderGame } from './gameRenderer';

export const useCutTheRopeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    isPlaying: false,
    isGameOver: false,
    currentLevel: 0,
    levelCompleted: false
  });
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const gameRefsRef = useRef<GameRefs>({
    ropes: [],
    candy: { x: 0, y: 0, radius: 20, velocityX: 0, velocityY: 0, attached: true, attachedToRopeIds: [] },
    monster: { x: 0, y: 0, width: 80, height: 80, mouthOpen: false, happy: false },
    gravity: 0.5,
    airResistance: 0.98,
    lastUpdateTime: 0,
    mouseX: 0,
    mouseY: 0,
    mousePressing: false,
    ropeJoints: []
  });
  
  const { user } = useAuth();

  const initLevel = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Initialize game entities for current level
    const gameEntities = initializeGameEntities(canvasWidth, canvasHeight, gameState.currentLevel);
    gameRefsRef.current = gameEntities;
    
    setGameState(prev => ({
      ...prev,
      levelCompleted: false
    }));
  }, [gameState.currentLevel]);

  const initGame = useCallback(() => {
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
  }, [initLevel]);
  
  const updateGameState = useCallback((timestamp: number) => {
    if (!canvasRef.current || gameState.levelCompleted) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = timestamp - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = timestamp;
    gameRefsRef.current.lastUpdateTime = timestamp;
    
    // Update game entities
    const gameOver = updateGameEntities(
      gameRefsRef.current,
      canvas.width,
      canvas.height,
      timestamp,
      (newScore) => {
        setGameState(prev => ({...prev, score: newScore}));
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
      return;
    }
    
    if (gameState.isPlaying && !gameState.isGameOver && !gameState.levelCompleted) {
      requestRef.current = requestAnimationFrame(updateGameState);
    }
  }, [gameState.isPlaying, gameState.isGameOver, gameState.levelCompleted, gameState.currentLevel]);
  
  const nextLevel = useCallback(() => {
    if (gameState.currentLevel < getLevelCount() - 1) {
      setGameState(prev => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        levelCompleted: false
      }));
    } else {
      endGame(true);
    }
  }, [gameState.currentLevel]);
  
  const startGame = useCallback(() => {
    cancelAnimationFrame(requestRef.current);
    initGame();
    lastUpdateTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateGameState);
  }, [initGame, updateGameState]);
  
  const resetLevel = useCallback(() => {
    cancelAnimationFrame(requestRef.current);
    initLevel();
    lastUpdateTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateGameState);
  }, [initLevel, updateGameState]);
  
  const endGame = useCallback(async (success: boolean) => {
    cancelAnimationFrame(requestRef.current);
    
    const finalScore = gameState.score;
    const newHighScore = finalScore > gameState.highScore;
    
    if (newHighScore) {
      setGameState(prev => ({...prev, highScore: finalScore}));
      localStorage.setItem('cutTheRopeHighScore', finalScore.toString());
    }
    
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }));
    
    // Show different messages based on success
    if (success) {
      toast({
        title: 'Game Complete!',
        description: `Congratulations! You've completed all levels with a score of ${finalScore}!`,
      });
    } else {
      toast({
        title: 'Game Over!',
        description: `Try again! Your score was ${finalScore}.`,
        variant: 'destructive'
      });
    }
    
    if (user && finalScore > 0) {
      try {
        await saveGameScore({
          user_id: user.id,
          game_name: 'cut-the-rope',
          score: finalScore,
          completed: success
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
  
  // Setup mouse/touch events for rope cutting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Convert screen coordinates to canvas coordinates
      gameRefsRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      gameRefsRef.current.mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    };
    
    const handleMouseDown = () => {
      gameRefsRef.current.mousePressing = true;
    };
    
    const handleMouseUp = () => {
      gameRefsRef.current.mousePressing = false;
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      
      gameRefsRef.current.mouseX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      gameRefsRef.current.mouseY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
      gameRefsRef.current.mousePressing = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      
      gameRefsRef.current.mouseX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      gameRefsRef.current.mouseY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
    };
    
    const handleTouchEnd = () => {
      gameRefsRef.current.mousePressing = false;
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);
  
  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('cutTheRopeHighScore');
    if (savedHighScore) {
      setGameState(prev => ({
        ...prev,
        highScore: parseInt(savedHighScore)
      }));
    }
  }, []);
  
  // Handle level changes and initialization
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      initLevel();
      
      if (!gameState.levelCompleted) {
        lastUpdateTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(updateGameState);
      }
    }
  }, [gameState.isPlaying, gameState.currentLevel, gameState.levelCompleted, initLevel, updateGameState, gameState.isGameOver]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
  
  return {
    canvasRef,
    gameState,
    startGame,
    resetLevel,
    nextLevel,
    endGame
  };
};

export default useCutTheRopeGame;
export * from './types';
