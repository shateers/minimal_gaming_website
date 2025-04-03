
import { useEffect } from 'react';
import { useBreakoutGame } from '@/hooks/games/breakout/useBreakoutGame';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GameCanvas from '@/components/games/breakout/GameCanvas';
import GameControls from '@/components/games/breakout/GameControls';
import Instructions from '@/components/games/breakout/Instructions';

const Breakout = () => {
  const { 
    canvasRef, 
    gameState, 
    resetGame,
    toggleGame,
  } = useBreakoutGame();

  useEffect(() => {
    document.title = "Breakout - Shateer Games";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Breakout
          </h1>
          
          <div className="mb-6 flex justify-center">
            <Instructions />
          </div>
          
          <GameControls 
            gameState={gameState}
            onReset={resetGame}
            onTogglePause={toggleGame}
          />
          
          <div className="flex justify-center mb-8">
            <GameCanvas ref={canvasRef} width={800} height={600} />
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Keyboard Controls</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Left Arrow:</span> Move paddle left</p>
                <p><span className="font-medium">Right Arrow:</span> Move paddle right</p>
              </div>
              <div>
                <p><span className="font-medium">Space/Enter:</span> Start/Pause game</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Breakout;
