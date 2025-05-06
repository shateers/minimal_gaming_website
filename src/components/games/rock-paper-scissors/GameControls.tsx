
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface GameControlsProps {
  // For future enhancement: Add props if needed
}

const GameControls = () => {
  // These states could be used for future enhancements
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficultyLevel, setDifficultyLevel] = useState([50]);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    // Sound toggle implementation would go here
  };

  const handleDifficultyChange = (value: number[]) => {
    setDifficultyLevel(value);
    // Difficulty adjustment implementation would go here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="sound" className="flex flex-col gap-1">
            <span>Sound Effects</span>
            <span className="text-sm font-normal text-muted-foreground">Toggle game sounds on/off</span>
          </Label>
          <Switch 
            id="sound" 
            checked={soundEnabled} 
            onCheckedChange={handleSoundToggle} 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="difficulty">
              <span>Computer Intelligence</span>
              <span className="block text-sm font-normal text-muted-foreground">Adjust how smart the computer plays</span>
            </Label>
            <span className="text-sm font-medium">
              {difficultyLevel[0] < 33 ? "Random" :
               difficultyLevel[0] < 66 ? "Adaptive" : "Strategic"}
            </span>
          </div>
          <Slider
            id="difficulty"
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={handleDifficultyChange}
            className="mt-2"
          />
        </div>
        
        <div className="pt-2">
          <Button variant="outline" className="w-full">
            Statistics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControls;
