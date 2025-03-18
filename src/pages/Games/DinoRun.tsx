
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import DinoGame from "../../components/games/dino-run/DinoGame";
import Controls from "../../components/games/dino-run/Controls";
import Instructions from "../../components/games/dino-run/Instructions";
import useDinoGame from "../../hooks/games/dino-run/useDinoGame";

const DinoRun = () => {
  const {
    score,
    bestScore,
    gameOver,
    handleScoreUpdate,
    handleGameOver,
    resetGame
  } = useDinoGame();

  useEffect(() => {
    document.title = "Dino Run - Shateer Games";
  }, []);

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
            <h1 className="text-3xl font-bold">Dino Run</h1>
            <p className="text-muted-foreground mt-2">
              Help the dinosaur jump over cacti and avoid obstacles in this popular Chrome offline game.
            </p>
          </div>
          
          <Controls
            score={score}
            bestScore={bestScore}
            gameOver={gameOver}
            onReset={resetGame}
          />
          
          <DinoGame
            onScoreUpdate={handleScoreUpdate}
            onGameOver={handleGameOver}
          />
          
          <Instructions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DinoRun;
