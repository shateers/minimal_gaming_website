
import { GameRefs } from './types';

export const setupMouseTouchEvents = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gameRefsRef: React.MutableRefObject<GameRefs>
): () => void => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Convert screen coordinates to canvas coordinates
    gameRefsRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    gameRefsRef.current.mouseY = ((e.clientY - rect.top) / rect.height) * canvas.height;
  };
  
  const handleMouseDown = () => {
    gameRefsRef.current.mousePressing = true;
  };
  
  const handleMouseUp = () => {
    gameRefsRef.current.mousePressing = false;
  };
  
  const handleTouchStart = (e: TouchEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    gameRefsRef.current.mouseX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    gameRefsRef.current.mouseY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
    gameRefsRef.current.mousePressing = true;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    
    gameRefsRef.current.mouseX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    gameRefsRef.current.mouseY = ((touch.clientY - rect.top) / rect.height) * canvas.height;
  };
  
  const handleTouchEnd = () => {
    gameRefsRef.current.mousePressing = false;
  };
  
  const canvas = canvasRef.current;
  if (canvas) {
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  }
  
  // Return cleanup function
  return () => {
    if (canvas) {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
  };
};
