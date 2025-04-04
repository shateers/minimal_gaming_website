
import { GameRefs } from './types';

export const renderGame = (
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number,
  gameRefs: GameRefs
): void => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw sky background
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw platforms
  gameRefs.platforms.forEach(platform => {
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
  
  // Draw springs
  gameRefs.springs.forEach(spring => {
    if (spring.active) {
      ctx.fillStyle = '#FF6347';
      ctx.fillRect(spring.x, spring.y, spring.width, spring.height);
    }
  });
  
  // Draw player (doodle character)
  ctx.fillStyle = '#FF5E5B';
  ctx.fillRect(gameRefs.player.x, gameRefs.player.y, gameRefs.player.width, gameRefs.player.height);
  
  // Draw player eyes (white parts)
  ctx.fillStyle = 'white';
  ctx.fillRect(gameRefs.player.x + 10, gameRefs.player.y + 10, 10, 10);
  ctx.fillRect(gameRefs.player.x + 30, gameRefs.player.y + 10, 10, 10);
  
  // Draw player pupils (black parts)
  ctx.fillStyle = 'black';
  ctx.fillRect(gameRefs.player.x + 12, gameRefs.player.y + 12, 6, 6);
  ctx.fillRect(gameRefs.player.x + 32, gameRefs.player.y + 12, 6, 6);
  
  // Draw player mouth
  ctx.fillStyle = 'black';
  ctx.fillRect(gameRefs.player.x + 15, gameRefs.player.y + 30, 20, 5);
};
