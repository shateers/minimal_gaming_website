
import { useRef, useEffect } from "react";

interface PipeProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  topHeight: number;
  gap: number;
  width: number;
  canvasHeight: number;
}

export const Pipe = ({ ctx, x, topHeight, gap, width, canvasHeight }: PipeProps) => {
  // Gradient for pipes
  const pipeGradient = ctx.createLinearGradient(x, 0, x + width, 0);
  pipeGradient.addColorStop(0, "#2E8B57"); // Dark green
  pipeGradient.addColorStop(0.5, "#3CB371"); // Medium green
  pipeGradient.addColorStop(1, "#2E8B57"); // Dark green
  
  // Top pipe
  ctx.fillStyle = pipeGradient;
  ctx.fillRect(x, 0, width, topHeight);
  
  // Pipe cap (top)
  const capGradient = ctx.createLinearGradient(x - 2, 0, x + width + 4, 0);
  capGradient.addColorStop(0, "#1E5631");
  capGradient.addColorStop(0.5, "#2E8B57");
  capGradient.addColorStop(1, "#1E5631");
  
  ctx.fillStyle = capGradient;
  ctx.fillRect(x - 5, topHeight - 15, width + 10, 15);
  ctx.fillRect(x - 5, topHeight - 15, width + 10, 5);
  
  // Bottom pipe
  const bottomPipeY = topHeight + gap;
  ctx.fillStyle = pipeGradient;
  ctx.fillRect(x, bottomPipeY, width, canvasHeight - bottomPipeY);
  
  // Pipe cap (bottom)
  ctx.fillStyle = capGradient;
  ctx.fillRect(x - 5, bottomPipeY, width + 10, 15);
  ctx.fillRect(x - 5, bottomPipeY, width + 10, 5);
  
  return null;
};

export class PipeClass {
  x: number;
  topHeight: number;
  gap: number;
  width: number;
  counted: boolean;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth;
    this.width = 52;
    this.gap = 120;
    this.counted = false;
    // Random height for top pipe (between 50px and canvas height - gap - 140px)
    this.topHeight = Math.floor(Math.random() * (canvasHeight - this.gap - 190)) + 50;
  }
  
  update(speed: number, birdX: number, canvasWidth: number) {
    this.x -= speed;
    
    // Check if pipe has passed the bird and update score
    if (!this.counted && this.x + this.width < birdX) {
      this.counted = true;
      return true; // Return true to increment score
    }
    return false;
  }
  
  draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
    Pipe({ 
      ctx, 
      x: this.x, 
      topHeight: this.topHeight, 
      gap: this.gap, 
      width: this.width, 
      canvasHeight
    });
  }
  
  checkCollision(bird: BirdClass) {
    // Calculate actual bird hitbox (smaller than visual representation)
    const birdHitboxX = bird.x - bird.width / 3;
    const birdHitboxY = bird.y - bird.height / 3;
    const birdHitboxWidth = bird.width / 1.5;
    const birdHitboxHeight = bird.height / 1.5;
    
    // Collision with top pipe
    if (
      birdHitboxX + birdHitboxWidth > this.x &&
      birdHitboxX < this.x + this.width &&
      birdHitboxY < this.topHeight
    ) {
      return true;
    }
    
    // Collision with bottom pipe
    const bottomPipeY = this.topHeight + this.gap;
    if (
      birdHitboxX + birdHitboxWidth > this.x &&
      birdHitboxX < this.x + this.width &&
      birdHitboxY + birdHitboxHeight > bottomPipeY
    ) {
      return true;
    }
    
    return false;
  }
}
