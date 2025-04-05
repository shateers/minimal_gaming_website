
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

const CutTheRope = () => {
  useEffect(() => {
    document.title = "Cut the Rope - Shateer Games";
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
              src="https://www.gameflare.com/embed/cut-the-rope/"
              title="Cut the Rope"
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
            Cut the Rope is a puzzle game where your goal is to feed candy to the adorable monster named Om Nom.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click or tap on the ropes to cut them and release the candy</li>
            <li>Time your cuts carefully to navigate the candy into Om Nom's mouth</li>
            <li>Collect stars along the way for bonus points</li>
            <li>Use bubbles, air cushions, and other elements to complete each level</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CutTheRope;
