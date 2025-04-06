
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/data/gameTypes";
import { gameCategories } from "@/data/gameCategories";

export const useGames = () => {
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Custom function to fetch games from table to bypass type checking
  const fetchGamesFromTable = async () => {
    return await supabase.from('games').select('*');
  };
  
  // Custom function to insert game to bypass type checking
  const insertGame = async (game: {
    id: string;
    title: string;
    description: string;
    href: string;
    image_url?: string;
  }) => {
    return await supabase.from('games').upsert(game);
  };

  // Generate a consistent ID based on game title
  const generateGameId = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  // Fetch games from Supabase
  const fetchGames = async () => {
    setIsLoading(true);
    try {
      // Try to get games from database
      const { data: gamesData, error: gamesError } = await fetchGamesFromTable();
      
      if (gamesError) throw gamesError;
      
      if (gamesData && gamesData.length > 0) {
        setGamesList(gamesData as Game[]);
      } else {
        // If no games in database, initialize from gameCategories
        const allGames: Game[] = [];
        gameCategories.forEach(category => {
          category.games.forEach(game => {
            allGames.push({
              ...game,
              id: generateGameId(game.title)
            });
          });
        });
        
        // Insert games into database
        await Promise.all(allGames.map(async (game) => {
          const gameId = game.id || generateGameId(game.title);
          await insertGame({
            id: gameId,
            title: game.title,
            description: game.description,
            href: game.href,
            image_url: game.imageSrc
          });
        }));
        
        setGamesList(allGames);
      }
    } catch (error: any) {
      toast({
        title: "Error loading games",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Custom function to update game image to bypass type checking
  const updateGameImage = async (gameId: string, imageUrl: string) => {
    return await supabase
      .from('games')
      .update({ image_url: imageUrl })
      .eq('id', gameId);
  };

  // Update games list after image upload
  const updateGameInList = (gameId: string, imageUrl: string) => {
    setGamesList(prevGames => prevGames.map(g => 
      g.id === gameId ? { ...g, image_url: imageUrl } : g
    ));
  };

  return { 
    gamesList, 
    fetchGames, 
    updateGameImage, 
    updateGameInList,
    generateGameId,
    isLoading
  };
};
