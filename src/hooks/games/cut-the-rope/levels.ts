
import { Level } from './types';

export const levels: Level[] = [
  // Level 1 - Simple straight rope
  {
    ropes: [
      { startX: 0.5, startY: 0.1, length: 200 }
    ],
    monster: {
      x: 0.5,
      y: 0.8
    },
    candyStartPosition: {
      x: 0.5,
      y: 0.3
    }
  },
  
  // Level 2 - Two ropes
  {
    ropes: [
      { startX: 0.3, startY: 0.1, length: 180 },
      { startX: 0.7, startY: 0.1, length: 180 }
    ],
    monster: {
      x: 0.5,
      y: 0.8
    },
    candyStartPosition: {
      x: 0.5,
      y: 0.3
    }
  },
  
  // Level 3 - Three ropes in triangle
  {
    ropes: [
      { startX: 0.2, startY: 0.1, length: 200 },
      { startX: 0.5, startY: 0.1, length: 150 },
      { startX: 0.8, startY: 0.1, length: 200 }
    ],
    monster: {
      x: 0.5,
      y: 0.8
    },
    candyStartPosition: {
      x: 0.5,
      y: 0.3
    }
  },
];
