
import { Rope } from '../types';

export const updateRopePhysics = (rope: Rope, candy: { x: number; y: number; radius: number; }, deltaTime: number): void => {
  if (rope.cut) return;
  
  // Calculate ideal end position based on rope length
  const dx = candy.x - rope.startX;
  const dy = candy.y - rope.startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Apply tension if rope is stretched
  if (distance > rope.length) {
    const factor = rope.length / distance;
    rope.endX = rope.startX + dx * factor;
    rope.endY = rope.startY + dy * factor;
  } else {
    rope.endX = candy.x;
    rope.endY = candy.y;
  }
  
  // Update rope angle
  rope.angle = Math.atan2(rope.endY - rope.startY, rope.endX - rope.startX);
};

export const checkRopeCut = (
  ropes: Rope[], 
  mouseX: number, 
  mouseY: number, 
  mousePressing: boolean, 
  prevMousePressing: boolean
): void => {
  // Only check for cuts on mouse down
  if (!mousePressing || prevMousePressing) return;
  
  ropes.forEach(rope => {
    if (rope.cut) return;
    
    // Create segment points along the rope
    for (let i = 0; i < 10; i++) {
      const t = i / 10;
      const x = rope.startX + t * (rope.endX - rope.startX);
      const y = rope.startY + t * (rope.endY - rope.startY);
      
      // Check if mouse is close enough to any segment
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If mouse is within 20px of rope, cut it
      if (distance < 20) {
        rope.cut = true;
        break;
      }
    }
  });
};
