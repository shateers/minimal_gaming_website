
import React, { useEffect, useRef, useState } from "react";

// Add interface for the Runner object
interface Runner {
  play: () => void;
  stop: () => void;
  gameOver: () => void;
  updateScore: (score: number) => void;
  distanceRan: number;
  distanceMeter: {
    config: {
      COEFFICIENT: number;
    };
  };
}

// Extend Window interface to include Runner
declare global {
  interface Window {
    Runner: any;
  }
}

interface DinoGameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: () => void;
}

const DinoGame: React.FC<DinoGameProps> = ({ onScoreUpdate, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameLoaded, setGameLoaded] = useState(false);
  const gameInstanceRef = useRef<Runner | null>(null);

  useEffect(() => {
    // Load the Runner script
    const script = document.createElement("script");
    script.src = "/dino-run/runner.js";
    script.async = true;
    script.onload = () => {
      setGameLoaded(true);
    };
    document.body.appendChild(script);

    // Add CSS for the game
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/dino-run/runner.css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
      
      // Clean up the game instance if it exists
      if (window.Runner && gameInstanceRef.current) {
        // Attempt to stop the game properly
        try {
          const runner = gameInstanceRef.current;
          if (runner && typeof runner.stop === 'function') {
            runner.stop();
          }
        } catch (e) {
          console.error("Error stopping the game:", e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (gameLoaded && canvasRef.current && window.Runner) {
      try {
        // Initialize the game
        const container = canvasRef.current.parentElement;
        if (container) {
          // Create the game container as expected by the Runner
          const gameContainer = document.createElement("div");
          gameContainer.className = "runner-container";
          
          const canvas = document.createElement("canvas");
          canvas.className = "runner-canvas";
          gameContainer.appendChild(canvas);
          container.appendChild(gameContainer);

          // Start the game with the correct container element as a string selector
          const runner = new window.Runner('.runner-container');
          gameInstanceRef.current = runner;

          // Set up score update callback
          const originalUpdateScore = runner.updateScore;
          runner.updateScore = function(score: number) {
            originalUpdateScore.call(runner, score);
            onScoreUpdate(score);
          };

          // Set up game over callback
          const originalGameOver = runner.gameOver;
          runner.gameOver = function() {
            originalGameOver.call(runner);
            onGameOver();
            
            // Get the final score
            if (runner.distanceRan) {
              const finalScore = Math.floor(runner.distanceRan * runner.distanceMeter.config.COEFFICIENT);
              onScoreUpdate(finalScore);
            }
          };

          // Start the game
          runner.play();
        }
      } catch (error) {
        console.error("Error initializing the game:", error);
      }
    }

    return () => {
      // Clean up DOM elements created by the game
      const container = canvasRef.current?.parentElement;
      if (container) {
        const gameContainer = container.querySelector('.runner-container');
        if (gameContainer) {
          container.removeChild(gameContainer);
        }
      }
    };
  }, [gameLoaded, onScoreUpdate, onGameOver]);

  return (
    <div className="flex justify-center mb-8">
      <div className="relative h-[300px] w-full max-w-[600px] bg-white">
        <canvas ref={canvasRef} className="hidden"></canvas>
        {!gameLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading game...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DinoGame;
