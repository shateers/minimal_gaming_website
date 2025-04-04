
import { GameRefs, Rope, Level } from './types';
import { levels } from './levels';

const CANDY_RADIUS = 20;
const MONSTER_WIDTH = 80;
const MONSTER_HEIGHT = 80;
const ROPE_SEGMENTS = 10;

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

export const updateRopePhysics = (rope: Rope, candy: { x: number; y: number; radius: number; }, deltaTime: number): void => {
  if (rope.cut) return;
  
  // Calculate ideal end position based on rope length
  const dx = candy.x - rope.startX;
  const dy = candy.y - rope.startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Apply tension if rope is stretched
  if (distance > rope.length) {
    const factor = rope.length / distance;
    rope.endX = rope.startX + dx * factor;
    rope.endY = rope.startY + dy * factor;
  } else {
    rope.endX = candy.x;
    rope.endY = candy.y;
  }
  
  // Update rope angle
  rope.angle = Math.atan2(rope.endY - rope.startY, rope.endX - rope.startX);
};

export const checkRopeCut = (
  ropes: Rope[], 
  mouseX: number, 
  mouseY: number, 
  mousePressing: boolean, 
  prevMousePressing: boolean
): void => {
  // Only check for cuts on mouse down
  if (!mousePressing || prevMousePressing) return;
  
  ropes.forEach(rope => {
    if (rope.cut) return;
    
    // Create segment points along the rope
    for (let i = 0; i < 10; i++) {
      const t = i / 10;
      const x = rope.startX + t * (rope.endX - rope.startX);
      const y = rope.startY + t * (rope.endY - rope.startY);
      
      // Check if mouse is close enough to any segment
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If mouse is within 20px of rope, cut it
      if (distance < 20) {
        rope.cut = true;
        break;
      }
    }
  });
};

export const updateCandyPhysics = (
  candy: { 
    x: number; 
    y: number; 
    velocityX: number; 
    velocityY: number; 
    attached: boolean;
    attachedToRopeIds: number[];
    radius: number;
  }, 
  ropes: Rope[], 
  gravity: number,
  airResistance: number,
  canvasWidth: number,
  canvasHeight: number,
  deltaTime: number
): void => {
  // Check if candy is still attached to any rope
  const stillAttached = ropes.some(rope => !rope.cut && candy.attachedToRopeIds.includes(rope.id));
  candy.attached = stillAttached;
  
  if (candy.attached) {
    // If attached to ropes, update candy position based on connected ropes
    const attachedRopes = ropes.filter(rope => !rope.cut && candy.attachedToRopeIds.includes(rope.id));
    
    if (attachedRopes.length > 0) {
      let avgX = 0;
      let avgY = 0;
      
      attachedRopes.forEach(rope => {
        avgX += rope.endX;
        avgY += rope.endY;
      });
      
      candy.x = avgX / attachedRopes.length;
      candy.y = avgY / attachedRopes.length;
    }
  } else {
    // If not attached, apply physics
    candy.velocityY += gravity * deltaTime * 0.01;
    
    // Apply air resistance
    candy.velocityX *= airResistance;
    candy.velocityY *= airResistance;
    
    // Move candy
    candy.x += candy.velocityX * deltaTime * 0.1;
    candy.y += candy.velocityY * deltaTime * 0.1;
    
    // Wall collision
    if (candy.x - candy.radius < 0) {
      candy.x = candy.radius;
      candy.velocityX *= -0.7;
    } else if (candy.x + candy.radius > canvasWidth) {
      candy.x = canvasWidth - candy.radius;
      candy.velocityX *= -0.7;
    }
    
    // Floor collision
    if (candy.y + candy.radius > canvasHeight) {
      candy.y = canvasHeight - candy.radius;
      candy.velocityY *= -0.5;
      
      // Add some friction on floor
      candy.velocityX *= 0.9;
    }
  }
};

export const checkMonsterCollision = (
  candy: { x: number; y: number; radius: number; }, 
  monster: { x: number; y: number; width: number; height: number; mouthOpen: boolean; happy: boolean; },
  setMonsterHappy: (happy: boolean) => void
): boolean => {
  // Check if candy is close enough to make monster open mouth
  const dx = candy.x - monster.x;
  const dy = candy.y - monster.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Open mouth if candy is close
  monster.mouthOpen = distance < 100;
  
  // Check collision with monster
  if (
    candy.x + candy.radius > monster.x - monster.width / 2 &&
    candy.x - candy.radius < monster.x + monster.width / 2 &&
    candy.y + candy.radius > monster.y - monster.height / 2 &&
    candy.y - candy.radius < monster.y + monster.height / 2
  ) {
    monster.happy = true;
    setMonsterHappy(true);
    return true;
  }
  
  return false;
};

export const updateGameEntities = (
  gameRefs: GameRefs,
  canvasWidth: number, 
  canvasHeight: number,
  timestamp: number,
  setScore: (score: number) => void,
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

export const isGameOver = (gameState: { currentLevel: number }): boolean => {
  // Game over when we've completed all levels
  return gameState.currentLevel >= levels.length;
};

export const getLevelCount = (): number => {
  return levels.length;
};
