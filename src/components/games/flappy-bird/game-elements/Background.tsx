
import { useRef, useEffect } from "react";
import { CloudClass } from "./Cloud";

interface BackgroundProps {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  clouds: CloudClass[];
}

export const Background = ({ ctx, canvasWidth, canvasHeight, clouds }: BackgroundProps) => {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight - 90);
  skyGradient.addColorStop(0, "#64B5F6"); // Light blue
  skyGradient.addColorStop(1, "#90CAF9"); // Lighter blue
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight - 90);
  
  // Draw clouds
  clouds.forEach(cloud => cloud.draw(ctx));
  
  // Mountains in background
  ctx.fillStyle = "#81C784"; // Light green
  
  // First mountain
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight - 90);
  ctx.lineTo(canvasWidth * 0.2, canvasHeight - 150);
  ctx.lineTo(canvasWidth * 0.4, canvasHeight - 90);
  ctx.fill();
  
  // Second mountain
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.3, canvasHeight - 90);
  ctx.lineTo(canvasWidth * 0.5, canvasHeight - 180);
  ctx.lineTo(canvasWidth * 0.7, canvasHeight - 90);
  ctx.fill();
  
  // Third mountain
  ctx.beginPath();
  ctx.moveTo(canvasWidth * 0.6, canvasHeight - 90);
  ctx.lineTo(canvasWidth * 0.8, canvasHeight - 140);
  ctx.lineTo(canvasWidth, canvasHeight - 90);
  ctx.fill();
  
  // Ground gradient
  const groundGradient = ctx.createLinearGradient(0, canvasHeight - 90, 0, canvasHeight);
  groundGradient.addColorStop(0, "#8B4513"); // Darker brown
  groundGradient.addColorStop(1, "#A0522D"); // Lighter brown
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, canvasHeight - 90, canvasWidth, 90);
  
  // Grass detail
  ctx.fillStyle = "#7CFC00"; // Bright green
  ctx.fillRect(0, canvasHeight - 90, canvasWidth, 6);
  
  // Grass blades
  ctx.fillStyle = "#66BB6A"; // Medium green
  for (let i = 0; i < canvasWidth; i += 10) {
    const height = Math.random() * 5 + 6;
    ctx.fillRect(i, canvasHeight - 90, 2, -height);
  }
  
  return null;
};
