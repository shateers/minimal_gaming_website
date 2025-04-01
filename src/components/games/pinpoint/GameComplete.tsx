
interface GameCompleteProps {
  score: number;
  formatTime: (seconds: number) => string;
  timer: number;
  onPlayAgain: () => void;
}

const GameComplete = ({ score, formatTime, timer, onPlayAgain }: GameCompleteProps) => {
  return (
    <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
      <p className="text-lg mb-4">
        Your final score: <span className="font-bold text-primary">{score}</span>
      </p>
      <p className="mb-6">
        Time taken: {formatTime(timer)}
      </p>
      <button
        onClick={onPlayAgain}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameComplete;
