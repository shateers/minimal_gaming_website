
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/data/gameTypes";
import { gameCategories } from "@/data/gameCategories";

export const useGames = () => {
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate a consistent ID based on game title
  const generateGameId = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };
  
  // Initialize storage bucket if it doesn't exist
  const initializeStorageBucket = async (): Promise<boolean> => {
    try {
      // Check if bucket exists first
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'game-assets');
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('game-assets', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (createError) {
          console.error("Error creating bucket:", createError);
          return false;
        }
      }
      
      return true;
    } catch (err) {
      console.error("Unexpected error initializing storage bucket:", err);
      return false;
    }
  };

  // Custom function to fetch games from table
  const fetchGamesFromTable = async () => {
    return await supabase.from('games').select('*');
  };
  
  // Custom function to insert game with better error handling
  const insertGame = async (game: {
    id: string;
    title: string;
    description: string;
    href: string;
    image_url?: string;
  }) => {
    return await supabase.from('games').upsert(game);
  };

  // Fetch games from Supabase with improved error handling
  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize storage bucket for images
      await initializeStorageBucket();
      
      // Try to get games from database
      const { data: gamesData, error: gamesError } = await fetchGamesFromTable();
      
      if (gamesError) {
        throw gamesError;
      }
      
      if (gamesData && gamesData.length > 0) {
        // Standardize game data structure
        const standardizedGames = gamesData.map(game => ({
          ...game,
          id: game.id,
          title: game.title,
          description: game.description || '',
          href: game.href || '#',
          image_url: game.image_url || undefined,
          imageSrc: game.image_url || undefined // Maintain backward compatibility
        }));
        
        setGamesList(standardizedGames as Game[]);
      } else {
        console.log("No games found in database, initializing from default data");
        // If no games in database, initialize from gameCategories
        const allGames: Game[] = [];
        gameCategories.forEach(category => {
          category.games.forEach(game => {
            const gameId = generateGameId(game.title);
            allGames.push({
              ...game,
              id: gameId,
              // Standardize image properties
              image_url: game.imageSrc,
              imageSrc: game.imageSrc
            });
          });
        });
        
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
  };

  // Update game image with improved error handling
  const updateGameImage = async (gameId: string, imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ image_url: imageUrl })
        .eq('id', gameId);
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update game image";
      toast({
        title: "Image Update Error",
        description: errorMsg,
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }
  };

  // Update games list after image upload with consistent image properties
  const updateGameInList = (gameId: string, imageUrl: string) => {
    setGamesList(prevGames => prevGames.map(g => 
      g.id === gameId ? { 
        ...g, 
        image_url: imageUrl,
        imageSrc: imageUrl // Keep both properties in sync
      } : g
    ));
  };

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
