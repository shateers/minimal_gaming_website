
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { gameCategories } from "@/data/gameCategories";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Game } from "@/data/gameTypes";
import { Upload, Image as ImageIcon } from "lucide-react";

const GameManagement = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = "Game Management - Shateer Games Admin";
    
    // Check admin status
    const checkAdmin = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }
      
      try {
        // Fetch admin status
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        // Check if user is admin
        if (!data || data.is_admin !== true) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
        fetchGames();
      } catch (error: any) {
        toast({
          title: "Error fetching admin status",
          description: error.message,
          variant: "destructive",
        });
        navigate('/');
      }
    };
    
    checkAdmin();
  }, [user, navigate, toast]);
  
  // Fetch games from Supabase
  const fetchGames = async () => {
    try {
      // Try to get games from database using a custom function to bypass type checking
      const { data: gamesData, error: gamesError } = await fetchGamesFromTable();
      
      if (gamesError) throw gamesError;
      
      if (gamesData && gamesData.length > 0) {
        setGamesList(gamesData as Game[]);
      } else {
        // If no games in database, initialize from gameCategories
        const allGames: Game[] = [];
        gameCategories.forEach(category => {
          category.games.forEach(game => {
            allGames.push({
              ...game,
              id: generateGameId(game.title)
            });
          });
        });
        
        // Insert games into database
        await Promise.all(allGames.map(async (game) => {
          const gameId = game.id || generateGameId(game.title);
          await insertGame({
            id: gameId,
            title: game.title,
            description: game.description,
            href: game.href,
            image_url: game.imageSrc
          });
        }));
        
        setGamesList(allGames);
      }
    } catch (error: any) {
      toast({
        title: "Error loading games",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Custom function to fetch games from table to bypass type checking
  const fetchGamesFromTable = async () => {
    return await supabase
      .from('games')
      .select('*');
  };
  
  // Custom function to insert game to bypass type checking
  const insertGame = async (game: {
    id: string;
    title: string;
    description: string;
    href: string;
    image_url?: string;
  }) => {
    return await supabase
      .from('games')
      .upsert(game);
  };

  // Custom function to update game image to bypass type checking
  const updateGameImage = async (gameId: string, imageUrl: string) => {
    return await supabase
      .from('games')
      .update({ image_url: imageUrl })
      .eq('id', gameId);
  };
  
  // Generate a consistent ID based on game title
  const generateGameId = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, game: Game) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    setIsUploading(true);
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const gameId = game.id || generateGameId(game.title);
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
      const { error: updateError } = await updateGameImage(gameId, data.publicUrl);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Image Updated",
        description: `Image for ${game.title} has been updated successfully.`,
      });
      
      // Update local state to show the new image
      setGamesList(prevGames => prevGames.map(g => 
        g.id === gameId ? { ...g, image_url: data.publicUrl } : g
      ));
      
    } catch (error: any) {
      toast({
        title: "Error updating image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedGame(null);
    }
  };

  if (!isAdmin) {
    return <div className="p-10 text-center">Checking admin privileges...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Game Management</h1>
            <p className="text-muted-foreground mt-2">
              Update game images and information
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gamesList.map((game) => (
              <Card key={game.id || game.title} className="overflow-hidden">
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedGame(game)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Update Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Game Image</DialogTitle>
                        <DialogDescription>
                          Upload a new image for {selectedGame?.title}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center gap-4">
                          {selectedGame && (selectedGame.image_url || selectedGame.imageSrc) && (
                            <div className="w-full max-w-md h-48 bg-muted rounded-md overflow-hidden">
                              <img 
                                src={selectedGame.image_url || selectedGame.imageSrc} 
                                alt={selectedGame.title} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => selectedGame && handleImageUpload(e, selectedGame)}
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
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameManagement;
