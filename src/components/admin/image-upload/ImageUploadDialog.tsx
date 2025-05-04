
import { useState } from "react";
import { Game } from "@/data/gameTypes";
import { useToast } from "@/components/ui/use-toast";
import { updateGameImage as updateGameImageService } from "@/services/gameService";
import { Upload, AlertCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImagePreview from "./ImagePreview";
import UploadForm from "./UploadForm";
import { 
  validateImageFile, 
  uploadGameImage,
  updateGameImageInDatabase
} from "./uploadService";

interface ImageUploadDialogProps {
  game: Game;
  onImageUpdated: (gameId: string, imageUrl: string) => void;
}

const ImageUploadDialog = ({ game, onImageUpdated }: ImageUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleFileSelect = async (file: File) => {
    setError(null);
    
    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    setIsUploading(true);
    
    const gameId = game.id || game.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    try {
      // Upload the file
      const uploadResult = await uploadGameImage(file, gameId, game.title);
      
      if ('error' in uploadResult) {
        throw uploadResult.error;
      }
      
      // Update the game image in the database
      await updateGameImageInDatabase(gameId, uploadResult.publicUrl);
      
      toast({
        title: "Image Updated",
        description: `Image for ${game.title} has been updated successfully.`,
      });
      
      // Call the callback to update the parent component
      onImageUpdated(gameId, uploadResult.publicUrl);
      
      // Close the dialog after successful upload
      setIsOpen(false);
      
    } catch (error: any) {
      console.error("Upload error details:", error);
      setError(error.message);
      toast({
        title: "Error updating image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            setError(null);
            setIsOpen(true);
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Update Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Game Image</DialogTitle>
          <DialogDescription>
            Upload a new image for {game.title}. Maximum size: 5MB.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col items-center gap-4">
            <ImagePreview game={game} />
            <UploadForm 
              isUploading={isUploading}
              error={error}
              onFileSelect={handleFileSelect}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            disabled={isUploading}
            onClick={() => setIsOpen(false)}
          >
            {isUploading ? "Uploading..." : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
