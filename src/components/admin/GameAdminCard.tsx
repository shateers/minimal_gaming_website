
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
import { useState } from "react";

interface GameAdminCardProps {
  game: Game;
  onImageUpdated: (gameId: string, imageUrl: string) => void;
}

const GameAdminCard = ({ game, onImageUpdated }: GameAdminCardProps) => {
  // Use image_url with fallback to imageSrc for consistent image handling
  const gameImage = game.image_url || game.imageSrc;
  const [imageError, setImageError] = useState(false);
  
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
          {gameImage && !imageError ? (
            <img 
              src={gameImage} 
              alt={game.title}
              className="w-full h-full object-cover" 
              onError={() => {
                console.log("Image load error for:", game.title);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="text-muted-foreground h-10 w-10" />
              <span className="sr-only">No image available</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground truncate w-3/4">
            ID: {game.id}
          </p>
          {gameImage && !imageError && (
            <button 
              className="text-xs text-blue-500 hover:underline" 
              onClick={() => window.open(gameImage, '_blank')}
            >
              View
            </button>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <ImageUploadDialog 
          game={game} 
          onImageUpdated={(gameId, newImageUrl) => {
            setImageError(false);
            onImageUpdated(gameId, newImageUrl);
          }} 
        />
      </CardFooter>
    </Card>
  );
};

export default GameAdminCard;
