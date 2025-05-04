
import { Game } from "@/data/gameTypes";

// Standardize game data structure for consistency
export const standardizeGames = (games: any[]): Game[] => {
  return games.map(game => ({
    ...game,
    id: game.id,
    title: game.title,
    description: game.description || '',
    href: game.href || '#',
    image_url: game.image_url || undefined,
    imageSrc: game.image_url || undefined // Maintain backward compatibility
  }));
};

// Find games that are in categories but not in the database
export const findMissingGames = (dbGames: Game[], categoryGames: Game[]): Game[] => {
  return categoryGames.filter(categoryGame => 
    !dbGames.some(dbGame => dbGame.id === categoryGame.id)
  );
};
