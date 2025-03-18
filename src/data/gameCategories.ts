export interface Game {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
}

export interface GameCategory {
  name: string;
  games: Game[];
}

export const gameCategories: GameCategory[] = [
  {
    name: "Featured Games",
    games: [
      {
        title: "Tic Tac Toe",
        description: "The classic game of X's and O's. Challenge yourself against the computer or play with a friend.",
        href: "/games/tic-tac-toe",
        imageSrc: "/lovable-uploads/ce7a53b3-af16-4698-8ed6-6aab727211fa.png"
      },
      {
        title: "Snake",
        description: "Guide the snake to eat apples while avoiding collisions in this nostalgic arcade classic.",
        href: "/games/snake",
        imageSrc: "/lovable-uploads/633b3b67-8267-4ec4-8b7a-575812735173.png"
      },
      {
        title: "Sudoku",
        description: "Test your logical thinking with this number placement puzzle. Multiple difficulty levels available.",
        href: "/games/sudoku",
        imageSrc: "/lovable-uploads/b785a40d-143f-411a-9a4b-a80d01eb7ba9.png"
      },
      {
        title: "Tetris",
        description: "Arrange falling blocks to create and clear complete lines in this timeless puzzle game.",
        href: "/games/tetris",
        imageSrc: "/lovable-uploads/513aa719-37f2-4421-a76d-127c35d8dd78.png"
      },
      {
        title: "Crossword",
        description: "Challenge your vocabulary and knowledge with crossword puzzles of varying difficulty.",
        href: "/games/crossword",
        imageSrc: "/lovable-uploads/067daa72-76de-46ae-9784-4b47edab41c4.png"
      },
      {
        title: "Jigsaw Puzzle",
        description: "Piece together beautiful images in this relaxing jigsaw puzzle game with multiple difficulty options.",
        href: "/games/jigsaw",
        imageSrc: "/lovable-uploads/a5fd6b5d-44d1-4d31-92ee-3d48d00e55e2.png"
      },
      {
        title: "Tango",
        description: "Fill a grid with two symbols, ensuring each row and column has an equal number without more than two identical symbols adjacent.",
        href: "/games/tango",
      },
      {
        title: "Queens",
        description: "Place queens on a grid, ensuring no two queens can attack each other.",
        href: "/games/queens",
      },
      {
        title: "Crossclimb",
        description: "Unlock a series of trivia questions, progressing through levels as you answer correctly.",
        href: "/games/crossclimb",
      },
      {
        title: "Pinpoint",
        description: "Guess the category based on provided clues, testing your ability to identify connections between words.",
        href: "/games/pinpoint",
      },
      {
        title: "2048",
        description: "Slide and merge tiles to reach the elusive 2048 tile in this addictive mathematical puzzle game.",
        href: "/games/2048",
        imageSrc: "/lovable-uploads/39d7fb8e-e6ac-44ad-be50-f34ca8ec1217.png"
      },
      {
        title: "Dino Run",
        description: "Help the dinosaur jump over cacti and avoid obstacles in this popular Chrome offline game.",
        href: "/games/dino-run",
      },
    ]
  },
  {
    name: "Classic & Retro-Style Games",
    games: [
      {
        title: "2048",
        description: "A sliding tile puzzle game where players combine numbers to reach the 2048 tile.",
        href: "/games/coming-soon/2048",
      },
      {
        title: "Minesweeper",
        description: "A logic-based game where players uncover squares on a grid, avoiding hidden mines.",
        href: "/games/coming-soon/minesweeper",
      },
      {
        title: "Flappy Bird",
        description: "Navigate a bird through gaps between pipes by tapping the screen to keep it airborne.",
        href: "/games/coming-soon/flappy-bird",
      },
      {
        title: "Breakout",
        description: "Control a paddle to bounce a ball and break bricks at the top of the screen.",
        href: "/games/coming-soon/breakout",
      },
      {
        title: "Pong",
        description: "A classic table tennis simulation where players control paddles to hit a ball back and forth.",
        href: "/games/coming-soon/pong",
      },
    ]
  },
  {
    name: "Board & Puzzle Games",
    games: [
      {
        title: "Connect Four",
        description: "Drop pieces to connect four in a row.",
        href: "/games/coming-soon/connect-four",
      },
      {
        title: "Memory Match",
        description: "Flip cards to match pairs.",
        href: "/games/coming-soon/memory-match",
      },
      {
        title: "Ludo",
        description: "Multiplayer dice board game.",
        href: "/games/coming-soon/ludo",
      },
      {
        title: "Checkers",
        description: "Simple strategy board game.",
        href: "/games/coming-soon/checkers",
      },
      {
        title: "Reversi",
        description: "Flip opponent's pieces by surrounding them.",
        href: "/games/coming-soon/reversi",
      },
      {
        title: "Rock Paper Scissors",
        description: "Classic hand-gesture game.",
        href: "/games/coming-soon/rock-paper-scissors",
      },
      {
        title: "Dots and Boxes",
        description: "Draw lines to complete boxes.",
        href: "/games/coming-soon/dots-and-boxes",
      },
    ]
  },
  {
    name: "Physics-Based & Interactive Games",
    games: [
      {
        title: "Bubble Shooter",
        description: "Match and pop colored bubbles.",
        href: "/games/coming-soon/bubble-shooter",
      },
      {
        title: "Cut the Rope",
        description: "Cut ropes to feed candy to a character.",
        href: "/games/coming-soon/cut-the-rope",
      },
      {
        title: "Doodle Jump",
        description: "Keep jumping upwards without falling.",
        href: "/games/coming-soon/doodle-jump",
      },
      {
        title: "Stacker",
        description: "Stack blocks perfectly on top of each other.",
        href: "/games/coming-soon/stacker",
      },
    ]
  },
];
