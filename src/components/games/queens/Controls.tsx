
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Difficulty = "easy" | "medium" | "hard";

type ControlsProps = {
  timer: number;
  queensPlaced: number;
  boardSize: number;
  moves: number;
  difficulty: Difficulty;
  gameCompleted: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onReset: () => void;
  onHint: () => void;
};

const Controls = ({
  timer,
  queensPlaced,
  boardSize,
  moves,
  difficulty,
  gameCompleted,
  onDifficultyChange,
  onReset,
  onHint,
}: ControlsProps) => {
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <div className="bg-secondary/30 px-4 py-2 rounded-lg">
            <div className="text-lg font-medium">
              Time: {formatTime(timer)}
            </div>
          </div>

          <div className="bg-secondary/30 px-4 py-2 rounded-lg">
            <div className="text-lg font-medium">
              Queens: {queensPlaced}/{boardSize}
            </div>
          </div>

          <div className="bg-secondary/30 px-4 py-2 rounded-lg">
            <div className="text-lg font-medium">Moves: {moves}</div>
          </div>
        </div>

        <Tabs 
          defaultValue={difficulty} 
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
        >
          <TabsList>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {gameCompleted && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
          <p className="text-lg font-medium">
            Congratulations! You've solved the Queens puzzle!
          </p>
          <p>
            Time: {formatTime(timer)} | Moves: {moves}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
        >
          {gameCompleted ? "New Game" : "Reset Game"}
        </button>

        <button
          onClick={onHint}
          disabled={gameCompleted}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hint
        </button>
      </div>
    </>
  );
};

export default Controls;
