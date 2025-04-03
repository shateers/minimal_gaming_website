
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Instructions = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">How to Play</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Breakout Game Instructions</DialogTitle>
          <DialogDescription>
            Learn how to play the classic Breakout game
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <h3 className="font-semibold text-lg">Goal</h3>
          <p>
            Clear all the bricks from the screen by hitting them with the ball. Progress through
            increasingly difficult levels.
          </p>
          
          <h3 className="font-semibold text-lg">Controls</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Left Arrow</span>: Move paddle left
            </li>
            <li>
              <span className="font-medium">Right Arrow</span>: Move paddle right
            </li>
            <li>
              <span className="font-medium">Space or Enter</span>: Start game / Pause game
            </li>
          </ul>
          
          <h3 className="font-semibold text-lg">Game Rules</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You start with 3 lives
            </li>
            <li>
              Some bricks require multiple hits to break (shown by a number)
            </li>
            <li>
              You lose a life when the ball falls below the paddle
            </li>
            <li>
              The angle of the ball's bounce depends on where it hits the paddle
            </li>
            <li>
              Complete a level by breaking all bricks
            </li>
            <li>
              Bricks get stronger in higher levels
            </li>
          </ul>
          
          <h3 className="font-semibold text-lg">Scoring</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Breaking bricks awards points based on level
            </li>
            <li>
              Complete destruction of a brick: 10 × level points
            </li>
            <li>
              Damaging a brick: 1 × level points
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Instructions;
