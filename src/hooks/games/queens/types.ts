
export type CellValue = boolean;
export type Board = CellValue[][];
export type Position = [number, number];
export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  size: number;
}

export interface QueensGameState {
  board: Board;
  selectedCell: Position | null;
  conflicts: Position[];
  gameCompleted: boolean;
  timer: number;
  moves: number;
  queensPlaced: number;
  difficulty: Difficulty;
}
