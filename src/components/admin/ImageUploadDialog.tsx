
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/data/gameTypes";
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImageUploadDialogProps {
  game: Game;
  onImageUpdated: (gameId: string, imageUrl: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUploadDialog = ({ game, onImageUpdated }: ImageUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  // Fix 3: Default fallback image path
  const fallbackImage = "/public/placeholder.svg";

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    
    setIsUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const gameId = game.id || game.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    // Fix 3: Rename path to prevent AdBlock interference
    const fileName = `${gameId}-${Date.now()}`;
    const filePath = `assets/images/${fileName}.${fileExt}`;
    
    try {
      // Check if bucket exists before uploading
      const { data: buckets } = await supabase.storage.listBuckets();
      const gameAssetsBucketExists = buckets?.some(bucket => bucket.name === 'game-assets');
      
      if (!gameAssetsBucketExists) {
        throw new Error("Storage bucket not configured. Please contact administrator.");
      }
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('game-assets')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('game-assets')
        .getPublicUrl(filePath);
        
      if (!data) {
        throw new Error('Failed to get public URL');
      }
      
      console.log("File uploaded successfully, public URL:", data.publicUrl);
      
      // Update game image in database
      const { error: updateError } = await supabase
        .from('games')
        .update({ image_url: data.publicUrl })
        .eq('id', gameId);
        
      if (updateError) {
        console.error("Error updating game record:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Image Updated",
        description: `Image for ${game.title} has been updated successfully.`,
      });
      
      // Call the callback to update the parent component
      onImageUpdated(gameId, data.publicUrl);
      
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
            {(game.image_url || game.imageSrc) && (
              <div className="w-full max-w-md h-48 bg-muted rounded-md overflow-hidden">
                <img 
                  src={game.image_url || game.imageSrc} 
                  alt={game.title} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.log("Image failed to load:", game.title);
                    // Fix 2: Set fallback image if original fails
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                  }}
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
