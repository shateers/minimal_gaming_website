import { GameState } from "../../../../hooks/games/flappy-bird/useFlappyBirdGame";
import { GameRenderer } from "./GameRenderer";
import { GameStateManager } from "./GameState";

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  renderer: GameRenderer;
  stateManager: GameStateManager;
  animationFrameId: number;
  
  onJump: () => void;
  onGameOver: () => void;
  restartTimer: number | null;
  
  constructor(
    canvas: HTMLCanvasElement, 
    gameState: GameState, 
    score: number, 
    onJump: () => void, 
    onGameOver: () => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    
    // Set canvas dimensions to 800x500
    this.canvas.width = 800;
    this.canvas.height = 500;
    
    // Initialize renderer and state manager
    this.renderer = new GameRenderer(this.ctx, this.canvas.width, this.canvas.height);
    this.stateManager = new GameStateManager(
      this.canvas.width, 
      this.canvas.height,
      gameState,
      score
    );
    
    this.onJump = onJump;
    this.onGameOver = onGameOver;
    this.animationFrameId = 0;
    this.restartTimer = null;
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start game loop
    this.gameLoop();
  }
  
  setupEventListeners() {
    const handleCanvasClick = (e: MouseEvent) => {
      e.preventDefault(); // Prevent any default behavior
      
      if (this.stateManager.gameState === "waiting" && !this.stateManager.isCountingDown) {
        this.onJump(); // This will start the game via the parent component
      } else if (this.stateManager.gameState === "playing") {
        this.stateManager.bird.jump();
      }
    };
    
    this.canvas.addEventListener("click", handleCanvasClick);
    
    // Prevent scrolling when clicking on canvas
    this.canvas.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
  }
  
  cleanupEventListeners() {
    // Remove event listeners when cleaning up
    this.canvas.replaceWith(this.canvas.cloneNode(true));
  }
  
  updateGameState(newGameState: GameState) {
    // If transitioning from gameover to waiting, set a timer
    if (this.stateManager.gameState === "gameover" && newGameState === "waiting") {
      this.startRestartTimer();
    }
    this.stateManager.updateGameState(newGameState);
  }
  
  updateScore(newScore: number) {
    this.stateManager.updateScore(newScore);
  }
  
  startRestartTimer() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
    
    // Set a flag to indicate counting down
    this.stateManager.isCountingDown = true;
    this.stateManager.countdownValue = 3;
    
    // Reset bird position immediately when timer starts
    this.stateManager.resetBirdPosition();
    
    const countDown = () => {
      if (this.stateManager.countdownValue > 1) {
        this.stateManager.countdownValue--;
        this.restartTimer = window.setTimeout(countDown, 1000);
      } else {
        this.stateManager.isCountingDown = false;
        this.restartTimer = null;
      }
    };
    
    // Start countdown
    this.restartTimer = window.setTimeout(countDown, 1000);
  }
  
  gameLoop = () => {
    // Increment frame count
    this.stateManager.incrementFrame();
    
    // Clear canvas
    this.renderer.clearCanvas();
    
    if (this.stateManager.gameState === "waiting") {
      this.renderWaitingState();
    } else if (this.stateManager.gameState === "playing") {
      this.renderPlayingState();
    } else if (this.stateManager.gameState === "gameover") {
      this.renderGameOverState();
    }
    
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };
  
  renderWaitingState() {
    this.renderer.renderBackground(this.stateManager.clouds);
    this.renderer.renderBird(this.stateManager.bird);
    
    // Show countdown or "Click to start" based on state
    if (this.stateManager.isCountingDown) {
      this.renderer.renderCountdown(this.stateManager.countdownValue);
    } else {
      this.renderer.renderWaitingScreen();
    }
  }
  
  renderPlayingState() {
    // Add and update clouds
    this.stateManager.addCloud();
    this.stateManager.updateClouds();
    
    // Draw background with clouds
    this.renderer.renderBackground(this.stateManager.clouds);
    
    // Update and check pipes
    const scoreIncremented = this.stateManager.updatePipes(this.onJump);
    this.renderer.renderPipes(this.stateManager.pipes);
    
    // Check for collisions
    if (this.stateManager.checkCollisions(this.onGameOver)) {
      this.onGameOver();
      return;
    }
    
    // Update and draw bird
    this.stateManager.updateBird(this.onGameOver);
    this.renderer.renderBird(this.stateManager.bird);
    
    // Draw score
    this.renderer.renderScore(this.stateManager.score);
    
    // Call score update in parent component if needed
    if (scoreIncremented) {
      this.onJump(); // Trigger state update in parent
    }
  }
  
  renderGameOverState() {
    // Draw game elements in background
    this.renderer.renderBackground(this.stateManager.clouds);
    this.renderer.renderPipes(this.stateManager.pipes);
    this.renderer.renderBird(this.stateManager.bird);
    
    // Draw game over overlay
    this.renderer.renderGameOverScreen(this.stateManager.score);
  }
  
  cleanup() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
    }
    cancelAnimationFrame(this.animationFrameId);
    this.cleanupEventListeners();
  }
}
