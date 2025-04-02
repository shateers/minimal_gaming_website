
import { useRef, useEffect } from "react";

interface CloudProps {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Cloud = ({ ctx, x, y, width, height }: CloudProps) => {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y + height/2, width/3, 0, Math.PI * 2);
  ctx.arc(x + width/3, y + height/2, width/3, 0, Math.PI * 2);
  ctx.arc(x + width/1.5, y + height/2, width/3, 0, Math.PI * 2);
  ctx.arc(x + width/4, y + height/4, width/4, 0, Math.PI * 2);
  ctx.arc(x + width/1.8, y + height/4, width/4, 0, Math.PI * 2);
  ctx.fill();
  
  return null;
};

export class CloudClass {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = Math.random() * 60 + 40;
    this.height = this.width * 0.6;
    this.x = canvasWidth;
    this.y = Math.random() * (canvasHeight / 2 - this.height);
    this.speed = Math.random() * 0.5 + 0.5;
  }
  
  update() {
    this.x -= this.speed;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    Cloud({ 
      ctx, 
      x: this.x, 
      y: this.y, 
      width: this.width, 
      height: this.height
    });
  }
}
