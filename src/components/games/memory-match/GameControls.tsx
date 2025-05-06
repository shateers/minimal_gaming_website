
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GameControlsProps {
  onSoundToggle: (enabled: boolean) => void;
}

const GameControls = ({ onSoundToggle }: GameControlsProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    onSoundToggle(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default GameControls;
