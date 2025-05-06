
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const DoodleJump = () => {
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
          
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md aspect-[1/1.5] overflow-hidden rounded-lg shadow-lg">

<iframe src="https://shateers.github.io/doodlejump/"
            
                title="Doodle Jump"
                className="w-full h-full border-0"
                allowFullScreen
                allow="fullscreen"
                sandbox="allow-same-origin allow-scripts"
              ></iframe>
            </div>
          </div>
          
          <div className="bg-secondary/30 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">How to Play</h2>
            <div className="space-y-4">
              <p>
                In Doodle Jump, you control a cute character that automatically jumps upward. Your goal is to climb as high as possible without falling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Keyboard Controls:</h3>
                  <ul className="space-y-2">
                    <li><span className="font-medium">Left Arrow or A:</span> Move left</li>
                    <li><span className="font-medium">Right Arrow or D:</span> Move right</li>
                    <li><span className="font-medium">Spacebar:</span> Shoot (if available)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Game Features:</h3>
                  <ul className="space-y-2">
                    <li>Various platform types (regular, moving, breaking)</li>
                    <li>Powerups: Jetpacks, springs, propeller hats</li>
                    <li>Monsters that you need to avoid or shoot</li>
                    <li>Your score increases as you climb higher</li>
                  </ul>
                </div>
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
