
interface GameStatsProps {
  score: number;
  highScore: number;
}

const GameStats = ({ score, highScore }: GameStatsProps) => {
  return (
    <div className="flex justify-center gap-8 mb-4">
      <div className="bg-gradient-to-r from-sky-400/50 to-sky-500/50 px-6 py-2 rounded-lg shadow-sm border border-sky-200">
        <div className="text-lg font-medium text-white">
          Score: {score}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-amber-400/50 to-amber-500/50 px-6 py-2 rounded-lg shadow-sm border border-amber-200">
        <div className="text-lg font-medium text-white">
          High Score: {highScore}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
