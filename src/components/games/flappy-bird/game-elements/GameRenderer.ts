
import { BirdClass } from "./Bird";
import { PipeClass } from "./Pipe";
import { CloudClass } from "./Cloud";
import { Background } from "./Background";
import { GameUI } from "./GameUI";

export class GameRenderer {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  background: Background;
  gameUI: GameUI;

  constructor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.background = new Background(ctx, canvasWidth, canvasHeight);
    this.gameUI = new GameUI(ctx, canvasWidth, canvasHeight);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  renderBackground(clouds: CloudClass[]) {
    this.background.render(clouds);
  }

  renderBird(bird: BirdClass) {
    bird.draw(this.ctx);
  }

  renderPipes(pipes: PipeClass[]) {
    pipes.forEach(pipe => pipe.draw(this.ctx, this.canvasHeight));
  }

  renderScore(score: number) {
    this.gameUI.renderScore(score);
  }

  renderWaitingScreen() {
    this.gameUI.renderWaitingScreen();
  }
  
  renderCountdown(count: number) {
    this.gameUI.renderCountdown(count);
  }

  renderGameOverScreen(score: number) {
    this.gameUI.renderGameOverScreen(score);
  }
}
