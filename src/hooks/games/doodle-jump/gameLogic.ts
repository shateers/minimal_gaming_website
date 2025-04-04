
import { GameRefs, Platform, Spring } from './types';

export const initializeGameEntities = (canvasWidth: number, canvasHeight: number): GameRefs => {
  const player = {
    x: canvasWidth / 2 - 25,
    y: canvasHeight / 2,
    width: 50,
    height: 50,
    velocityY: 0,
    velocityX: 0
  };
  
  const platforms: Platform[] = [];
  
  // Add initial platform below the player
  platforms.push({
    x: canvasWidth / 2 - 50,
    y: canvasHeight / 2 + 60,
    width: 100,
    type: 'normal'
  });
  
  // Generate initial platforms
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
  
  const springs: Spring[] = [];
  
  // Add random springs to platforms
  platforms.forEach(platform => {
    if (Math.random() > 0.9 && platform.type === 'normal') {
      springs.push({
        x: platform.x + Math.random() * (platform.width - 20),
        y: platform.y - 10,
        width: 20,
        height: 10,
        active: true
      });
    }
  });
  
  return {
    platforms,
    player,
    springs,
    viewportOffset: 0,
    keys: {},
    requestId: 0,
    lastUpdateTime: 0
  };
};

export const updateGameEntities = (
  gameRefs: GameRefs, 
  canvasWidth: number, 
  canvasHeight: number, 
  timestamp: number,
  onScoreUpdate: (score: number) => void
): boolean => {
  // Handle horizontal movement based on key inputs
  if (gameRefs.keys['ArrowLeft'] || gameRefs.keys['a']) {
    gameRefs.player.velocityX = -8;
  } else if (gameRefs.keys['ArrowRight'] || gameRefs.keys['d']) {
    gameRefs.player.velocityX = 8;
  } else {
    gameRefs.player.velocityX *= 0.9;
  }
  
  // Update player position
  gameRefs.player.x += gameRefs.player.velocityX;
  gameRefs.player.y += gameRefs.player.velocityY;
  gameRefs.player.velocityY += 0.4; // gravity
  
  // Screen wrapping (go through edges)
  if (gameRefs.player.x > canvasWidth) {
    gameRefs.player.x = 0;
  } else if (gameRefs.player.x < 0) {
    gameRefs.player.x = canvasWidth - gameRefs.player.width;
  }
  
  // Handle camera scrolling when player moves up
  if (gameRefs.player.velocityY < 0) {
    if (gameRefs.player.y < canvasHeight / 2) {
      const viewportDelta = canvasHeight / 2 - gameRefs.player.y;
      gameRefs.viewportOffset += viewportDelta;
      gameRefs.player.y = canvasHeight / 2;
      
      const newScore = Math.floor(gameRefs.viewportOffset / 10);
      onScoreUpdate(newScore);
      
      // Move platforms and springs down with the camera
      gameRefs.platforms.forEach(platform => {
        platform.y += viewportDelta;
      });
      
      gameRefs.springs.forEach(spring => {
        spring.y += viewportDelta;
      });
    }
  }
  
  // Clean up platforms and springs that are below the screen
  gameRefs.platforms = gameRefs.platforms.filter(platform => platform.y < canvasHeight);
  gameRefs.springs = gameRefs.springs.filter(spring => spring.y < canvasHeight);
  
  // Generate new platforms as player moves up
  while (gameRefs.platforms.length < 10) {
    const highestPlatform = gameRefs.platforms.reduce(
      (prev, curr) => prev.y < curr.y ? prev : curr, 
      { y: canvasHeight } as Platform
    );
    
    gameRefs.platforms.push({
      x: Math.random() * (canvasWidth - 100),
      y: highestPlatform.y - (canvasHeight / 10) - Math.random() * 50,
      width: 70 + Math.random() * 50,
      type: Math.random() > 0.8 ? 'moving' : 
            Math.random() > 0.8 ? 'breaking' : 
            Math.random() > 0.9 ? 'bonus' : 'normal'
    });
  }
  
  // Occasionally add new springs
  if (Math.random() > 0.98) {
    const eligiblePlatforms = gameRefs.platforms.filter(p => 
      p.type === 'normal' && p.y < 0);
    
    if (eligiblePlatforms.length > 0) {
      const platform = eligiblePlatforms[Math.floor(Math.random() * eligiblePlatforms.length)];
      gameRefs.springs.push({
        x: platform.x + Math.random() * (platform.width - 20),
        y: platform.y - 10,
        width: 20,
        height: 10,
        active: true
      });
    }
  }
  
  // Move platforms that are of 'moving' type
  gameRefs.platforms.forEach(platform => {
    if (platform.type === 'moving') {
      platform.x += Math.sin(timestamp / 1000) * 2;
    }
  });
  
  // Check for collisions between player and platforms
  if (gameRefs.player.velocityY > 0) {
    for (const platform of gameRefs.platforms) {
      if (
        gameRefs.player.x < platform.x + platform.width &&
        gameRefs.player.x + gameRefs.player.width > platform.x &&
        gameRefs.player.y + gameRefs.player.height > platform.y &&
        gameRefs.player.y + gameRefs.player.height < platform.y + 10 &&
        gameRefs.player.velocityY > 0
      ) {
        if (platform.type === 'breaking') {
          // Remove breaking platforms after landing on them
          gameRefs.platforms = gameRefs.platforms.filter(p => p !== platform);
        }
        
        // Bounce higher on bonus platforms
        if (platform.type === 'bonus') {
          gameRefs.player.velocityY = -15;
        } else {
          gameRefs.player.velocityY = -10;
        }
      }
    }
  }
  
  // Check for collisions with springs
  for (const spring of gameRefs.springs) {
    if (
      spring.active &&
      gameRefs.player.x < spring.x + spring.width &&
      gameRefs.player.x + gameRefs.player.width > spring.x &&
      gameRefs.player.y + gameRefs.player.height > spring.y &&
      gameRefs.player.y + gameRefs.player.height < spring.y + spring.height + 10 &&
      gameRefs.player.velocityY > 0
    ) {
      gameRefs.player.velocityY = -20; // Extra high bounce for springs
      spring.active = false; // Deactivate spring after use
    }
  }
  
  // Check game over condition
  return gameRefs.player.y > canvasHeight;
};
