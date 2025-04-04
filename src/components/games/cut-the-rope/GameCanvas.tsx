
import { useEffect, useRef } from 'react';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const GameCanvas = ({ canvasRef }: GameCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const resizeCanvas = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      // Set canvas size based on container size
      const containerWidth = container.clientWidth;
      const containerHeight = Math.min(container.clientWidth * 0.75, window.innerHeight * 0.7);
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    };
    
    // Resize on component mount and window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full border-2 border-gray-200 rounded-lg shadow-md overflow-hidden bg-sky-50"
    >
      <canvas
        ref={canvasRef}
        className="max-w-full"
      />
    </div>
  );
};

export default GameCanvas;
