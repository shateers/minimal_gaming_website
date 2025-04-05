
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Bird } from "lucide-react";

const FlappyBird = () => {
  useEffect(() => {
    document.title = "Flappy Bird - Shateer Games";
    
    // Prevent arrow key and space scrolling
    const preventDefaultScroll = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener("keydown", preventDefaultScroll);
    return () => {
      window.removeEventListener("keydown", preventDefaultScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-5xl mx-auto pt-24 px-4 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Bird className="h-8 w-8 text-yellow-500" />
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
        
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex justify-center">
          <div className="w-full max-w-md aspect-[1/1.5] overflow-hidden">
            <iframe
              src="https://flappybird.io/embed"
              title="Flappy Bird"
              className="w-full h-full border-0"
              allowFullScreen
              allow="fullscreen"
              sandbox="allow-same-origin allow-scripts"
            ></iframe>
          </div>
        </div>
        
        <div className="mt-8 bg-secondary/30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Play</h2>
          <p className="mb-3">
            Flappy Bird is a side-scrolling game where you control a bird, attempting to fly between green pipes without hitting them.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click, tap, or press <span className="font-medium">Space</span> to make the bird flap its wings and gain height</li>
            <li>Carefully time your flaps to navigate through the gaps between pipes</li>
            <li>Each successful pipe passage awards one point</li>
            <li>The game ends if you hit a pipe or the ground</li>
            <li>Try to beat your high score with each attempt!</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlappyBird;
