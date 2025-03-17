
import React from "react";
import { Link } from "react-router-dom";
import { Player, GameStatus } from "./types";
import { formatTime } from "./utils";
import { useAuth } from "@/contexts/AuthContext";

interface GameControlsProps {
  gameStatus: GameStatus;
  winner: Player | "draw";
  isXNext: boolean;
  timer: number;
  moves: number;
  onReset: () => void;
  onPauseResume: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  winner,
  isXNext,
  timer,
  moves,
  onReset,
  onPauseResume
}) => {
  const { user } = useAuth();

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
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center mb-2">
        {renderStatus()}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={onReset} 
          className="game-control-button"
        >
          Restart
        </button>

        {gameStatus !== "over" && (
          <button 
            onClick={onPauseResume} 
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
  );
};

export default GameControls;
