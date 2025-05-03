import { useEffect, useState } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useGames } from "@/hooks/useGames";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GameAdminCard from "@/components/admin/GameAdminCard";
import { AlertCircle, RefreshCw, Image as ImageIcon, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

/**
 * GameManagement component for admin users to manage game images
 * 
 * Note: Some resources on this page may be blocked by ad blockers due to path names
 * containing terms like "uploads". We've implemented fallbacks to handle these cases.
 */
const GameManagement = () => {
  const { isAdmin, isLoading: isCheckingAdmin, error: adminError } = useAdminCheck();
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
    
    if (isAdmin) {
      fetchGames();
    }
  }, [isAdmin, fetchGames, retryCount]);

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

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-xl font-semibold mb-4">Checking admin privileges...</div>
              <div className="flex space-x-2">
                <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                Admin privileges are required to access this page.
                {adminError && (
                  <div className="mt-2 text-sm">
                    Error: {adminError}
                  </div>
                )}
              </AlertDescription>
            </Alert>
            <Button onClick={() => window.location.href = "/signin"}>
              Go to Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Game Management</h1>
              <p className="text-muted-foreground mt-2">
                Update game images and information
              </p>
            </div>
            
            <Button 
              onClick={handleRetry} 
              variant="outline"
              disabled={isLoadingGames}
              className="flex items-center"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingGames ? 'animate-spin' : ''}`} />
              {isLoadingGames ? 'Refreshing...' : 'Refresh Games'}
            </Button>
          </div>
          
          {/* Ad blocker notification */}
          <Alert variant="warning" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>AdBlock Notice</AlertTitle>
            <AlertDescription>
              Some images may be blocked by ad blockers. We've implemented fallbacks,
              but for best experience, consider temporarily disabling ad blockers on this page.
            </AlertDescription>
          </Alert>
          
          {gamesError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to load games</AlertTitle>
              <AlertDescription>
                {gamesError}
                <div className="mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRetry}
                  >
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-6">
            <Alert>
              <ImageIcon className="h-4 w-4" />
              <AlertTitle>Image Management</AlertTitle>
              <AlertDescription>
                To upload images for games, make sure the storage bucket has been properly configured.
                {gamesError && gamesError.includes("bucket") && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">
                      Storage bucket configuration issue detected. Please check your Supabase storage settings.
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
          
          {isLoadingGames ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-6" />
                  <Skeleton className="h-32 w-full mb-4" />
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : gamesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gamesList.map((game) => (
                <GameAdminCard 
                  key={game.id || game.title} 
                  game={game} 
                  onImageUpdated={handleImageUpdated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-md bg-muted/20">
              <p className="text-muted-foreground mb-4">No games found</p>
              <Button onClick={handleRetry}>Refresh Games</Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameManagement;
