
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
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{game.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {game.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="w-full h-32 bg-muted rounded-md overflow-hidden mb-3 relative">
          {(game.image_url || game.imageSrc) ? (
            <img 
              src={game.image_url || game.imageSrc} 
              alt={game.title}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="text-muted-foreground h-10 w-10" />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <ImageUploadDialog game={game} onImageUpdated={onImageUpdated} />
      </CardFooter>
    </Card>
  );
};

export default GameAdminCard;
