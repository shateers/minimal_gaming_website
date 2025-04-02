
import { useRef, useEffect, useState } from "react";
import { GameState } from "../../../hooks/games/flappy-bird/useFlappyBirdGame";
import { GameEngine } from "./game-elements/GameEngine";

interface GameCanvasProps {
  gameState: GameState;
  score: number;
  onJump: () => void;
  onGameOver: () => void;
}

const GameCanvas = ({ gameState, score, onJump, onGameOver }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, gameState, score, onJump, onGameOver);
    
    return () => {
      // Clean up game engine when component unmounts
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
    };
  }, []);
  
  // Update game state when it changes
  useEffect(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.updateGameState(gameState);
    }
  }, [gameState]);
  
  // Update score when it changes
  useEffect(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.updateScore(score);
    }
  }, [score]);
  
  return (
    <div className="flex justify-center my-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-border">
        <canvas
          ref={canvasRef}
          className="mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default GameCanvas;
