
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WordDisplay from "../../components/games/pinpoint/WordDisplay";
import GuessForm from "../../components/games/pinpoint/GuessForm";
import StatusInfo from "../../components/games/pinpoint/StatusInfo";
import GameComplete from "../../components/games/pinpoint/GameComplete";
import HintDisplay from "../../components/games/pinpoint/HintDisplay";
import GameRules from "../../components/games/pinpoint/GameRules";
import { usePinpointGame } from "../../hooks/games/pinpoint/usePinpointGame";

const Pinpoint = () => {
  const {
    difficulty,
    currentWordSet,
    revealedWords,
    feedback,
    timer,
    score,
    round,
    maxRounds,
    gameCompleted,
    hintUsed,
    setDifficulty,
    startGame,
    handleGuessSubmit,
    handleGetHint,
    formatTime
  } = usePinpointGame();

  useEffect(() => {
    document.title = "Pinpoint - GameHub";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl font-bold">Pinpoint</h1>
            <p className="text-muted-foreground mt-2">
              Guess the category based on the revealed words. The fewer words you need, the more points you earn!
            </p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Score: {score}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Round: {round}/{maxRounds}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
              <TabsList>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {gameCompleted ? (
            <GameComplete 
              score={score}
              formatTime={formatTime}
              timer={timer}
              onPlayAgain={startGame}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              {currentWordSet && (
                <WordDisplay 
                  words={currentWordSet.words}
                  revealedWords={revealedWords}
                />
              )}
              
              <GuessForm 
                onGuessSubmit={handleGuessSubmit}
                feedback={feedback}
                onGetHint={handleGetHint}
                hintUsed={hintUsed}
              />
              
              {currentWordSet && hintUsed && (
                <HintDisplay 
                  categoryFirstLetter={currentWordSet.category.charAt(0).toUpperCase()}
                  hintUsed={hintUsed}
                />
              )}
              
              <StatusInfo 
                revealedWords={revealedWords}
                hintUsed={hintUsed}
              />
            </div>
          )}
          
          <GameRules />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pinpoint;
