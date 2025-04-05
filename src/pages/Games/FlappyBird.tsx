
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import GameCanvas from "../../components/games/flappy-bird/GameCanvas";
import GameStats from "../../components/games/flappy-bird/GameStats";
import GameControls from "../../components/games/flappy-bird/GameControls";
import Instructions from "../../components/games/flappy-bird/Instructions";
import { useFlappyBirdGame } from "../../hooks/games/flappy-bird/useFlappyBirdGame";

const FlappyBird = () => {
  const {
    gameState,
    score,
    highScore,
    startGame,
    restartGame,
    jumpBird,
    handleGameOver
  } = useFlappyBirdGame();

  useEffect(() => {
    document.title = "Flappy Bird - Shateer Games";
  }, []);

  // Add event listener for key press (spacebar) with preventDefault
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp") {
        e.preventDefault(); // Prevent default scrolling
        if (gameState === "waiting") {
          startGame();
        } else if (gameState === "playing") {
          jumpBird();
        } else if (gameState === "gameover") {
          restartGame();
        }
      }
    };

    // Prevent arrow key scrolling
    const preventArrowScroll = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", preventArrowScroll);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", preventArrowScroll);
    };
  }, [gameState, startGame, jumpBird, restartGame]);

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
            <h1 className="text-3xl font-bold">Flappy Bird</h1>
            <p className="text-muted-foreground mt-2">
              Navigate a bird through gaps between pipes by tapping or using the spacebar to keep it airborne.
            </p>
          </div>
          
          <GameStats score={score} highScore={highScore} />
          
          <GameCanvas 
            gameState={gameState}
            score={score}
            onJump={jumpBird}
            onGameOver={handleGameOver}
          />
          
          <GameControls 
            gameState={gameState}
            onStart={startGame}
            onRestart={restartGame}
            onJump={jumpBird}
          />
          
          <Instructions />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlappyBird;
