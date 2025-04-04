
import { toast } from '@/components/ui/use-toast';
import { saveGameScore } from '@/services/scoreService';
import { User } from '@supabase/supabase-js';
import { GameState } from './types';

export const handleGameEnd = async (
  success: boolean,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  user: User | null
): Promise<void> => {
  const finalScore = gameState.score;
  const newHighScore = finalScore > gameState.highScore;
  
  if (newHighScore) {
    setGameState(prev => ({...prev, highScore: finalScore}));
    localStorage.setItem('cutTheRopeHighScore', finalScore.toString());
  }
  
  setGameState(prev => ({
    ...prev,
    isPlaying: false,
    isGameOver: true
  }));
  
  // Show different messages based on success
  if (success) {
    toast({
      title: 'Game Complete!',
      description: `Congratulations! You've completed all levels with a score of ${finalScore}!`,
    });
  } else {
    toast({
      title: 'Game Over!',
      description: `Try again! Your score was ${finalScore}.`,
      variant: 'destructive'
    });
  }
  
  if (user && finalScore > 0) {
    try {
      await saveGameScore({
        user_id: user.id,
        game_name: 'cut-the-rope',
        score: finalScore,
        completed: success
      });
      toast({
        title: 'Score saved!',
        description: `Your score of ${finalScore} has been saved.`
      });
    } catch (error) {
      console.error('Error saving score:', error);
      toast({
        title: 'Score not saved',
        description: 'There was an error saving your score.',
        variant: 'destructive'
      });
    }
  }
};
