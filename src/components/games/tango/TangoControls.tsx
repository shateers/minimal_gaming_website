
import { Button } from "@/components/ui/button";

interface TangoControlsProps {
  gameCompleted: boolean;
  onResetGame: () => void;
  onHint: () => void;
}

const TangoControls = ({ gameCompleted, onResetGame, onHint }: TangoControlsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onResetGame}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
      >
        {gameCompleted ? 'New Game' : 'Reset Game'}
      </Button>
      
      <Button
        onClick={onHint}
        disabled={gameCompleted}
        variant="secondary"
        className="px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Hint
      </Button>
    </div>
  );
};

export default TangoControls;
