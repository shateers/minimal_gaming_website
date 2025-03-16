
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getGameScores } from "@/services/scoreService";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const GAMES = [
  "tic-tac-toe",
  "sudoku",
  "tango",
  "snake",
  "tetris",
  "crossword",
  "jigsaw",
  "queens",
  "crossclimb",
  "pinpoint"
];

const Leaderboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const game = searchParams.get("game") || "all";
  
  useEffect(() => {
    fetchScores();
  }, [game]);
  
  const fetchScores = async () => {
    setLoading(true);
    try {
      const { data, error } = await getGameScores(game !== "all" ? game : undefined);
      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatGameTime = (seconds: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const handleGameChange = (selectedGame: string) => {
    setSearchParams({ game: selectedGame });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to home
            </Link>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground mt-2">
              See who's topping the charts in our games!
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGameChange("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  game === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                All Games
              </button>
              
              {GAMES.map((gameName) => (
                <button
                  key={gameName}
                  onClick={() => handleGameChange(gameName)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    game === gameName
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {gameName.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2">Loading scores...</p>
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No scores found for this game yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Rank</th>
                      <th className="text-left py-2 px-4">Player</th>
                      <th className="text-left py-2 px-4">Game</th>
                      <th className="text-left py-2 px-4">Score</th>
                      <th className="text-left py-2 px-4">Time</th>
                      <th className="text-left py-2 px-4">Moves</th>
                      <th className="text-left py-2 px-4">Difficulty</th>
                      <th className="text-left py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score, index) => (
                      <tr key={score.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{score.profiles?.username || "Anonymous"}</td>
                        <td className="py-2 px-4 capitalize">{score.game_name}</td>
                        <td className="py-2 px-4">{score.score}</td>
                        <td className="py-2 px-4">{score.time_taken ? formatGameTime(score.time_taken) : "N/A"}</td>
                        <td className="py-2 px-4">{score.moves || "N/A"}</td>
                        <td className="py-2 px-4 capitalize">{score.difficulty || "N/A"}</td>
                        <td className="py-2 px-4">{new Date(score.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
