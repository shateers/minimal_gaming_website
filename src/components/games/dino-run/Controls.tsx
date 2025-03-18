
import React from "react";
import { Button } from "@/components/ui/button";

interface ControlsProps {
  score: number;
  bestScore: number;
  gameOver: boolean;
  onReset: () => void;
}

const Controls = ({ score, bestScore, gameOver, onReset }: ControlsProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-4">
          <div className="bg-[#535353] px-4 py-2 rounded-lg text-white">
            <div className="text-sm uppercase font-semibold">Score</div>
            <div className="text-lg font-bold">{score}</div>
          </div>

          <div className="bg-[#535353] px-4 py-2 rounded-lg text-white">
            <div className="text-sm uppercase font-semibold">Best</div>
            <div className="text-lg font-bold">{bestScore}</div>
          </div>
        </div>

        <Button 
          onClick={onReset}
          className="px-6 py-3 bg-[#8f7a66] text-white rounded-lg font-medium shadow-sm hover:bg-[#8f7a66]/90 transition-colors"
        >
          New Game
        </Button>
      </div>

      {gameOver && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-center">
          <p className="text-lg font-medium">
            Game Over!
          </p>
          <p>
            Final Score: {score}
          </p>
        </div>
      )}
    </div>
  );
};

export default Controls;
