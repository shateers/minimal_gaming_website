
import { useEffect } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useGames } from "@/hooks/useGames";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GameAdminCard from "@/components/admin/GameAdminCard";

const GameManagement = () => {
  const { isAdmin, isLoading: isCheckingAdmin } = useAdminCheck();
  const { gamesList, fetchGames, updateGameInList, isLoading: isLoadingGames } = useGames();

  useEffect(() => {
    document.title = "Game Management - Shateer Games Admin";
    
    if (isAdmin) {
      fetchGames();
    }
  }, [isAdmin, fetchGames]);

  if (isCheckingAdmin) {
    return <div className="p-10 text-center">Checking admin privileges...</div>;
  }

  if (!isAdmin) {
    return <div className="p-10 text-center">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Game Management</h1>
            <p className="text-muted-foreground mt-2">
              Update game images and information
            </p>
          </div>
          
          {isLoadingGames ? (
            <div className="text-center py-10">Loading games...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gamesList.map((game) => (
                <GameAdminCard 
                  key={game.id || game.title} 
                  game={game} 
                  onImageUpdated={updateGameInList}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameManagement;
