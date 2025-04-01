
const GameRules = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">How to Play</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Words from a category will be revealed one at a time.</li>
        <li>Your goal is to guess the category with as few words as possible.</li>
        <li>The fewer words you need to see, the more points you earn.</li>
        <li>If your guess is incorrect, another word will be revealed.</li>
        <li>You can use a hint to see the first letter of the category, but it will reduce your points.</li>
        <li>Complete 5 rounds to finish the game.</li>
      </ul>
    </div>
  );
};

export default GameRules;
