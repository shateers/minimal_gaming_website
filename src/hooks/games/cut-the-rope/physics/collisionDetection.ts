
import { Candy, Monster } from '../types';

export const checkMonsterCollision = (
  candy: Candy, 
  monster: Monster,
  onCollision: (happy: boolean) => void
): boolean => {
  // Calculate distance between candy center and monster center
  const dx = candy.x - monster.x;
  const dy = candy.y - monster.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Check if candy is close enough to monster's mouth
  if (distance < monster.width / 2 + candy.radius) {
    // Set monster's mouth state
    monster.mouthOpen = true;
    
    // If candy is very close to center, it's eaten
    if (distance < monster.width / 3) {
      onCollision(true);
      return true;
    }
  } else {
    monster.mouthOpen = false;
  }
  
  return false;
};
