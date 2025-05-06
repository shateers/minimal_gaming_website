
import { useState } from "react";
import { motion } from "framer-motion";
import { MemoryCard } from "@/hooks/games/memory-match/useMemoryMatchGame";

interface CardProps {
  card: MemoryCard;
  onFlip: () => void;
  soundEnabled: boolean;
}

export const Card = ({ card, onFlip, soundEnabled }: CardProps) => {
  // Track if the card is currently animating
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    // Prevent clicking during animation or if already flipped/matched
    if (isAnimating || card.isFlipped || card.isMatched) return;
    
    // Play flip sound if enabled
    if (soundEnabled) {
      const audio = new Audio("/sounds/card-flip.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
    
    onFlip();
  };
  
  return (
    <div 
      onClick={handleClick}
      className={`
        relative cursor-pointer select-none w-full aspect-square
        ${card.isMatched ? 'opacity-70' : ''}
      `}
    >
      <div
        className={`
          w-full h-full rounded-md
          transition-transform duration-300
          ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Card Back */}
        <div
          className={`
            absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600
            border-2 border-white rounded-md flex items-center justify-center
            text-white text-2xl font-bold shadow-md
            ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
        >
          ?
        </div>
        
        {/* Card Front */}
        <div
          className={`
            absolute w-full h-full bg-white border-2
            ${card.isMatched ? 'border-green-400' : 'border-blue-300'}
            rounded-md flex items-center justify-center text-4xl shadow-md
            ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300
            transform rotate-y-180
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {card.value}
        </div>
      </div>
    </div>
  );
};
