
interface WordDisplayProps {
  words: string[];
  revealedWords: number[];
}

const WordDisplay = ({ words, revealedWords }: WordDisplayProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Revealed Words:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {words.map((word, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg text-center font-medium ${
              revealedWords.includes(index) 
                ? 'bg-primary/10 border border-primary/30' 
                : 'bg-gray-100 text-gray-100 border border-transparent'
            }`}
          >
            {revealedWords.includes(index) ? word : 'Hidden'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;
