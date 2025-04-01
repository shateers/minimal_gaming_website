
import { FormEvent, useState } from 'react';

interface GuessFormProps {
  onGuessSubmit: (guess: string) => void;
  feedback: '' | 'correct' | 'incorrect';
  onGetHint: () => void;
  hintUsed: boolean;
}

const GuessForm = ({ onGuessSubmit, feedback, onGetHint, hintUsed }: GuessFormProps) => {
  const [userGuess, setUserGuess] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (userGuess.trim()) {
      onGuessSubmit(userGuess);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          placeholder="Guess the category..."
          className={`w-full p-3 border ${
            feedback === "correct" ? "border-green-500 bg-green-50" :
            feedback === "incorrect" ? "border-red-500 bg-red-50" :
            "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
          disabled={!!feedback}
        />
        {feedback && (
          <div className={`absolute right-3 top-3 ${
            feedback === "correct" ? "text-green-500" : "text-red-500"
          }`}>
            {feedback === "correct" ? "✓" : "✗"}
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!!feedback || !userGuess.trim()}
          className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Submit Guess
        </button>
        
        <button
          type="button"
          onClick={onGetHint}
          disabled={!!feedback || hintUsed}
          className="py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Hint
        </button>
      </div>
    </form>
  );
};

export default GuessForm;
