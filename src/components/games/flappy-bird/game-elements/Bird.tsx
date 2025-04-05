
import { useRef, useEffect } from "react";

interface BirdProps {
  ctx: CanvasRenderingContext2D;
  canvasHeight: number;
  velocity: number;
  rotation: number;
  x: number;
  y: number;
  wingPosition: number;
}

export const Bird = ({ ctx, x, y, rotation, wingPosition }: BirdProps) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation * Math.PI / 180);
  
  // Bird body
  ctx.fillStyle = "#FFD700"; // Yellow
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Bird's wing
  ctx.fillStyle = "#FFA500"; // Orange
  ctx.beginPath();
  ctx.ellipse(
    -5, 
    wingPosition + 2, 
    10, 
    6, 
    Math.PI/4, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // Bird's eye
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(8, -5, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // White highlight in eye
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(9, -6, 1, 0, Math.PI * 2);
  ctx.fill();
  
  // Bird's beak
  ctx.fillStyle = "#FF6347"; // Red-orange
  ctx.beginPath();
  ctx.moveTo(15, -2);
  ctx.lineTo(25, 0);
  ctx.lineTo(15, 3);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
  
  return null;
};

export class BirdClass {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  wingPosition: number;
  wingDirection: number;
  rotation: number;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 3;
    this.y = canvasHeight * 0.3; // Start at the top third of screen
    this.width = 34;
    this.height = 24;
    this.velocity = 0;
    this.wingPosition = 0;
    this.wingDirection = 1;
    this.rotation = 0;
  }
  
  update(gravity: number, canvasHeight: number) {
    // Apply gravity with a gentler initial fall
    this.velocity += gravity;
    this.y += this.velocity;
    
    // Update wing animation
    if (Math.floor(Date.now() / 100) % 5 === 0) {
      this.wingPosition += this.wingDirection;
      if (this.wingPosition >= 3 || this.wingPosition <= 0) {
        this.wingDirection *= -1;
      }
    }
    
    // Update rotation based on velocity with limits
    this.rotation = this.velocity * 2;
    if (this.rotation > 70) this.rotation = 70;
    if (this.rotation < -30) this.rotation = -30;
    
    // Ceiling collision - just bounce back, don't end game
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
  
  jump() {
    this.velocity = -5.2;
    this.rotation = -30;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    Bird({ 
      ctx, 
      canvasHeight: 0, 
      velocity: this.velocity, 
      rotation: this.rotation, 
      x: this.x, 
      y: this.y, 
      wingPosition: this.wingPosition 
    });
  }
  
  // Returns the hitbox for collision detection (smaller than visual sprite)
  getHitbox() {
    return {
      x: this.x - this.width / 4,
      y: this.y - this.height / 4,
      width: this.width / 2,
      height: this.height / 2
    };
  }
}
