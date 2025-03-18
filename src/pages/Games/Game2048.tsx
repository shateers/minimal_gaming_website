
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Board from "../../components/games/2048/Board";
import Controls from "../../components/games/2048/Controls";
import Instructions from "../../components/games/2048/Instructions";
import use2048Game from "../../hooks/games/2048/use2048Game";
import { toast } from "@/components/ui/use-toast";

const Game2048 = () => {
  const {
    board,
    score,
    bestScore,
    gameOver,
    isWinner,
    handleKeyDown,
    handleSwipe,
    resetGame,
  } = use2048Game();

  // Set up event listeners for keyboard controls
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    document.title = "2048 - Shateer Games";
  }, []);

  useEffect(() => {
    if (gameOver) {
      toast({
        title: "Game Over!",
        description: `Your final score: ${score}`,
        variant: "destructive"
      });
    } else if (isWinner) {
      toast({
        title: "You Won!",
        description: `Congratulations! You reached 2048! Keep playing to reach higher scores.`,
        variant: "default"
      });
    }
  }, [gameOver, isWinner, score]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl font-bold">2048</h1>
            <p className="text-muted-foreground mt-2">
              Slide and merge identical tiles to create a tile with the number 2048.
            </p>
          </div>
          
          <Controls
            score={score}
            bestScore={bestScore}
            gameOver={gameOver}
            onReset={resetGame}
          />
          
          <Board
            board={board}
            onSwipe={handleSwipe}
          />
          
          <Instructions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Game2048;
