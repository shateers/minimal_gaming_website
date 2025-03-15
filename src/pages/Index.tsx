
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import GameCard from "../components/layout/GameCard";
import FadeIn from "../components/animations/FadeIn";

const Index = () => {
  useEffect(() => {
    document.title = "GameHub - Minimalist Gaming Experience";
  }, []);

  const games = [
    {
      title: "Tic Tac Toe",
      description: "The classic game of X's and O's. Challenge yourself against the computer or play with a friend.",
      href: "/games/tic-tac-toe",
      imageSrc: "/lovable-uploads/9c2e48ad-a8fd-4c84-bf60-a9fe9449d30d.png"
    },
    {
      title: "Snake",
      description: "Guide the snake to eat apples while avoiding collisions in this nostalgic arcade classic.",
      href: "/games/snake",
      imageSrc: "/lovable-uploads/d83c2233-cde9-49cf-b688-fefbd8e99648.png"
    },
    {
      title: "Sudoku",
      description: "Test your logical thinking with this number placement puzzle. Multiple difficulty levels available.",
      href: "/games/sudoku",
      imageSrc: "/lovable-uploads/9c9720ef-62b5-49af-8948-9b687ae20394.png"
    },
    {
      title: "Tetris",
      description: "Arrange falling blocks to create and clear complete lines in this timeless puzzle game.",
      href: "/games/tetris",
    },
    {
      title: "Crossword",
      description: "Challenge your vocabulary and knowledge with crossword puzzles of varying difficulty.",
      href: "/games/crossword",
    },
    {
      title: "Jigsaw Puzzle",
      description: "Piece together beautiful images in this relaxing jigsaw puzzle game with multiple difficulty options.",
      href: "/games/jigsaw",
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {games.map((game, index) => (
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
        </section>

        <section className="max-w-7xl mx-auto py-16 border-t border-border">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              Why Choose GameHub?
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
