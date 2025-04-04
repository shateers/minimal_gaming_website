
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Instructions = () => {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold">
            How to Play
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p>
              Doodle Jump is a vertical platformer where you guide a cute character upward by jumping from platform to platform without falling.
            </p>
            <div>
              <h3 className="font-medium mb-2">Game Rules:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the left and right arrow keys (or A and D) to move your character horizontally.</li>
                <li>Your character automatically jumps when landing on platforms.</li>
                <li>Don't fall off the bottom of the screen or the game ends!</li>
                <li>Different platform types have different behaviors:
                  <ul className="list-disc pl-5 mt-1">
                    <li><span className="text-green-600 font-medium">Green platforms</span> - Normal, stable platforms</li>
                    <li><span className="text-blue-400 font-medium">Blue platforms</span> - Moving platforms</li>
                    <li><span className="text-red-300 font-medium">Red platforms</span> - Break after one use</li>
                    <li><span className="text-yellow-500 font-medium">Yellow platforms</span> - Bonus platforms with higher jumps</li>
                  </ul>
                </li>
                <li>Red springs give you an extra high jump when touched.</li>
                <li>Your goal is to climb as high as possible and achieve the highest score.</li>
              </ul>
            </div>
            <p>
              The game gets progressively more challenging as you climb higher. How far can you go?
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Instructions;
