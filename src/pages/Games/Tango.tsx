
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TangoBoard from "../../components/games/tango/TangoBoard";
import TangoControls from "../../components/games/tango/TangoControls";
import GameStats from "../../components/games/tango/GameStats";
import TangoRules from "../../components/games/tango/TangoRules";
import { useTangoGame } from "../../hooks/games/tango/useTangoGame";

const Tango = () => {
  const {
    board,
    difficulty,
    gameCompleted,
    selectedCell,
    timer,
    moves,
    handleCellClick,
    resetGame,
    handleDifficultyChange,
    formatTime,
    provideHint
  } = useTangoGame();

  useEffect(() => {
    document.title = "Tango - GameHub";
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
            <h1 className="text-3xl font-bold">Tango</h1>
            <p className="text-muted-foreground mt-2">
              Fill the grid with 0s and 1s. Each row and column must have an equal number of each digit, 
              and no more than two identical digits can be adjacent.
            </p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <GameStats timer={timer} moves={moves} formatTime={formatTime} />
            
            <Tabs defaultValue={difficulty} onValueChange={handleDifficultyChange}>
              <TabsList>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {gameCompleted && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
              <p className="text-lg font-medium">Congratulations! You've completed the puzzle!</p>
              <p>Time: {formatTime(timer)} | Moves: {moves}</p>
            </div>
          )}
          
          <TangoBoard 
            board={board}
            gameCompleted={gameCompleted}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          
          <TangoControls 
            gameCompleted={gameCompleted}
            onResetGame={resetGame}
            onHint={provideHint}
          />
          
          <TangoRules />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tango;
