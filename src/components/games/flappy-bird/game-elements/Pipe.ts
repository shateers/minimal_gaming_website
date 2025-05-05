
import { BirdClass } from "./Bird";

export class PipeClass {
  x: number;
  width: number;
  gapHeight: number;
  gapPosition: number;
  topHeight: number;
  bottomHeight: number;
  scored: boolean;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth;
    this.width = 80;
    this.gapHeight = 150; // Space between pipes
    
    // Random position for the gap, but not too close to top or bottom
    const minGapY = 100;
    const maxGapY = canvasHeight - 100 - this.gapHeight;
    this.gapPosition = Math.random() * (maxGapY - minGapY) + minGapY;
    
    // Calculate heights of top and bottom parts
    this.topHeight = this.gapPosition;
    this.bottomHeight = canvasHeight - this.gapPosition - this.gapHeight;
    
    this.scored = false;
  }
  
  update(speed: number, birdX: number, canvasWidth: number): boolean {
    this.x -= speed;
    
    // Check if bird has passed the pipe and update score
    if (!this.scored && this.x + this.width < birdX) {
      this.scored = true;
      return true; // Bird passed pipe, increment score
    }
    
    return false;
  }
  
  draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
    ctx.fillStyle = "#4CAF50"; // Green color for pipes
    
    // Top pipe
    ctx.fillRect(this.x, 0, this.width, this.topHeight);
    
    // Bottom pipe
    ctx.fillRect(
      this.x,
      this.topHeight + this.gapHeight,
      this.width,
      this.bottomHeight
    );
    
    // Pipe caps (looks nicer)
    const capHeight = 20;
    ctx.fillStyle = "#388E3C"; // Darker green for caps
    
    // Top pipe cap
    ctx.fillRect(this.x - 5, this.topHeight - capHeight, this.width + 10, capHeight);
    
    // Bottom pipe cap
    ctx.fillRect(this.x - 5, this.topHeight + this.gapHeight, this.width + 10, capHeight);
  }
  
  checkCollision(bird: BirdClass): boolean {
    // Check collision with top pipe
    if (
      bird.x + bird.width > this.x &&
      bird.x < this.x + this.width &&
      bird.y < this.topHeight
    ) {
      return true;
    }
    
    // Check collision with bottom pipe
    if (
      bird.x + bird.width > this.x &&
      bird.x < this.x + this.width &&
      bird.y + bird.height > this.topHeight + this.gapHeight
    ) {
      return true;
    }
    
    return false;
  }
}
