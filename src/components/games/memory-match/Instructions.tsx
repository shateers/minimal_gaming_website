
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Instructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">How to Play</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Memory Match is a card matching game where you need to find pairs of matching cards.</p>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Rules:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click on cards to flip them over and reveal what's underneath</li>
            <li>Remember the position and value of each card</li>
            <li>Match pairs of cards with the same value</li>
            <li>Once all pairs are matched, you win the game</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Difficulty Levels:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Easy:</strong> 4×4 grid (8 pairs)</li>
            <li><strong>Medium:</strong> 6×6 grid (18 pairs)</li>
            <li><strong>Hard:</strong> 8×8 grid (32 pairs)</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Tips:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Focus and try to remember where each card is placed</li>
            <li>Start with flipping cards in a systematic pattern</li>
            <li>Once you begin to find matches, concentrate on remembering the remaining cards</li>
            <li>Try to minimize the number of moves for a better score</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Instructions;
