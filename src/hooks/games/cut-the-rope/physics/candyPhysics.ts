
import { Rope } from '../types';

export const updateCandyPhysics = (
  candy: { 
    x: number; 
    y: number; 
    velocityX: number; 
    velocityY: number; 
    attached: boolean;
    attachedToRopeIds: number[];
    radius: number;
  }, 
  ropes: Rope[], 
  gravity: number,
  airResistance: number,
  canvasWidth: number,
  canvasHeight: number,
  deltaTime: number
): void => {
  // Check if candy is still attached to any rope
  const stillAttached = ropes.some(rope => !rope.cut && candy.attachedToRopeIds.includes(rope.id));
  candy.attached = stillAttached;
  
  if (candy.attached) {
    // If attached to ropes, update candy position based on connected ropes
    const attachedRopes = ropes.filter(rope => !rope.cut && candy.attachedToRopeIds.includes(rope.id));
    
    if (attachedRopes.length > 0) {
      let avgX = 0;
      let avgY = 0;
      
      attachedRopes.forEach(rope => {
        avgX += rope.endX;
        avgY += rope.endY;
      });
      
      candy.x = avgX / attachedRopes.length;
      candy.y = avgY / attachedRopes.length;
    }
  } else {
    // If not attached, apply physics
    candy.velocityY += gravity * deltaTime * 0.01;
    
    // Apply air resistance
    candy.velocityX *= airResistance;
    candy.velocityY *= airResistance;
    
    // Move candy
    candy.x += candy.velocityX * deltaTime * 0.1;
    candy.y += candy.velocityY * deltaTime * 0.1;
    
    // Wall collision
    if (candy.x - candy.radius < 0) {
      candy.x = candy.radius;
      candy.velocityX *= -0.7;
    } else if (candy.x + candy.radius > canvasWidth) {
      candy.x = canvasWidth - candy.radius;
      candy.velocityX *= -0.7;
    }
    
    // Floor collision
    if (candy.y + candy.radius > canvasHeight) {
      candy.y = canvasHeight - candy.radius;
      candy.velocityY *= -0.5;
      
      // Add some friction on floor
      candy.velocityX *= 0.9;
    }
  }
};
