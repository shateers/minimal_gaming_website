
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import GameCard from "../components/layout/GameCard";
import FadeIn from "../components/animations/FadeIn";

const Index = () => {
  useEffect(() => {
    document.title = "Shateer Games - Minimalist Gaming Experience";
  }, []);

  const gameCategories = [
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
          description: "Place crowns on a grid, ensuring no two crowns share the same row, column, or designated region.",
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
        {
          title: "Dino Run",
          description: "Chrome's offline dinosaur jumping game.",
          href: "/games/coming-soon/dino-run",
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10">
        <section className="max-w-7xl mx-auto pb-20">
          <div className="text-center mb-16">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Minimalist Gaming Experience
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Enjoy classic games with a clean, distraction-free design. 
                No ads, no clutter—just pure gameplay.
              </p>
            </FadeIn>
          </div>

          {gameCategories.map((category, categoryIndex) => (
            <div key={category.name} className="mb-16">
              <FadeIn delay={0.1 * categoryIndex}>
                <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-border">
                  {category.name}
                </h2>
              </FadeIn>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {category.games.map((game, index) => (
                  <GameCard
                    key={game.title}
                    title={game.title}
                    description={game.description}
                    href={game.href}
                    imageSrc={game.imageSrc}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="max-w-7xl mx-auto py-16 border-t border-border">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              Why Choose Shateer Games?
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="p-6 rounded-2xl bg-white border border-border">
                <h3 className="text-xl font-semibold mb-3">Distraction-Free</h3>
                <p className="text-muted-foreground">
                  Clean interface with no ads, pop-ups, or unnecessary elements to distract from your gameplay.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="p-6 rounded-2xl bg-white border border-border">
                <h3 className="text-xl font-semibold mb-3">Responsive Design</h3>
                <p className="text-muted-foreground">
                  Enjoy your favorite games on any device with our fully responsive design.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div className="p-6 rounded-2xl bg-white border border-border">
                <h3 className="text-xl font-semibold mb-3">Optimized Performance</h3>
                <p className="text-muted-foreground">
                  Lightning-fast loading times and smooth gameplay for the best gaming experience.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
