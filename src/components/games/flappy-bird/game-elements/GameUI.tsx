
import { useRef, useEffect } from "react";
import { GameState } from "../../../../hooks/games/flappy-bird/useFlappyBirdGame";

interface ScoreUIProps {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  score: number;
}

export const ScoreUI = ({ ctx, canvasWidth, score }: ScoreUIProps) => {
  // Text shadow
  ctx.fillStyle = "#000";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${score}`, canvasWidth / 2 + 2, 52);
  
  // Actual text
  ctx.fillStyle = "#fff";
  ctx.fillText(`${score}`, canvasWidth / 2, 50);
  
  return null;
};

interface WaitingScreenProps {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
}

export const WaitingScreen = ({ ctx, canvasWidth, canvasHeight }: WaitingScreenProps) => {
  // Semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Text with shadow
  ctx.fillStyle = "#000";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Click or Press Space", canvasWidth / 2 + 2, canvasHeight / 2 - 28);
  ctx.fillText("to Start", canvasWidth / 2 + 2, canvasHeight / 2 + 2);
  
  ctx.fillStyle = "#fff";
  ctx.fillText("Click or Press Space", canvasWidth / 2, canvasHeight / 2 - 30);
  ctx.fillText("to Start", canvasWidth / 2, canvasHeight / 2);
  
  return null;
};

interface GameOverScreenProps {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  score: number;
}

export const GameOverScreen = ({ ctx, canvasWidth, canvasHeight, score }: GameOverScreenProps) => {
  // Semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Text with shadow
  ctx.fillStyle = "#000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvasWidth / 2 + 2, canvasHeight / 2 - 28);
  
  ctx.font = "22px Arial";
  ctx.fillText(`Score: ${score}`, canvasWidth / 2 + 2, canvasHeight / 2 + 12);
  
  ctx.font = "18px Arial";
  ctx.fillText("Click or Press Space", canvasWidth / 2 + 2, canvasHeight / 2 + 52);
  ctx.fillText("to Restart", canvasWidth / 2 + 2, canvasHeight / 2 + 82);
  
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Arial";
  ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 30);
  
  ctx.font = "22px Arial";
  ctx.fillText(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 10);
  
  ctx.font = "18px Arial";
  ctx.fillText("Click or Press Space", canvasWidth / 2, canvasHeight / 2 + 50);
  ctx.fillText("to Restart", canvasWidth / 2, canvasHeight / 2 + 80);
  
  return null;
};
