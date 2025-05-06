
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Instructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">How to Play</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Rock Paper Scissors is a classic hand game usually played between two people.</p>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Rules:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rock beats Scissors (rock crushes scissors)</li>
            <li>Scissors beats Paper (scissors cut paper)</li>
            <li>Paper beats Rock (paper covers rock)</li>
            <li>If both players choose the same shape, it's a draw</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">How to Win:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Choose your move by clicking one of the three options</li>
            <li>The computer will randomly select its move</li>
            <li>The winner is determined by the rules above</li>
            <li>Try to predict what the computer will choose next!</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Tips:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>People often subconsciously follow patterns - but computers don't!</li>
            <li>The computer makes completely random choices</li>
            <li>Rock is statistically thrown most often by beginners</li>
            <li>After losing with one move, players often switch to the move that would have beaten their previous move</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Instructions;
