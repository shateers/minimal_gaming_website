
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import MemoryMatchGame from "../../components/games/memory-match/MemoryMatchGame";

const MemoryMatch = () => {
  useEffect(() => {
    document.title = "Memory Match - GameHub";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-10 pb-16 bg-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl font-bold">Memory Match</h1>
            <p className="text-muted-foreground mt-2">
              Test your memory by matching pairs of cards. Find all pairs before time runs out!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <MemoryMatchGame />
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Flip cards by clicking on them to find matching pairs.</li>
              <li>Only two cards can be flipped at a time.</li>
              <li>When two cards match, they stay face up.</li>
              <li>Match all cards before time runs out to win.</li>
              <li>Earn points for matches and bonus points for fast completion.</li>
              <li>Select a difficulty level to adjust the challenge.</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h3 className="font-semibold mb-1">Scoring System</h3>
              <ul className="list-disc pl-5">
                <li>+10 points for each matched pair</li>
                <li>-1 point for each incorrect match</li>
                <li>Time bonus: 0.5 points for each second remaining</li>
                <li>Move bonus: 2 points for each move under 30</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemoryMatch;
