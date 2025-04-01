
interface StatusInfoProps {
  revealedWords: number[];
  hintUsed: boolean;
}

const StatusInfo = ({ revealedWords, hintUsed }: StatusInfoProps) => {
  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-muted-foreground">
      <div>
        Words revealed: {revealedWords.length}/5
      </div>
      <div>
        {hintUsed ? "Hint used (-points)" : "No hint used"}
      </div>
    </div>
  );
};

export default StatusInfo;
