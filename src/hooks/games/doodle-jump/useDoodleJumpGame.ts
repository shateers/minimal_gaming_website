import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveGameScore } from '@/services/scoreService';

export interface GameState {
  score: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'moving' | 'breaking' | 'bonus';
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  velocityX: number;
}

export interface Spring {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

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
  const platformsRef = useRef<Platform[]>([]);
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    velocityY: 0,
    velocityX: 0
  });
  const springsRef = useRef<Spring[]>([]);
  const viewportOffsetRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const { user } = useAuth();

  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    playerRef.current = {
      x: canvasWidth / 2 - 25,
      y: canvasHeight / 2,
      width: 50,
      height: 50,
      velocityY: 0,
      velocityX: 0
    };
    
    viewportOffsetRef.current = 0;
    
    const platforms: Platform[] = [];
    
    platforms.push({
      x: canvasWidth / 2 - 50,
      y: canvasHeight / 2 + 60,
      width: 100,
      type: 'normal'
    });
    
    for (let i = 0; i < 10; i++) {
      platforms.push({
        x: Math.random() * (canvasWidth - 100),
        y: (canvasHeight / 10) * i,
        width: 70 + Math.random() * 50,
        type: Math.random() > 0.8 ? 'moving' : 
              Math.random() > 0.8 ? 'breaking' : 
              Math.random() > 0.9 ? 'bonus' : 'normal'
      });
    }
    
    platformsRef.current = platforms;
    springsRef.current = [];
    
    platforms.forEach(platform => {
      if (Math.random() > 0.9 && platform.type === 'normal') {
        springsRef.current.push({
          x: platform.x + Math.random() * (platform.width - 20),
          y: platform.y - 10,
          width: 20,
          height: 10,
          active: true
        });
      }
    });
    
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
      playerRef.current.velocityX = -8;
    } else if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
      playerRef.current.velocityX = 8;
    } else {
      playerRef.current.velocityX *= 0.9;
    }
    
    playerRef.current.x += playerRef.current.velocityX;
    playerRef.current.y += playerRef.current.velocityY;
    playerRef.current.velocityY += 0.4;
    
    if (playerRef.current.x > canvas.width) {
      playerRef.current.x = 0;
    } else if (playerRef.current.x < 0) {
      playerRef.current.x = canvas.width - playerRef.current.width;
    }
    
    if (playerRef.current.velocityY < 0) {
      if (playerRef.current.y < canvas.height / 2) {
        const viewportDelta = canvas.height / 2 - playerRef.current.y;
        viewportOffsetRef.current += viewportDelta;
        playerRef.current.y = canvas.height / 2;
        
        const newScore = Math.floor(viewportOffsetRef.current / 10);
        if (newScore > gameState.score) {
          setGameState(prev => ({...prev, score: newScore}));
        }
        
        platformsRef.current.forEach(platform => {
          platform.y += viewportDelta;
        });
        
        springsRef.current.forEach(spring => {
          spring.y += viewportDelta;
        });
      }
    }
    
    platformsRef.current = platformsRef.current.filter(platform => platform.y < canvas.height);
    
    while (platformsRef.current.length < 10) {
      const highestPlatform = platformsRef.current.reduce((prev, curr) => 
        prev.y < curr.y ? prev : curr, { y: canvas.height });
      
      platformsRef.current.push({
        x: Math.random() * (canvas.width - 100),
        y: highestPlatform.y - (canvas.height / 10) - Math.random() * 50,
        width: 70 + Math.random() * 50,
        type: Math.random() > 0.8 ? 'moving' : 
              Math.random() > 0.8 ? 'breaking' : 
              Math.random() > 0.9 ? 'bonus' : 'normal'
      });
    }
    
    springsRef.current = springsRef.current.filter(spring => spring.y < canvas.height);
    
    if (Math.random() > 0.98) {
      const eligiblePlatforms = platformsRef.current.filter(p => 
        p.type === 'normal' && p.y < 0);
      
      if (eligiblePlatforms.length > 0) {
        const platform = eligiblePlatforms[Math.floor(Math.random() * eligiblePlatforms.length)];
        springsRef.current.push({
          x: platform.x + Math.random() * (platform.width - 20),
          y: platform.y - 10,
          width: 20,
          height: 10,
          active: true
        });
      }
    }
    
    platformsRef.current.forEach(platform => {
      if (platform.type === 'moving') {
        platform.x += Math.sin(timestamp / 1000) * 2;
      }
    });
    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    platformsRef.current.forEach(platform => {
      switch(platform.type) {
        case 'normal':
          ctx.fillStyle = '#8FBC8F';
          break;
        case 'moving':
          ctx.fillStyle = '#ADD8E6';
          break;
        case 'breaking':
          ctx.fillStyle = '#FFA07A';
          break;
        case 'bonus':
          ctx.fillStyle = '#FFD700';
          break;
      }
      
      ctx.fillRect(platform.x, platform.y, platform.width, 10);
    });
    
    springsRef.current.forEach(spring => {
      if (spring.active) {
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(spring.x, spring.y, spring.width, spring.height);
      }
    });
    
    ctx.fillStyle = '#FF5E5B';
    ctx.fillRect(playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(playerRef.current.x + 10, playerRef.current.y + 10, 10, 10);
    ctx.fillRect(playerRef.current.x + 30, playerRef.current.y + 10, 10, 10);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(playerRef.current.x + 12, playerRef.current.y + 12, 6, 6);
    ctx.fillRect(playerRef.current.x + 32, playerRef.current.y + 12, 6, 6);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(playerRef.current.x + 15, playerRef.current.y + 30, 20, 5);
    
    if (playerRef.current.y > canvas.height) {
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
      keysRef.current[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
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
