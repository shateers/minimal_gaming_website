
const Instructions = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">How to Play</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Press the "Jump" button or Spacebar to make the bird fly upward.</li>
        <li>Navigate through the pipes without touching them.</li>
        <li>Each pipe you successfully pass gives you one point.</li>
        <li>If you hit a pipe or the ground, the game is over.</li>
        <li>Try to maintain a steady rhythm of jumps to control your height.</li>
        <li>The bird will naturally fall due to gravity, so time your jumps carefully.</li>
        <li>Look ahead to plan your trajectory through upcoming pipes.</li>
        <li>Try to beat your high score!</li>
      </ul>
    </div>
  );
};

export default Instructions;
