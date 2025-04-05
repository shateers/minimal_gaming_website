
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
  
  // Add some clouds for visual interest
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(canvasWidth * 0.2, 50, 30, 0, Math.PI * 2);
  ctx.arc(canvasWidth * 0.2 + 25, 60, 25, 0, Math.PI * 2);
  ctx.arc(canvasWidth * 0.2 + 45, 45, 20, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(canvasWidth * 0.7, 100, 25, 0, Math.PI * 2);
  ctx.arc(canvasWidth * 0.7 + 30, 105, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw platforms
  gameRefs.platforms.forEach(platform => {
    switch(platform.type) {
      case 'normal':
        ctx.fillStyle = '#8FBC8F'; // Green platform
        break;
      case 'moving':
        ctx.fillStyle = '#ADD8E6'; // Blue platform
        break;
      case 'breaking':
        ctx.fillStyle = '#FFA07A'; // Light red platform
        break;
      case 'bonus':
        ctx.fillStyle = '#FFD700'; // Gold platform
        break;
    }
    
    // Draw platform
    ctx.fillRect(platform.x, platform.y, platform.width, 10);
    
    // Add shadow/highlight to make platforms more visible
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(platform.x, platform.y + 8, platform.width, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(platform.x, platform.y, platform.width, 2);
  });
  
  // Draw springs
  gameRefs.springs.forEach(spring => {
    if (spring.active) {
      // Draw spring base
      ctx.fillStyle = '#A0522D'; // Brown base
      ctx.fillRect(spring.x, spring.y + spring.height - 2, spring.width, 2);
      
      // Draw spring coil
      ctx.fillStyle = '#FF6347'; // Red spring
      ctx.fillRect(spring.x, spring.y, spring.width, spring.height);
      
      // Add visual detail to spring
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(spring.x + 2, spring.y, spring.width - 4, 2);
    }
  });
  
  // Draw player (doodle character) with more detail
  // Draw body
  ctx.fillStyle = '#32CD32'; // Green body
  ctx.fillRect(gameRefs.player.x, gameRefs.player.y, gameRefs.player.width, gameRefs.player.height);
  
  // Draw player eyes (white parts)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(gameRefs.player.x + 15, gameRefs.player.y + 15, 7, 0, Math.PI * 2);
  ctx.arc(gameRefs.player.x + 35, gameRefs.player.y + 15, 7, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw player pupils (black parts)
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(gameRefs.player.x + 16, gameRefs.player.y + 15, 3, 0, Math.PI * 2);
  ctx.arc(gameRefs.player.x + 36, gameRefs.player.y + 15, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw player mouth
  ctx.fillStyle = '#FF6347'; // Red mouth
  ctx.beginPath();
  ctx.ellipse(
    gameRefs.player.x + 25,
    gameRefs.player.y + 32,
    10,
    5,
    0,
    0,
    Math.PI
  );
  ctx.fill();
  
  // Add score display on screen
  ctx.fillStyle = 'black';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Score: ${Math.floor(gameRefs.viewportOffset / 10)}`, canvasWidth / 2, 30);
};
