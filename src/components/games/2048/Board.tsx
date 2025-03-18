
import React, { useRef, useEffect } from "react";
import Tile from "./Tile";

interface BoardProps {
  board: number[][];
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

const Board = ({ board, onSwipe }: BoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Check if swipe was horizontal or vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 50) {
        onSwipe('right');
      } else if (diffX < -50) {
        onSwipe('left');
      }
    } else {
      // Vertical swipe
      if (diffY > 50) {
        onSwipe('down');
      } else if (diffY < -50) {
        onSwipe('up');
      }
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div 
        ref={boardRef}
        className="bg-[#bbada0] rounded-lg shadow-lg p-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        aria-label="2048 Game Board"
      >
        <div 
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) => 
            row.map((value, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                value={value}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
