
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import GameBoard from "../../components/games/connect-four/GameBoard";
import GameControls from "../../components/games/connect-four/GameControls";
import GameStats from "../../components/games/connect-four/GameStats";
import Instructions from "../../components/games/connect-four/Instructions";
import { useConnectFourGame } from "../../hooks/games/connect-four/useConnectFourGame";

const ConnectFour = () => {
  const {
    board,
    currentPlayer,
    gameStatus,
    winner,
    timer,
    moves,
    winningCells,
    dropPiece,
    resetGame,
    togglePause,
    formatTime
  } = useConnectFourGame();

  useEffect(() => {
    document.title = "Connect Four - GameHub";
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
            <h1 className="text-3xl font-bold">Connect Four</h1>
            <p className="text-muted-foreground mt-2">
              Connect four of your colored discs in a row while preventing your opponent from doing the same.
            </p>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <GameStats timer={timer} moves={moves} formatTime={formatTime} />
          </div>

          <div className="flex justify-center mb-8">
            <GameBoard
              board={board}
              currentPlayer={currentPlayer}
              gameStatus={gameStatus}
              winningCells={winningCells}
              onColumnClick={dropPiece}
            />
          </div>

          <GameControls
            currentPlayer={currentPlayer}
            gameStatus={gameStatus}
            winner={winner}
            timer={timer}
            moves={moves}
            formatTime={formatTime}
            onReset={resetGame}
            onPauseResume={togglePause}
          />

          <Instructions />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConnectFour;
