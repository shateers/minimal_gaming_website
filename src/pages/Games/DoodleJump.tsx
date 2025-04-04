
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GameCanvas from '@/components/games/doodle-jump/GameCanvas';
import GameControls from '@/components/games/doodle-jump/GameControls';
import Instructions from '@/components/games/doodle-jump/Instructions';
import useDoodleJumpGame from '@/hooks/games/doodle-jump/useDoodleJumpGame';

const DoodleJump = () => {
  const {
    canvasRef,
    gameState,
    startGame,
  } = useDoodleJumpGame();

  useEffect(() => {
    document.title = "Doodle Jump - Shateer Games";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">
              Doodle Jump
            </h1>
            <p className="text-muted-foreground mt-2">
              Guide a cute character upward by jumping from platform to platform without falling.
            </p>
          </div>
          
          <GameControls 
            gameState={gameState}
            onStart={startGame}
          />
          
          <div className="flex justify-center mb-8">
            <GameCanvas ref={canvasRef} width={400} height={600} />
          </div>
          
          <Instructions />
          
          <div className="bg-secondary/30 p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Keyboard Controls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Left Arrow or A:</span> Move left</p>
                <p><span className="font-medium">Right Arrow or D:</span> Move right</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoodleJump;
