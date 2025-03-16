
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { saveGameScore } from "@/services/scoreService";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

type Player = "X" | "O" | null;
type BoardState = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<"playing" | "paused" | "over">("playing");
  const [winner, setWinner] = useState<Player | "draw">(null);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Tic Tac Toe - GameHub";
    
    // Start timer
    if (gameStatus === "playing") {
      const interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [gameStatus]);

  useEffect(() => {
    // Check for winner
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
      setGameStatus("over");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Save score if user is logged in
      saveScore(currentWinner);
    } else if (!board.includes(null)) {
      // If no winner and board is full, it's a draw
      setWinner("draw");
      setGameStatus("over");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Save score if user is logged in
      saveScore("draw");
    }
  }, [board, timerInterval]);

  const saveScore = async (result: Player | "draw") => {
    if (!user) return;
    
    try {
      let score = 0;
      if (result === "X") score = 10;
      else if (result === "O") score = 5;
      else if (result === "draw") score = 3;
      
      await saveGameScore({
        user_id: user.id,
        game_name: "tic-tac-toe",
        score: score,
        time_taken: timer,
        moves: moves,
        completed: true
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || gameStatus !== "playing") {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setMoves(moves + 1);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus("playing");
    setWinner(null);
    setTimer(0);
    setMoves(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handlePauseResume = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused");
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else if (gameStatus === "paused") {
      setGameStatus("playing");
      const interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderCell = (index: number) => {
    return (
      <button
        className={`
          w-full h-full aspect-square flex items-center justify-center 
          text-3xl md:text-5xl font-semibold border border-border/80
          transition-all duration-300 ease-out ${board[index] ? "" : "hover:bg-secondary/50"}
          ${gameStatus === "paused" ? "opacity-50" : ""}
        `}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || gameStatus !== "playing"}
      >
        {board[index]}
      </button>
    );
  };

  const renderStatus = () => {
    if (winner === "X" || winner === "O") {
      return <div className="text-lg font-medium">Winner: Player {winner}</div>;
    } else if (winner === "draw") {
      return <div className="text-lg font-medium">Game ended in a draw!</div>;
    } else if (gameStatus === "paused") {
      return <div className="text-lg font-medium">Game paused</div>;
    } else {
      return <div className="text-lg font-medium">Next player: {isXNext ? "X" : "O"}</div>;
    }
  };

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

            <div className="flex items-center gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Moves: {moves}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs md:max-w-sm aspect-square">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="aspect-square">
                  {renderCell(index)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center mb-2">
              {renderStatus()}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleReset} 
                className="game-control-button"
              >
                Restart
              </button>

              {gameStatus !== "over" && (
                <button 
                  onClick={handlePauseResume} 
                  className="game-control-button"
                >
                  {gameStatus === "playing" ? "Pause" : "Resume"}
                </button>
              )}
              
              {!user && gameStatus === "over" && (
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground mb-2">Sign in to save your scores and compete on the leaderboard!</p>
                  <Link to="/signin" className="text-primary hover:underline">
                    Sign In
                  </Link>
                  {" or "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </div>
              )}
              
              {user && gameStatus === "over" && (
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground">Your score has been saved! Check the <Link to="/leaderboard?game=tic-tac-toe" className="text-primary hover:underline">leaderboard</Link>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper function to determine the winner
const calculateWinner = (squares: BoardState): Player | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

export default TicTacToe;
