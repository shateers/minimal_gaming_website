
import { GameState as GameStateType } from "../../../../hooks/games/flappy-bird/useFlappyBirdGame";
import { GameStateManager } from "./GameState";
import { GameRenderer } from "./GameRenderer";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameState: GameStateManager;
  private renderer: GameRenderer;
  private animationFrameId: number | null = null;
  private onJump: () => void;
  private onGameOver: () => void;
  private onScoreUpdate: () => void;
  private lastTimestamp: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    initialState: GameStateType,
    initialScore: number,
    onJump: () => void,
    onGameOver: () => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onJump = onJump;
    this.onGameOver = onGameOver;
    this.onScoreUpdate = () => {};

    // Set canvas dimensions - fixed size for consistency
    this.canvas.width = 360;
    this.canvas.height = 640;

    // Initialize game state and renderer
    this.gameState = new GameStateManager(this.canvas.width, this.canvas.height, initialState, initialScore);
    this.renderer = new GameRenderer(this.ctx, this.canvas.width, this.canvas.height);

    // Start the game loop
    this.startGameLoop();

    // Add click event listener to canvas
    this.canvas.addEventListener('click', this.handleCanvasClick);
  }

  private handleCanvasClick = () => {
    if (this.gameState.gameState === "playing") {
      this.onJump();
    } else if (this.gameState.gameState === "waiting") {
      this.onJump();
    }
  };

  private startGameLoop() {
    const loop = (timestamp: number) => {
      // Calculate delta time
      const deltaTime = timestamp - (this.lastTimestamp || timestamp);
      this.lastTimestamp = timestamp;

      // Clear canvas
      this.renderer.clearCanvas();

      // Update and render game based on current state
      if (this.gameState.gameState === "waiting") {
        this.updateWaitingState();
      } else if (this.gameState.gameState === "playing") {
        this.updatePlayingState(deltaTime);
      } else if (this.gameState.gameState === "gameover") {
        this.updateGameOverState();
      }

      // Continue the game loop
      this.animationFrameId = requestAnimationFrame(loop);
    };

    // Start the loop
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private updateWaitingState() {
    // Update clouds
    this.gameState.incrementFrame();
    this.gameState.addCloud();
    this.gameState.updateClouds();

    // Render everything
    this.renderer.renderBackground(this.gameState.clouds);
    this.renderer.renderBird(this.gameState.bird);
    this.renderer.renderWaitingScreen();
  }

  private updatePlayingState(deltaTime: number) {
    // Update game elements
    this.gameState.incrementFrame();
    this.gameState.addCloud();
    this.gameState.updateClouds();
    
    // Update bird and check for collisions
    this.gameState.updateBird(this.onGameOver);
    
    // Update pipes and check for score update
    const scoreIncremented = this.gameState.updatePipes(this.onJump);
    if (scoreIncremented) {
      this.onScoreUpdate();
    }
    
    // Check for collisions
    const hasCollided = this.gameState.checkCollisions(this.onGameOver);
    if (hasCollided) {
      this.onGameOver();
      return;
    }
    
    // Render everything
    this.renderer.renderBackground(this.gameState.clouds);
    this.renderer.renderPipes(this.gameState.pipes);
    this.renderer.renderBird(this.gameState.bird);
    this.renderer.renderScore(this.gameState.score);
  }

  private updateGameOverState() {
    // Render final state
    this.renderer.renderBackground(this.gameState.clouds);
    this.renderer.renderPipes(this.gameState.pipes);
    this.renderer.renderBird(this.gameState.bird);
    this.renderer.renderGameOverScreen(this.gameState.score);
  }

  updateGameState(newState: GameStateType) {
    this.gameState.updateGameState(newState);
  }

  updateScore(newScore: number) {
    this.gameState.updateScore(newScore);
  }

  cleanup() {
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Remove event listeners
    this.canvas.removeEventListener('click', this.handleCanvasClick);
  }
}
