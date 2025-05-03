
import { Game } from "@/data/gameTypes";
import { handleImageError } from "@/utils/imageUtils";

interface ImagePreviewProps {
  game: Game;
}

const ImagePreview = ({ game }: ImagePreviewProps) => {
  const gameImage = game.image_url || game.imageSrc;
  
  if (!gameImage) return null;
  
  return (
    <div className="w-full max-w-md h-48 bg-muted rounded-md overflow-hidden">
      <img 
        src={gameImage} 
        alt={game.title} 
        className="w-full h-full object-contain"
        onError={(e) => handleImageError(e)}
      />
    </div>
  );
};

export default ImagePreview;
