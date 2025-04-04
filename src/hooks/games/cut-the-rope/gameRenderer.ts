
import { GameRefs } from './types';

export const renderGame = (
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number,
  gameRefs: GameRefs
): void => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw background
  ctx.fillStyle = '#87CEFA'; // Light blue background
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw ropes
  gameRefs.ropes.forEach(rope => {
    if (rope.cut) return;
    
    // Draw rope with segments for more realistic appearance
    const segments = 10;
    
    ctx.strokeStyle = '#8B4513'; // Rope color
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let prevX = rope.startX;
    let prevY = rope.startY;
    
    // Draw rope with a slight curve for realism
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = rope.startX + t * (rope.endX - rope.startX);
      const y = rope.startY + t * (rope.endY - rope.startY);
      
      // Add some wave effect to the rope
      const waveSize = 5 * Math.sin(t * Math.PI * 2 + performance.now() / 500);
      const perpX = -Math.sin(rope.angle) * waveSize;
      const perpY = Math.cos(rope.angle) * waveSize;
      
      const curveX = x + perpX;
      const curveY = y + perpY;
      
      // Store joints for collision detection
      if (i - 1 < gameRefs.ropeJoints.length) {
        gameRefs.ropeJoints[i - 1] = { x: curveX, y: curveY };
      }
      
      ctx.lineTo(curveX, curveY);
      prevX = x;
      prevY = y;
    }
    
    ctx.stroke();
  });
  
  // Draw monster
  ctx.fillStyle = '#2E8B57'; // Monster color
  
  const monster = gameRefs.monster;
  
  // Draw monster body
  ctx.beginPath();
  ctx.ellipse(
    monster.x, 
    monster.y, 
    monster.width / 2, 
    monster.height / 2, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // Draw monster eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(
    monster.x - monster.width / 5, 
    monster.y - monster.height / 8, 
    monster.width / 8, 
    monster.height / 8, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(
    monster.x + monster.width / 5, 
    monster.y - monster.height / 8, 
    monster.width / 8, 
    monster.height / 8, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // Draw monster pupils
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.ellipse(
    monster.x - monster.width / 5, 
    monster.y - monster.height / 8, 
    monster.width / 16, 
    monster.height / 16, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(
    monster.x + monster.width / 5, 
    monster.y - monster.height / 8, 
    monster.width / 16, 
    monster.height / 16, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // Draw monster mouth (depends on state)
  if (monster.mouthOpen) {
    ctx.fillStyle = monster.happy ? '#FF69B4' : 'red';
    ctx.beginPath();
    ctx.ellipse(
      monster.x, 
      monster.y + monster.height / 4, 
      monster.width / 3, 
      monster.height / 4, 
      0, 
      0, 
      Math.PI
    );
    ctx.fill();
  } else {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(monster.x - monster.width / 4, monster.y + monster.height / 5);
    ctx.lineTo(monster.x + monster.width / 4, monster.y + monster.height / 5);
    ctx.stroke();
  }
  
  // Draw candy
  ctx.fillStyle = '#FF00FF'; // Candy color
  ctx.beginPath();
  ctx.arc(
    gameRefs.candy.x, 
    gameRefs.candy.y, 
    gameRefs.candy.radius, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // Add candy shine
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.arc(
    gameRefs.candy.x - gameRefs.candy.radius / 3, 
    gameRefs.candy.y - gameRefs.candy.radius / 3, 
    gameRefs.candy.radius / 3, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
};
