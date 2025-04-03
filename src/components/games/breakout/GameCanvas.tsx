
import { useEffect, forwardRef } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width, height }, ref) => {
    useEffect(() => {
      // Canvas is managed by the game hook
    }, []);

    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg shadow-lg mx-auto"
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
