
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FadeIn from "../../components/animations/FadeIn";

// Map of games with available iframe embeds
const gameEmbeds: Record<string, {
  src: string,
  title: string,
  description: string,
  aspectRatio: string, // CSS for aspect ratio
  instructions: React.ReactNode
}> = {
  "2048": {
    src: "https://play2048.co/",
    title: "2048",
    description: "Combine the numbers to reach the elusive 2048 tile!",
    aspectRatio: "aspect-square", // 1:1
    instructions: (
      <>
        <p className="mb-2">Use arrow keys to move the tiles:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>When two tiles with the same number touch, they merge!</li>
          <li>Create a tile with the number 2048 to win</li>
        </ul>
      </>
    )
  },
  "pong": {
    src: "https://www.classicgamesarcade.com/game/21736/ping-pong-game.html",
    title: "Pong",
    description: "The classic table tennis simulation game!",
    aspectRatio: "aspect-[4/3]", // 4:3
    instructions: (
      <>
        <p className="mb-2">Control your paddle:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use the mouse or up/down arrow keys to move your paddle</li>
          <li>Don't let the ball pass your paddle!</li>
        </ul>
      </>
    )
  },
  "connect-four": {
    src: "https://www.mathsisfun.com/games/connect4.html",
    title: "Connect Four",
    description: "Connect four of your pieces in a row to win!",
    aspectRatio: "aspect-[4/3]", // 4:3
    instructions: (
      <>
        <p className="mb-2">How to play:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on a column to drop your piece</li>
          <li>Connect four pieces horizontally, vertically, or diagonally to win</li>
        </ul>
      </>
    )
  },
  "memory-match": {
    src: "https://www.memozor.com/memory-games/for-adults/objects",
    title: "Memory Match",
    description: "Test your memory by matching pairs of cards!",
    aspectRatio: "aspect-[4/3]", // 4:3
    instructions: (
      <>
        <p className="mb-2">Game rules:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on cards to flip them over</li>
          <li>Try to find matching pairs</li>
          <li>Remember card positions to minimize moves</li>
        </ul>
      </>
    )
  },
  "bubble-shooter": {
    src: "https://www.bubbleshooter.net/embed/bubble-shooter-classic/",
    title: "Bubble Shooter",
    description: "Aim and shoot bubbles to create groups of three or more!",
    aspectRatio: "aspect-[4/3]", // 4:3
    instructions: (
      <>
        <p className="mb-2">Game controls:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Aim with your mouse</li>
          <li>Click to shoot bubbles</li>
          <li>Match 3+ bubbles of the same color to pop them</li>
        </ul>
      </>
    )
  },
  "stacker": {
    src: "https://www.crazygames.com/embed/stack",
    title: "Stacker",
    description: "Test your timing and stack blocks as high as possible!",
    aspectRatio: "aspect-[4/3]", // 4:3
    instructions: (
      <>
        <p className="mb-2">How to play:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click/tap to place the moving block</li>
          <li>Try to align blocks perfectly for a higher score</li>
          <li>Misaligned parts will fall off, making your tower narrower</li>
        </ul>
      </>
    )
  }
};

const ComingSoon = () => {
  const { gameName } = useParams();
  const formattedGameName = gameName 
    ? gameName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "This Game";

  const gameEmbed = gameName ? gameEmbeds[gameName] : null;

  useEffect(() => {
    document.title = `${formattedGameName} - Shateer Games`;
  }, [formattedGameName]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <FadeIn>
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {formattedGameName}
            </h1>
          </FadeIn>
          
          {gameEmbed ? (
            // If we have an embed for this game
            <FadeIn delay={0.1}>
              <div className="mb-8">
                <p className="text-lg text-muted-foreground mb-6">
                  {gameEmbed.description}
                </p>
                
                <div className="bg-white rounded-xl shadow-md p-4 md:p-6 flex justify-center mb-8">
                  <div className={`w-full max-w-4xl ${gameEmbed.aspectRatio} overflow-hidden`}>
                    <iframe
                      src={gameEmbed.src}
                      title={gameEmbed.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                      allow="fullscreen"
                      sandbox="allow-same-origin allow-scripts"
                    ></iframe>
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-6 rounded-lg text-left">
                  <h2 className="text-xl font-semibold mb-4">How to Play</h2>
                  {gameEmbed.instructions}
                </div>
              </div>
            </FadeIn>
          ) : (
            // Default "Coming Soon" display if no embed is available
            <FadeIn delay={0.1}>
              <div className="mb-8 p-12 rounded-2xl bg-white border border-border">
                <div className="text-6xl mb-6">🎮</div>
                <p className="text-lg text-muted-foreground mb-6">
                  We're working hard to bring you this exciting game soon. 
                  Stay tuned for updates!
                </p>
              </div>
            </FadeIn>
          )}
          
          <FadeIn delay={0.2}>
            <div className="text-muted-foreground text-sm">
              Want to get notified when this game launches? Sign up for our newsletter!
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
