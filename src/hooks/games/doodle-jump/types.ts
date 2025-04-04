
export interface GameState {
  score: number;
  highScore: number;
  isPlaying: boolean;
  isGameOver: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'moving' | 'breaking' | 'bonus';
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  velocityX: number;
}

export interface Spring {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

export interface GameRefs {
  platforms: Platform[];
  player: Player;
  springs: Spring[];
  viewportOffset: number;
  keys: { [key: string]: boolean };
  requestId: number;
  lastUpdateTime: number;
}
