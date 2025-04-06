
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/data/gameTypes";
import { Upload } from "lucide-react";
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
import { Input } from "@/components/ui/input";

interface ImageUploadDialogProps {
  game: Game;
  onImageUpdated: (gameId: string, imageUrl: string) => void;
}

const ImageUploadDialog = ({ game, onImageUpdated }: ImageUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    setIsUploading(true);
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const gameId = game.id || game.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filePath = `game-images/${gameId}.${fileExt}`;
    
    try {
      // Create storage bucket if it doesn't exist
      try {
        await supabase.storage.createBucket('game-assets', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      } catch (error) {
        // Bucket might already exist, continue
        console.log('Storage bucket might already exist');
      }
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('game-assets')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('game-assets')
        .getPublicUrl(filePath);
        
      if (!data) {
        throw new Error('Failed to get public URL');
      }
      
      // Update game image in database
      const { error: updateError } = await supabase
        .from('games')
        .update({ image_url: data.publicUrl })
        .eq('id', gameId);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Image Updated",
        description: `Image for ${game.title} has been updated successfully.`,
      });
      
      // Call the callback to update the parent component
      onImageUpdated(gameId, data.publicUrl);
      
    } catch (error: any) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Update Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Game Image</DialogTitle>
          <DialogDescription>
            Upload a new image for {game.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {(game.image_url || game.imageSrc) && (
              <div className="w-full max-w-md h-48 bg-muted rounded-md overflow-hidden">
                <img 
                  src={game.image_url || game.imageSrc} 
                  alt={game.title} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
