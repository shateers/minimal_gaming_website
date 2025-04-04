
import { GameRefs, Rope, Level } from './types';
import { levels } from './levels';
import { updateRopePhysics, checkRopeCut } from './physics/ropePhysics';
import { updateCandyPhysics } from './physics/candyPhysics';
import { checkMonsterCollision } from './physics/collisionDetection';
import { CANDY_RADIUS, MONSTER_WIDTH, MONSTER_HEIGHT, ROPE_SEGMENTS } from './constants';
import { getLevelCount } from './levelManager';

export const initializeGameEntities = (
  canvasWidth: number, 
  canvasHeight: number,
  currentLevel: number
): GameRefs => {
  // Get current level configuration
  const level = levels[currentLevel % levels.length];
  
  // Initialize ropes based on level configuration
  const ropes = level.ropes.map((rope, index) => ({
    id: index,
    startX: rope.startX * canvasWidth,
    startY: rope.startY * canvasHeight,
    endX: 0, // Will be calculated
    endY: 0, // Will be calculated
    length: rope.length,
    angle: Math.PI / 2, // Start hanging down
    cut: false,
    tension: 0.1
  }));
  
  // Initialize candy
  const candy = {
    x: level.candyStartPosition.x * canvasWidth,
    y: level.candyStartPosition.y * canvasHeight,
    radius: CANDY_RADIUS,
    velocityX: 0,
    velocityY: 0,
    attached: true,
    attachedToRopeIds: ropes.map(rope => rope.id)
  };
  
  // Calculate initial rope end positions based on candy position
  ropes.forEach(rope => {
    const dx = candy.x - rope.startX;
    const dy = candy.y - rope.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    rope.angle = Math.atan2(dy, dx);
    rope.endX = rope.startX + Math.cos(rope.angle) * rope.length;
    rope.endY = rope.startY + Math.sin(rope.angle) * rope.length;
  });
  
  // Initialize monster
  const monster = {
    x: level.monster.x * canvasWidth,
    y: level.monster.y * canvasHeight,
    width: MONSTER_WIDTH,
    height: MONSTER_HEIGHT,
    mouthOpen: false,
    happy: false
  };
  
  // Initialize rope joints for rendering
  const ropeJoints = [];
  for (let i = 0; i < ROPE_SEGMENTS; i++) {
    ropeJoints.push({ x: 0, y: 0 });
  }
  
  return {
    ropes,
    candy,
    monster,
    gravity: 0.5,
    airResistance: 0.98,
    lastUpdateTime: 0,
    mouseX: 0,
    mouseY: 0,
    mousePressing: false,
    ropeJoints
  };
};

export const updateGameEntities = (
  gameRefs: GameRefs,
  canvasWidth: number, 
  canvasHeight: number,
  timestamp: number,
  setScore: (score: number | ((prev: number) => number)) => void,
  setLevelCompleted: (completed: boolean) => void
): boolean => {
  const deltaTime = timestamp - gameRefs.lastUpdateTime;
  
  // Store previous mouse state to detect clicks
  const prevMousePressing = gameRefs.mousePressing;
  
  // Check for rope cuts
  checkRopeCut(gameRefs.ropes, gameRefs.mouseX, gameRefs.mouseY, gameRefs.mousePressing, prevMousePressing);
  
  // Update rope physics
  gameRefs.ropes.forEach(rope => {
    updateRopePhysics(rope, gameRefs.candy, deltaTime);
  });
  
  // Update candy physics
  updateCandyPhysics(
    gameRefs.candy, 
    gameRefs.ropes, 
    gameRefs.gravity, 
    gameRefs.airResistance, 
    canvasWidth, 
    canvasHeight, 
    deltaTime
  );
  
  // Check if candy is eaten by monster
  const monsterEaten = checkMonsterCollision(gameRefs.candy, gameRefs.monster, (happy: boolean) => {
    gameRefs.monster.happy = happy;
    
    if (happy) {
      // Award points and complete level
      setScore(prev => prev + 100);
      setLevelCompleted(true);
    }
  });
  
  // Check if candy has fallen off the screen
  const candyLost = gameRefs.candy.y > canvasHeight + 50;
  
  return candyLost && !monsterEaten;
};

// Re-export functions from levelManager
export { getLevelCount };
export { isGameOver } from './levelManager';
