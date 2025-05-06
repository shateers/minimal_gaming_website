
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Instructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">How to Play</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Connect Four is a classic two-player connection game where players take turns dropping colored discs into a grid.</p>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Rules:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Players take turns placing their colored discs</li>
            <li>Discs fall to the lowest available position in the column</li>
            <li>Connect four discs horizontally, vertically, or diagonally to win</li>
            <li>If the board fills up without a winner, the game is a draw</li>
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Tips:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Try to think several moves ahead</li>
            <li>Block your opponent from connecting four</li>
            <li>Control the center columns - they provide more winning opportunities</li>
            <li>Create multiple threats to force your opponent into difficult choices</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Instructions;
