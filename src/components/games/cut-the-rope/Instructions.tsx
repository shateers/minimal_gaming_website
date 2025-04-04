
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Scissors } from "lucide-react";

const Instructions = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="instructions">
        <AccordionTrigger className="text-lg font-semibold">
          How to Play
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-4 text-left">
          <div className="space-y-2">
            <h3 className="font-medium">Game Objective</h3>
            <p>
              Feed the candy to the cute monster by cutting the ropes strategically. Complete all levels to win!
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Controls</h3>
            <div className="flex items-center gap-2">
              <Scissors size={18} className="text-red-500" />
              <span>Click or tap on a rope to cut it</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Time your cuts carefully to get the candy to the monster</li>
              <li>Sometimes you need to cut multiple ropes in sequence</li>
              <li>The monster opens its mouth when the candy is nearby</li>
              <li>Each successful feeding awards 100 points</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Instructions;
