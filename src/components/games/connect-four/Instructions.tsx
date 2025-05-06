
import { FC } from 'react';

const Instructions: FC = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">How to Play</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Connect Four is a two-player game where players take turns dropping colored discs into a vertical grid.</li>
        <li>The objective is to be the first to form a horizontal, vertical, or diagonal line of four of one's own discs.</li>
        <li>Player 1 uses red discs, and Player 2 uses yellow discs.</li>
        <li>Click on a column to drop your disc into that column.</li>
        <li>The first player to connect four discs wins the game.</li>
        <li>If the board fills up with no winner, the game ends in a draw.</li>
      </ul>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h3 className="font-semibold mb-1">Strategy Tip</h3>
        <p>Try to block your opponent's potential connections while building your own. The center column is strategically valuable since it allows more ways to connect four discs.</p>
      </div>
    </div>
  );
};

export default Instructions;
