
import { BirdClass } from "./Bird";
import { PipeClass } from "./Pipe";
import { CloudClass } from "./Cloud";
import { Background } from "./Background";
import { ScoreUI, WaitingScreen, GameOverScreen } from "./GameUI";

export class GameRenderer {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  renderBackground(clouds: CloudClass[]) {
    Background({
      ctx: this.ctx,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      clouds: clouds
    });
  }

  renderBird(bird: BirdClass) {
    bird.draw(this.ctx);
  }

  renderPipes(pipes: PipeClass[]) {
    pipes.forEach(pipe => {
      pipe.draw(this.ctx, this.canvasHeight);
    });
  }

  renderScore(score: number) {
    ScoreUI({
      ctx: this.ctx,
      canvasWidth: this.canvasWidth,
      score: score
    });
  }

  renderWaitingScreen() {
    WaitingScreen({
      ctx: this.ctx,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight
    });
  }

  renderGameOverScreen(score: number) {
    GameOverScreen({
      ctx: this.ctx,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      score: score
    });
  }
  
  // New method to apply visual effects
  applyVisualEffects() {
    // Optional: Add visual effects like subtle gradient, particle effects, etc.
    // This is just a placeholder for future enhancements
    this.ctx.save();
    // Example: Add a subtle vignette effect
    const gradient = this.ctx.createRadialGradient(
      this.canvasWidth / 2, 
      this.canvasHeight / 2, 
      this.canvasHeight * 0.3, 
      this.canvasWidth / 2, 
      this.canvasHeight / 2, 
      this.canvasHeight
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.restore();
  }
}
