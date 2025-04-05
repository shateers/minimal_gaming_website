
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Bone } from "lucide-react";

const DinoRun = () => {
  useEffect(() => {
    document.title = "Dino Run - Shateer Games";
    
    // Prevent arrow key scrolling
    const preventArrowScroll = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener("keydown", preventArrowScroll);
    return () => {
      window.removeEventListener("keydown", preventArrowScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container max-w-5xl mx-auto pt-24 px-4 pb-16">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Bone className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Dino Run</h1>
          </div>
          <p className="text-muted-foreground">
            Help the dinosaur jump over cacti and avoid obstacles in this popular Chrome offline game.
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
          <div className="w-full max-w-3xl aspect-[4/3] overflow-hidden">
            <iframe
              src="https://chromedino.com/embed/"
              title="Chrome Dino Run"
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
            Chrome Dino Run is a simple endless runner game originally built into the Chrome browser for when you have no internet connection.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Press <span className="font-medium">Space</span> or <span className="font-medium">Up Arrow</span> to jump over cacti</li>
            <li>Press <span className="font-medium">Down Arrow</span> to duck under flying pterodactyls</li>
            <li>The game speeds up as your score increases</li>
            <li>Avoid all obstacles to achieve the highest score!</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DinoRun;
