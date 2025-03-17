
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import GameBoard from "../../components/games/tic-tac-toe/GameBoard";
import GameControls from "../../components/games/tic-tac-toe/GameControls";
import GameStats from "../../components/games/tic-tac-toe/GameStats";
import { useTicTacToeGame } from "../../components/games/tic-tac-toe/useTicTacToeGame";

const TicTacToe = () => {
  const {
    board,
    isXNext,
    gameStatus,
    winner,
    timer,
    moves,
    handleClick,
    handleReset,
    handlePauseResume
  } = useTicTacToeGame();

  useEffect(() => {
    document.title = "Tic Tac Toe - GameHub";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="game-container animate-fade-in">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
              <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
            </div>

            <GameStats timer={timer} moves={moves} />
          </div>

          <GameBoard 
            board={board}
            gameStatus={gameStatus}
            onCellClick={handleClick}
          />

          <GameControls
            gameStatus={gameStatus}
            winner={winner}
            isXNext={isXNext}
            timer={timer}
            moves={moves}
            onReset={handleReset}
            onPauseResume={handlePauseResume}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TicTacToe;
