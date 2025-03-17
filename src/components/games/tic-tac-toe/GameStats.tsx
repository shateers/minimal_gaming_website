
import React from "react";
import { formatTime } from "./utils";

interface GameStatsProps {
  timer: number;
  moves: number;
}

const GameStats: React.FC<GameStatsProps> = ({ timer, moves }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-secondary/30 px-4 py-2 rounded-lg">
        <div className="text-lg font-medium">
          Time: {formatTime(timer)}
        </div>
      </div>
      
      <div className="bg-secondary/30 px-4 py-2 rounded-lg">
        <div className="text-lg font-medium">
          Moves: {moves}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
