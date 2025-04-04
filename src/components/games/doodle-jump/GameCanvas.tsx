
import { forwardRef } from 'react';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ width, height }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg shadow-lg mx-auto bg-sky-100"
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
