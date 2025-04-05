
import { useEffect } from "react";
import { useCutTheRopeGame } from "@/hooks/games/cut-the-rope/useCutTheRopeGame";
import GameCanvas from "@/components/games/cut-the-rope/GameCanvas";
import GameControls from "@/components/games/cut-the-rope/GameControls";
import Instructions from "@/components/games/cut-the-rope/Instructions";
import GameStats from "@/components/games/cut-the-rope/GameStats";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

const CutTheRope = () => {
  const { canvasRef, gameState, startGame, resetLevel, nextLevel } = useCutTheRopeGame();
  
  useEffect(() => {
    document.title = "Cut the Rope - Shateer Games";
    
    // Prevent scrolling with arrow keys, space, etc. which can interfere with gameplay
    const preventScroll = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener("keydown", preventScroll);
    return () => window.removeEventListener("keydown", preventScroll);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-5xl mx-auto pt-24 px-4 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Scissors className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">Cut the Rope</h1>
          </div>
          <p className="text-muted-foreground">
            Cut the ropes strategically to feed candy to the hungry monster!
          </p>
        </div>
        
        <div className="mb-6">
          <GameStats gameState={gameState} />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="mb-6">
            <GameCanvas canvasRef={canvasRef} />
          </div>
          
          <GameControls
            gameState={gameState}
            onStart={startGame}
            onReset={resetLevel}
            onNextLevel={nextLevel}
          />
          
          <div className="mt-8">
            <Instructions />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CutTheRope;
