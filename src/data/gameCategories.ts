
import { GameCategory } from "./gameTypes";
import { featuredGames } from "./games/featured";
import { classicGames } from "./games/classic";
import { boardAndPuzzleGames } from "./games/boardAndPuzzle";
import { physicsGames } from "./games/physics";

export const gameCategories: GameCategory[] = [
  {
    name: "Featured Games",
    games: featuredGames
  },
  {
    name: "Classic & Retro-Style Games",
    games: classicGames
  },
  {
    name: "Board & Puzzle Games",
    games: boardAndPuzzleGames
  },
  {
    name: "Physics-Based & Interactive Games",
    games: physicsGames
  },
];

// Re-export the game types for convenience
export * from "./gameTypes";
