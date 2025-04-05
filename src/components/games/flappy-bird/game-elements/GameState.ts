import { GameState as GameStateType } from "../../../../hooks/games/flappy-bird/useFlappyBirdGame";
import { BirdClass } from "./Bird";
import { PipeClass } from "./Pipe";
import { CloudClass } from "./Cloud";

export class GameStateManager {
  gameState: GameStateType;
  score: number;
  bird: BirdClass;
  pipes: PipeClass[];
  clouds: CloudClass[];
  frameCount: number;
  gravity: number;
  speed: number;
  canvasWidth: number;
  canvasHeight: number;
  isCountingDown: boolean;
  countdownValue: number;

  constructor(canvasWidth: number, canvasHeight: number, initialState: GameStateType, initialScore: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.gameState = initialState;
    this.score = initialScore;
    
    // Initialize game elements
    this.bird = new BirdClass(canvasWidth, canvasHeight);
    this.pipes = [];
    this.clouds = [
      new CloudClass(canvasWidth, canvasHeight),
      new CloudClass(canvasWidth, canvasHeight)
    ];
    
    // Game physics
    this.gravity = 0.25;
    this.speed = 2;
    this.frameCount = 0;
    
    // Countdown state
    this.isCountingDown = false;
    this.countdownValue = 3;

    // Set bird at the top when game starts
    this.resetBirdPosition();
  }

  updateGameState(newState: GameStateType) {
    this.gameState = newState;
    
    // Reset bird position when the game state changes to waiting
    if (newState === "waiting") {
      this.resetBirdPosition();
      this.pipes = []; // Clear pipes when restarting
    }
  }

  // New method to reset bird position
  resetBirdPosition() {
    if (this.bird) {
      this.bird.y = this.canvasHeight * 0.3; // Position bird at the top third of screen
      this.bird.velocity = 0;
      this.bird.rotation = 0;
    }
  }

  updateScore(newScore: number) {
    this.score = newScore;
  }

  incrementFrame() {
    this.frameCount++;
  }

  addCloud() {
    if (this.frameCount % 200 === 0) {
      this.clouds.push(new CloudClass(this.canvasWidth, this.canvasHeight));
    }
  }

  updateClouds() {
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      this.clouds[i].update();
      if (this.clouds[i].x + this.clouds[i].width < 0) {
        this.clouds.splice(i, 1);
      }
    }
  }

  updatePipes(onJump: () => void): boolean {
    let scoreIncremented = false;
    
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipePassedBird = this.pipes[i].update(this.speed, this.bird.x, this.canvasWidth);
      
      // Remove pipes that are off screen
      if (this.pipes[i].x + this.pipes[i].width < 0) {
        this.pipes.splice(i, 1);
        continue;
      }
      
      // Increment score
      if (pipePassedBird) {
        scoreIncremented = true;
      }
    }
    
    // Add new pipe
    if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvasWidth - 200) {
      this.pipes.push(new PipeClass(this.canvasWidth, this.canvasHeight));
    }
    
    return scoreIncremented;
  }

  checkCollisions(onGameOver: () => void): boolean {
    // Check pipe collisions
    for (const pipe of this.pipes) {
      if (pipe.checkCollision(this.bird)) {
        return true;
      }
    }
    
    // Check floor collision (moved from bird update to here for consistency)
    if (this.bird.y + this.bird.height > this.canvasHeight - 90) {
      return true;
    }
    
    return false;
  }

  updateBird(onGameOver: () => void) {
    this.bird.update(this.gravity, this.canvasHeight);
  }
}
