
export class BirdClass {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  rotation: number;
  flapSpeed: number;
  fallRotation: number;
  jumpStrength: number;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 40;
    this.height = 30;
    this.x = canvasWidth / 3;
    this.y = canvasHeight / 2;
    this.velocity = 0;
    this.rotation = 0;
    this.flapSpeed = -7;
    this.fallRotation = Math.PI / 6;
    this.jumpStrength = -7;
  }
  
  flap() {
    this.velocity = this.flapSpeed;
    this.rotation = -this.fallRotation;
  }
  
  update(gravity: number, canvasHeight: number) {
    // Update velocity with gravity
    this.velocity += gravity;
    
    // Update bird position
    this.y += this.velocity;
    
    // Update rotation based on velocity
    if (this.velocity > 0) {
      this.rotation = Math.min(this.fallRotation, this.rotation + 0.1);
    }
    
    // Prevent bird from going above the screen
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
    
    // No need to check for floor collision here, moved to GameState
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Translate to the bird's center for rotation
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    
    // Draw the bird
    ctx.fillStyle = "#f4ce42"; // Yellow body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the wing
    ctx.fillStyle = "#f8e7a3"; // Light yellow wing
    ctx.beginPath();
    ctx.ellipse(0, 5, this.width / 3, this.height / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.width / 4, -this.height / 6, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the pupil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.width / 4 + 2, -this.height / 6, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the beak
    ctx.fillStyle = "#ff7b00"; // Orange beak
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2 + 15, -5);
    ctx.lineTo(this.width / 2 + 15, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}
