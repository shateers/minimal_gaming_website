
export class CloudClass {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = Math.random() * 80 + 60; // Random width between 60-140
    this.height = Math.random() * 40 + 30; // Random height between 30-70
    this.x = canvasWidth;
    this.y = Math.random() * (canvasHeight / 2); // Clouds only in top half of screen
    this.speed = Math.random() * 0.5 + 0.5; // Random speed between 0.5-1
  }
  
  update() {
    this.x -= this.speed;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    
    // Draw a cluster of circles for the cloud
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radiusX = this.width / 2;
    const radiusY = this.height / 2;
    
    ctx.beginPath();
    ctx.arc(centerX - radiusX / 2, centerY, radiusY * 0.8, 0, Math.PI * 2);
    ctx.arc(centerX + radiusX / 2, centerY, radiusY * 0.9, 0, Math.PI * 2);
    ctx.arc(centerX, centerY - radiusY / 4, radiusY * 0.7, 0, Math.PI * 2);
    ctx.arc(centerX, centerY + radiusY / 4, radiusY * 0.8, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, radiusY, 0, Math.PI * 2);
    ctx.fill();
  }
}
