
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import RockPaperScissorsGame from "../../components/games/rock-paper-scissors/RockPaperScissorsGame";
import Instructions from "../../components/games/rock-paper-scissors/Instructions";
import GameControls from "../../components/games/rock-paper-scissors/GameControls";
import FadeIn from "@/components/animations/FadeIn";

const RockPaperScissors = () => {
  useEffect(() => {
    document.title = "Rock Paper Scissors - Shateer Games";
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
                <h1 className="text-3xl md:text-4xl font-bold">Rock Paper Scissors</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Classic hand-gesture game of chance and strategy
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <RockPaperScissorsGame />
                </div>
              </FadeIn>
            </div>
            
            <div className="space-y-6">
              <FadeIn delay={0.2}>
                <GameControls />
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

export default RockPaperScissors;
