
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useFlappyBirdGame } from "@/hooks/games/flappy-bird/useFlappyBirdGame";
import GameCanvas from "@/components/games/flappy-bird/GameCanvas";
import GameControls from "@/components/games/flappy-bird/GameControls";
import GameStats from "@/components/games/flappy-bird/GameStats";
import Instructions from "@/components/games/flappy-bird/Instructions";

const FlappyBird = () => {
  const {
    gameState,
    score,
    highScore,
    startGame,
    restartGame,
    jumpBird,
    updateScore,
    handleGameOver
  } = useFlappyBirdGame();

  useEffect(() => {
    document.title = "Flappy Bird - Shateer Games";
    
    // Prevent arrow key and space scrolling
    const preventDefaultScroll = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      // Make bird jump when space is pressed
      if (e.key === " ") {
        jumpBird();
      }
    };
    
    window.addEventListener("keydown", preventDefaultScroll);
    return () => {
      window.removeEventListener("keydown", preventDefaultScroll);
    };
  }, [jumpBird]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-5xl mx-auto pt-24 px-4 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Flappy Bird</h1>
          </div>
          <p className="text-muted-foreground">
            Navigate a bird through gaps between pipes by tapping or using the spacebar to keep it airborne.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="mr-2">←</span> Back to games
          </Link>
        </div>
        
        <GameStats 
          score={score}
          highScore={highScore}
          gameState={gameState}
        />
        
        <GameControls
          gameState={gameState}
          onStart={startGame}
          onRestart={restartGame}
          onJump={jumpBird}
        />
        
        <GameCanvas
          gameState={gameState}
          score={score}
          onJump={jumpBird}
          onGameOver={handleGameOver}
        />
        
        <Instructions />
      </main>
      
      <Footer />
    </div>
  );
};

export default FlappyBird;
