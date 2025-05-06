
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import MemoryMatchGame from "../../components/games/memory-match/MemoryMatchGame";
import Instructions from "../../components/games/memory-match/Instructions";
import GameControls from "../../components/games/memory-match/GameControls";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/animations/FadeIn";

const MemoryMatch = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  useEffect(() => {
    document.title = "Memory Match - Shateer Games";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <Link 
                  to="/" 
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
                >
                  <span className="mr-2">←</span> Back to games
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold">Memory Match</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Test your memory by matching pairs of cards
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <MemoryMatchGame soundEnabled={soundEnabled} />
                </div>
              </FadeIn>
            </div>
            
            <div className="space-y-6">
              <FadeIn delay={0.2}>
                <GameControls onSoundToggle={setSoundEnabled} />
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <Instructions />
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MemoryMatch;
