
export interface GameState {
  score: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
  currentLevel: number;
  levelCompleted: boolean;
}

export interface Rope {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  length: number;
  angle: number;
  cut: boolean;
  tension: number;
}

export interface Candy {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  attached: boolean;
  attachedToRopeIds: number[];
}

export interface Monster {
  x: number;
  y: number;
  width: number;
  height: number;
  mouthOpen: boolean;
  happy: boolean;
}

export interface GameRefs {
  ropes: Rope[];
  candy: Candy;
  monster: Monster;
  gravity: number;
  airResistance: number;
  lastUpdateTime: number;
  mouseX: number;
  mouseY: number;
  mousePressing: boolean;
  ropeJoints: { x: number, y: number }[];
}

export interface Level {
  ropes: {
    startX: number;
    startY: number;
    length: number;
  }[];
  monster: {
    x: number;
    y: number;
  };
  candyStartPosition: {
    x: number;
    y: number;
  };
}
