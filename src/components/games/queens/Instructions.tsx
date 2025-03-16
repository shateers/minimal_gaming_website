
import React from "react";

type InstructionsProps = {
  boardSize: number;
};

const Instructions = ({ boardSize }: InstructionsProps) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
      <h2 className="text-xl font-bold mb-4">Rules</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Place {boardSize} queens on the {boardSize}x{boardSize} board.
        </li>
        <li>
          Queens can move any number of squares horizontally, vertically, or
          diagonally.
        </li>
        <li>No two queens should be able to attack each other.</li>
        <li>Red highlighting indicates queens that are in conflict.</li>
      </ul>
    </div>
  );
};

export default Instructions;
