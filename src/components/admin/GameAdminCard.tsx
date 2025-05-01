
import { Game } from "@/data/gameTypes";
import { ImageIcon } from "lucide-react";
import ImageUploadDialog from "./ImageUploadDialog";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

interface GameAdminCardProps {
  game: Game;
  onImageUpdated: (gameId: string, imageUrl: string) => void;
}

const GameAdminCard = ({ game, onImageUpdated }: GameAdminCardProps) => {
  // Use image_url with fallback to imageSrc for consistent image handling
  const gameImage = game.image_url || game.imageSrc;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-1">{game.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {game.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="w-full h-32 bg-muted rounded-md overflow-hidden mb-3 relative">
          {gameImage ? (
            <img 
              src={gameImage} 
              alt={game.title}
              className="w-full h-full object-cover" 
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="text-muted-foreground h-10 w-10" />
              <span className="sr-only">No image available</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {game.id}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <ImageUploadDialog 
          game={game} 
          onImageUpdated={onImageUpdated} 
        />
      </CardFooter>
    </Card>
  );
};

export default GameAdminCard;
