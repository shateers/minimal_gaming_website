
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/data/gameTypes";
import { 
  fetchGamesFromTable, 
  insertGame, 
  updateGameImage, 
  getAllGamesFromCategories, 
  generateGameId 
} from "@/services/gameService";
import { standardizeGames, findMissingGames } from "@/utils/gameUtils";

export const useGames = () => {
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch games from Supabase with improved error handling
  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get games from database
      const { data: gamesData, error: gamesError } = await fetchGamesFromTable();
      
      if (gamesError) {
        throw gamesError;
      }
      
      if (gamesData && gamesData.length > 0) {
        // Standardize game data structure
        const standardizedGames = standardizeGames(gamesData);
        
        // Get all games from categories
        const allCategoryGames = getAllGamesFromCategories();
        
        // Find games that are in categories but not in the database
        const missingGames = findMissingGames(standardizedGames, allCategoryGames);
        
        // Insert missing games
        if (missingGames.length > 0) {
          console.log(`Adding ${missingGames.length} missing games to the database`);
          
          const insertPromises = missingGames.map(async (game) => {
            const { error } = await insertGame({
              id: game.id || generateGameId(game.title),
              title: game.title,
              description: game.description,
              href: game.href,
              image_url: game.imageSrc
            });
            
            if (error) {
              console.error(`Error inserting game ${game.title}:`, error);
              return { success: false, game, error };
            }
            return { success: true, game };
          });
          
          await Promise.allSettled(insertPromises);
          
          // Fetch updated game list after insertions
          const { data: updatedData, error: updatedError } = await fetchGamesFromTable();
          
          if (updatedError) {
            console.error("Error fetching updated games:", updatedError);
          } else if (updatedData) {
            setGamesList(standardizeGames(updatedData));
            setIsLoading(false);
            return;
          }
        }
        
        setGamesList(standardizedGames);
      } else {
        console.log("No games found in database, initializing from default data");
        // If no games in database, initialize from all game categories
        const allGames = getAllGamesFromCategories();
        
        // Insert games into database with better error handling
        const results = await Promise.allSettled(allGames.map(async (game) => {
          const gameId = game.id || generateGameId(game.title);
          const { error } = await insertGame({
            id: gameId,
            title: game.title,
            description: game.description,
            href: game.href,
            image_url: game.imageSrc
          });
          
          if (error) {
            console.error(`Error inserting game ${game.title}:`, error);
            return { success: false, game, error };
          }
          return { success: true, game };
        }));
        
        const failures = results.filter(r => r.status === 'rejected' || 
          (r.status === 'fulfilled' && !(r.value as any).success));
          
        if (failures.length > 0) {
          console.warn(`${failures.length} games failed to initialize`);
        }
        
        setGamesList(allGames);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Unknown error loading games";
      setError(errorMessage);
      toast({
        title: "Error loading games",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Game loading error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update games list after image upload with consistent image properties
  const updateGameInList = useCallback((gameId: string, imageUrl: string) => {
    setGamesList(prevGames => prevGames.map(g => 
      g.id === gameId ? { 
        ...g, 
        image_url: imageUrl,
        imageSrc: imageUrl // Keep both properties in sync
      } : g
    ));
  }, []);

  return { 
    gamesList, 
    fetchGames, 
    updateGameImage, 
    updateGameInList,
    generateGameId,
    isLoading,
    error
  };
};
