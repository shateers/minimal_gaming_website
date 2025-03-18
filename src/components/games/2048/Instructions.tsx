
import React from "react";

const Instructions = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">How to Play</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Use your <strong>arrow keys</strong> to move the tiles. On mobile, use <strong>swipe gestures</strong>.
        </li>
        <li>
          When two tiles with the same number touch, they <strong>merge into one</strong> with their sum.
        </li>
        <li>
          The goal is to create a tile with the number <strong>2048</strong>.
        </li>
        <li>
          After each move, a new tile with a value of <strong>2</strong> or <strong>4</strong> appears on the board.
        </li>
        <li>
          The game is over when there are no more possible moves (no empty spaces and no adjacent tiles with the same value).
        </li>
      </ul>
      
      <div className="mt-4 text-muted-foreground">
        <p>
          2048 was created by Gabriele Cirulli. This is an implementation of the game for educational purposes.
        </p>
      </div>
    </div>
  );
};

export default Instructions;
