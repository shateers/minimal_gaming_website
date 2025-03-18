
import React from "react";

const Instructions = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">How to Play</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Press <strong>Space</strong> or <strong>Up Arrow</strong> to jump over cacti. On mobile, <strong>tap the screen</strong>.
        </li>
        <li>
          Press <strong>Down Arrow</strong> to duck under flying obstacles. On mobile, <strong>swipe down</strong>.
        </li>
        <li>
          The game speeds up as your score increases.
        </li>
        <li>
          Avoid obstacles to survive as long as possible and achieve a high score.
        </li>
      </ul>
      
      <div className="mt-4 text-muted-foreground">
        <p>
          The Chrome T-Rex game was created by Google. This is an implementation of the game for educational purposes.
        </p>
      </div>
    </div>
  );
};

export default Instructions;
