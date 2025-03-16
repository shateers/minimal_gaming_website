
import React from "react";
import Cell from "./Cell";

type BoardProps = {
  board: boolean[][];
  selectedCell: [number, number] | null;
  conflicts: [number, number][];
  gameCompleted: boolean;
  onCellClick: (row: number, col: number) => void;
};

const Board = ({
  board,
  selectedCell,
  conflicts,
  gameCompleted,
  onCellClick,
}: BoardProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-border p-4">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((hasQueen, colIndex) => {
              const isConflict = conflicts.some(
                ([r, c]) => r === rowIndex && c === colIndex
              );
              const isSelected =
                selectedCell &&
                selectedCell[0] === rowIndex &&
                selectedCell[1] === colIndex;

              return (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  hasQueen={hasQueen}
                  row={rowIndex}
                  col={colIndex}
                  isSelected={isSelected}
                  isConflict={isConflict}
                  gameCompleted={gameCompleted}
                  onClick={onCellClick}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
