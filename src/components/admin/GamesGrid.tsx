
import { Game } from "@/data/gameTypes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GameAdminCard from "@/components/admin/GameAdminCard";

interface GamesGridProps {
  isLoading: boolean;
  games: Game[];
  handleRetry: () => void;
  onImageUpdated: (gameId: string, imageUrl: string) => void;
}

const GamesGrid = ({ isLoading, games, handleRetry, onImageUpdated }: GamesGridProps) => {
  if (isLoading) {
    return (
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
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16 border rounded-md bg-muted/20">
        <p className="text-muted-foreground mb-4">No games found</p>
        <Button onClick={handleRetry}>Refresh Games</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameAdminCard 
          key={game.id || game.title} 
          game={game} 
          onImageUpdated={onImageUpdated}
        />
      ))}
    </div>
  );
};

export default GamesGrid;
