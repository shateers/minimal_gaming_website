
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GameState, GameRefs } from './types';
import { isGameOver, getLevelCount } from './levelManager';
import { initializeLevel, initializeGame, loadSavedHighScore } from './gameInitializer';
import { setupMouseTouchEvents } from './gameEventHandlers';
import { updateGameState } from './gameUpdateLoop';
import { handleGameEnd } from './gameCompletion';

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
    initializeLevel(canvasRef.current, gameState.currentLevel, gameRefsRef, setGameState);
  }, [gameState.currentLevel]);

  const initGame = useCallback(() => {
    initializeGame(setGameState, initLevel);
  }, [initLevel]);
  
  const gameUpdateCallback = useCallback((timestamp: number) => {
    if (!gameState.isPlaying || gameState.isGameOver || gameState.levelCompleted) return;
    
    const shouldContinue = updateGameState(
      timestamp, 
      canvasRef,
      gameState,
      gameRefsRef,
      lastUpdateTimeRef,
      setGameState,
      endGame
    );
    
    if (shouldContinue && gameState.isPlaying && !gameState.isGameOver && !gameState.levelCompleted) {
      requestRef.current = requestAnimationFrame(gameUpdateCallback);
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
    requestRef.current = requestAnimationFrame(gameUpdateCallback);
  }, [initGame, gameUpdateCallback]);
  
  const resetLevel = useCallback(() => {
    cancelAnimationFrame(requestRef.current);
    initLevel();
    lastUpdateTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameUpdateCallback);
  }, [initLevel, gameUpdateCallback]);
  
  const endGame = useCallback(async (success: boolean) => {
    cancelAnimationFrame(requestRef.current);
    await handleGameEnd(success, gameState, setGameState, user);
  }, [gameState, user]);
  
  // Setup mouse/touch events for rope cutting
  useEffect(() => {
    const cleanupEvents = setupMouseTouchEvents(canvasRef, gameRefsRef);
    return cleanupEvents;
  }, []);
  
  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = loadSavedHighScore();
    if (savedHighScore > 0) {
      setGameState(prev => ({
        ...prev,
        highScore: savedHighScore
      }));
    }
  }, []);
  
  // Handle level changes and initialization
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      initLevel();
      
      if (!gameState.levelCompleted) {
        lastUpdateTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(gameUpdateCallback);
      }
    }
  }, [gameState.isPlaying, gameState.currentLevel, gameState.levelCompleted, initLevel, gameUpdateCallback, gameState.isGameOver]);
  
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
