import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Board from "../../components/games/queens/Board";
import Controls from "../../components/games/queens/Controls";
import Instructions from "../../components/games/queens/Instructions";
import useQueensGame from "../../hooks/games/queens/useQueensGame";

const Queens = () => {
  const {
    board,
    selectedCell,
    conflicts,
    gameCompleted,
    timer,
    moves,
    queensPlaced,
    difficulty,
    boardSize,
    handleCellClick,
    getHint,
    handleDifficultyChange,
    initializeBoard,
  } = useQueensGame();

  useEffect(() => {
    document.title = "Queens - GameHub";
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
            <h1 className="text-3xl font-bold">Queens</h1>
            <p className="text-muted-foreground mt-2">
              Place {boardSize} queens on the board so that no two queens can attack each other.
            </p>
          </div>
          
          <Controls
            timer={timer}
            queensPlaced={queensPlaced}
            boardSize={boardSize}
            moves={moves}
            difficulty={difficulty}
            gameCompleted={gameCompleted}
            onDifficultyChange={handleDifficultyChange}
            onReset={initializeBoard}
            onHint={getHint}
          />
          
          <Board
            board={board}
            selectedCell={selectedCell}
            conflicts={conflicts}
            gameCompleted={gameCompleted}
            onCellClick={handleCellClick}
          />
          
          <Instructions boardSize={boardSize} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Queens;
