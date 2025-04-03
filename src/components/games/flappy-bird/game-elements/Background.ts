
export class Background {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  render(clouds: any[]) {
    // Sky gradient
    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight - 90);
    skyGradient.addColorStop(0, "#64B5F6"); // Light blue
    skyGradient.addColorStop(1, "#90CAF9"); // Lighter blue
    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight - 90);
    
    // Draw clouds
    clouds.forEach(cloud => cloud.draw(this.ctx));
    
    // Mountains in background
    this.ctx.fillStyle = "#81C784"; // Light green
    
    // First mountain
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvasHeight - 90);
    this.ctx.lineTo(this.canvasWidth * 0.2, this.canvasHeight - 150);
    this.ctx.lineTo(this.canvasWidth * 0.4, this.canvasHeight - 90);
    this.ctx.fill();
    
    // Second mountain
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.3, this.canvasHeight - 90);
    this.ctx.lineTo(this.canvasWidth * 0.5, this.canvasHeight - 180);
    this.ctx.lineTo(this.canvasWidth * 0.7, this.canvasHeight - 90);
    this.ctx.fill();
    
    // Third mountain
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth * 0.6, this.canvasHeight - 90);
    this.ctx.lineTo(this.canvasWidth * 0.8, this.canvasHeight - 140);
    this.ctx.lineTo(this.canvasWidth, this.canvasHeight - 90);
    this.ctx.fill();
    
    // Ground gradient
    const groundGradient = this.ctx.createLinearGradient(0, this.canvasHeight - 90, 0, this.canvasHeight);
    groundGradient.addColorStop(0, "#8B4513"); // Darker brown
    groundGradient.addColorStop(1, "#A0522D"); // Lighter brown
    this.ctx.fillStyle = groundGradient;
    this.ctx.fillRect(0, this.canvasHeight - 90, this.canvasWidth, 90);
    
    // Grass detail
    this.ctx.fillStyle = "#7CFC00"; // Bright green
    this.ctx.fillRect(0, this.canvasHeight - 90, this.canvasWidth, 6);
    
    // Grass blades
    this.ctx.fillStyle = "#66BB6A"; // Medium green
    for (let i = 0; i < this.canvasWidth; i += 10) {
      const height = Math.random() * 5 + 6;
      this.ctx.fillRect(i, this.canvasHeight - 90, 2, -height);
    }
  }
}
