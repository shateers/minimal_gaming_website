
interface GameStatsProps {
  score: number;
  highScore: number;
}

const GameStats = ({ score, highScore }: GameStatsProps) => {
  return (
    <div className="flex justify-center gap-8 mb-4">
      <div className="bg-secondary/30 px-6 py-2 rounded-lg">
        <div className="text-lg font-medium">
          Score: {score}
        </div>
      </div>
      
      <div className="bg-secondary/30 px-6 py-2 rounded-lg">
        <div className="text-lg font-medium">
          High Score: {highScore}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
