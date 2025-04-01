
interface HintDisplayProps {
  categoryFirstLetter: string;
  hintUsed: boolean;
}

const HintDisplay = ({ categoryFirstLetter, hintUsed }: HintDisplayProps) => {
  if (!hintUsed) return null;
  
  return (
    <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
      <p className="text-sm font-medium">
        Hint: The category starts with the letter "{categoryFirstLetter}"
      </p>
    </div>
  );
};

export default HintDisplay;
