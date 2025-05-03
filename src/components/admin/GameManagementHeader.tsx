
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameManagementHeaderProps {
  handleRetry: () => void;
  isLoadingGames: boolean;
}

const GameManagementHeader = ({ handleRetry, isLoadingGames }: GameManagementHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Game Management</h1>
        <p className="text-muted-foreground mt-2">
          Update game images and information
        </p>
      </div>
      
      <Button 
        onClick={handleRetry} 
        variant="outline"
        disabled={isLoadingGames}
        className="flex items-center"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingGames ? 'animate-spin' : ''}`} />
        {isLoadingGames ? 'Refreshing...' : 'Refresh Games'}
      </Button>
    </div>
  );
};

export default GameManagementHeader;
