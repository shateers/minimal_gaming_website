
import { useRef, useEffect } from "react";

export class GameUI {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  renderScore(score: number) {
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 36px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(score.toString(), this.canvasWidth / 2, 60);
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;
    this.ctx.strokeText(score.toString(), this.canvasWidth / 2, 60);
  }

  renderWaitingScreen() {
    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Main text box
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(this.canvasWidth / 2 - 200, this.canvasHeight / 2 - 100, 400, 200);
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(this.canvasWidth / 2 - 200, this.canvasHeight / 2 - 100, 400, 200);

    // Heading text
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 32px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Flappy Bird", this.canvasWidth / 2, this.canvasHeight / 2 - 50);

    // Instructions text
    this.ctx.font = "24px Arial";
    this.ctx.fillText("Click to Start", this.canvasWidth / 2, this.canvasHeight / 2);
    this.ctx.font = "18px Arial";
    this.ctx.fillText("Press SPACE or click to fly", this.canvasWidth / 2, this.canvasHeight / 2 + 40);
  }
  
  renderCountdown(count: number) {
    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Countdown display
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 72px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(count.toString(), this.canvasWidth / 2, this.canvasHeight / 2);
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(count.toString(), this.canvasWidth / 2, this.canvasHeight / 2);
    
    // Reset text baseline
    this.ctx.textBaseline = "alphabetic";
  }

  renderGameOverScreen(score: number) {
    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Main text box
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(this.canvasWidth / 2 - 200, this.canvasHeight / 2 - 120, 400, 240);
    this.ctx.strokeStyle = "#ff5252";
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(this.canvasWidth / 2 - 200, this.canvasHeight / 2 - 120, 400, 240);

    // Game over text
    this.ctx.fillStyle = "#ff5252";
    this.ctx.font = "bold 40px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Game Over", this.canvasWidth / 2, this.canvasHeight / 2 - 60);

    // Score text
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "28px Arial";
    this.ctx.fillText(`Score: ${score}`, this.canvasWidth / 2, this.canvasHeight / 2);

    // Play again text
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Press SPACE to Play Again", this.canvasWidth / 2, this.canvasHeight / 2 + 70);
  }
}

export default GameUI;
