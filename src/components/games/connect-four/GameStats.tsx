
import { FC } from 'react';

interface GameStatsProps {
  timer: number;
  moves: number;
  formatTime: (seconds: number) => string;
}

const GameStats: FC<GameStatsProps> = ({ timer, moves, formatTime }) => {
  return (
    <div className="flex gap-4">
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
