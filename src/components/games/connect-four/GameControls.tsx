
import { FC } from 'react';

type Player = 1 | 2;
type GameStatus = 'playing' | 'paused' | 'won' | 'draw';

interface GameControlsProps {
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  timer: number;
  moves: number;
  formatTime: (seconds: number) => string;
  onReset: () => void;
  onPauseResume: () => void;
}

const GameControls: FC<GameControlsProps> = ({
  currentPlayer,
  gameStatus,
  winner,
  timer,
  moves,
  formatTime,
  onReset,
  onPauseResume
}) => {
  return (
    <div className="my-6">
      {gameStatus === 'won' && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center mb-4">
          <p className="text-lg font-medium">
            Player {winner === 1 ? 'Red' : 'Yellow'} Wins!
          </p>
          <p>
            Time: {formatTime(timer)} | Moves: {moves}
          </p>
        </div>
      )}

      {gameStatus === 'draw' && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg text-center mb-4">
          <p className="text-lg font-medium">Game Draw!</p>
          <p>
            Time: {formatTime(timer)} | Moves: {moves}
          </p>
        </div>
      )}

      {gameStatus === 'playing' && (
        <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <div className="font-medium mr-2">Current Player:</div>
          <div 
            className={`w-6 h-6 rounded-full ${
              currentPlayer === 1 ? 'bg-red-500' : 'bg-yellow-400'
            }`}
          />
          <div className="ml-2">{currentPlayer === 1 ? 'Red' : 'Yellow'}</div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={onReset} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>

        {(gameStatus === 'playing' || gameStatus === 'paused') && (
          <button 
            onClick={onPauseResume} 
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium shadow-sm hover:bg-gray-700 transition-colors"
          >
            {gameStatus === 'playing' ? 'Pause' : 'Resume'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameControls;
