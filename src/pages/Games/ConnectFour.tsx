
import { useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FadeIn from "../../components/animations/FadeIn";
import ConnectFourGame from "../../components/games/connect-four/ConnectFourGame";
import Instructions from "../../components/games/connect-four/Instructions";
import GameControls from "../../components/games/connect-four/GameControls";

const ConnectFour = () => {
  useEffect(() => {
    document.title = "Connect Four - Shateer Games";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Connect Four
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Connect four of your pieces in a row to win!
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8">
              <ConnectFourGame />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.2}>
              <Instructions />
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <GameControls />
            </FadeIn>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConnectFour;
