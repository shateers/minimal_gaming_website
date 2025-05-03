
import { useEffect, useState } from "react";
import { useGames } from "@/hooks/useGames";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminChecker from "@/components/admin/AdminChecker";
import GameManagementHeader from "@/components/admin/GameManagementHeader";
import AdBlockWarning from "@/components/admin/AdBlockWarning";
import ErrorAlert from "@/components/admin/ErrorAlert";
import StorageAlert from "@/components/admin/StorageAlert";
import GamesGrid from "@/components/admin/GamesGrid";

/**
 * GameManagement component for admin users to manage game images
 * 
 * Note: Some resources on this page may be blocked by ad blockers due to path names
 * containing terms like "uploads". We've implemented fallbacks to handle these cases.
 */
const GameManagement = () => {
  const { 
    gamesList, 
    fetchGames, 
    updateGameInList, 
    isLoading: isLoadingGames,
    error: gamesError
  } = useGames();
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Game Management - Shateer Games Admin";
    fetchGames();
  }, [fetchGames, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast({
      title: "Refreshing games",
      description: "Attempting to fetch the latest game data.",
    });
  };

  const handleImageUpdated = (gameId: string, imageUrl: string) => {
    updateGameInList(gameId, imageUrl);
    toast({
      title: "Image updated",
      description: "Game image has been updated successfully",
    });
  };

  return (
    <AdminChecker>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-8 pt-24">
          <div className="max-w-6xl mx-auto">
            <GameManagementHeader 
              handleRetry={handleRetry} 
              isLoadingGames={isLoadingGames} 
            />
            
            <AdBlockWarning />
            
            <ErrorAlert 
              error={gamesError} 
              handleRetry={handleRetry} 
            />
            
            <StorageAlert error={gamesError} />
            
            <GamesGrid 
              isLoading={isLoadingGames}
              games={gamesList}
              handleRetry={handleRetry}
              onImageUpdated={handleImageUpdated}
            />
          </div>
        </main>
        
        <Footer />
      </div>
    </AdminChecker>
  );
};

export default GameManagement;
