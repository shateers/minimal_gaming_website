
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const GameControls = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHints, setShowHints] = useState(true);

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
            onCheckedChange={setSoundEnabled} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="hints" className="flex flex-col gap-1">
            <span>Show Hints</span>
            <span className="text-sm font-normal text-muted-foreground">Show column preview on hover</span>
          </Label>
          <Switch 
            id="hints" 
            checked={showHints} 
            onCheckedChange={setShowHints} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControls;
