
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
