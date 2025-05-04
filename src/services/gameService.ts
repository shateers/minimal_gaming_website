
import { supabase } from "@/integrations/supabase/client";
import { Game } from "@/data/gameTypes";
import { gameCategories } from "@/data/gameCategories";

// Generate a consistent ID based on game title
export const generateGameId = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

// Fetch games from table
export const fetchGamesFromTable = async () => {
  return await supabase.from('games').select('*');
};

// Insert or update a game with better error handling
export const insertGame = async (game: {
  id: string;
  title: string;
  description: string;
  href: string;
  image_url?: string;
}) => {
  return await supabase.from('games').upsert(game);
};

// Update game image
export const updateGameImage = async (gameId: string, imageUrl: string) => {
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
    return { success: false, error: errorMsg };
  }
};

// Get all games from all categories
export const getAllGamesFromCategories = (): Game[] => {
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
  
  return allGames;
};
