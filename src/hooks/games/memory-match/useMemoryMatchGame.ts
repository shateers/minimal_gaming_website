
import { useState, useEffect, useCallback } from 'react';

// Define card types and game state
export type MemoryCard = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type GameStatus = 'idle' | 'playing' | 'completed';

// Game difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Define game settings based on difficulty
const DIFFICULTY_SETTINGS = {
  easy: {
    gridSize: 4, // 4x4 grid
    matchTime: 1000, // Time to view non-matching cards before flipping back
  },
  medium: {
    gridSize: 6, // 6x6 grid
    matchTime: 800,
  },
  hard: {
    gridSize: 8, // 8x8 grid
    matchTime: 600,
  },
};

// Card images/emojis
const CARD_VALUES = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🐤', '🦄', '🐝', '🐛', '🦋', '🐌',
  '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🦐', '🦞',
];

export function useMemoryMatchGame(difficulty: Difficulty = 'easy') {
  // Game state
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [gameTime, setGameTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Get difficulty settings
  const { gridSize, matchTime } = DIFFICULTY_SETTINGS[difficulty];
  const totalPairs = (gridSize * gridSize) / 2;

  // Initialize or reset the game
  const initializeGame = useCallback(() => {
    // Reset game state
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameTime(0);
    setStartTime(null);
    setGameStatus('idle');
    
    // Create and shuffle cards
    const values = [...CARD_VALUES].slice(0, totalPairs);
    const cardPairs = [...values, ...values];
    const shuffledCards = shuffleArray(cardPairs).map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    
    setCards(shuffledCards);
  }, [totalPairs]);

  // Start the game
  const startGame = useCallback(() => {
    setGameStatus('playing');
    setStartTime(Date.now());
  }, []);

  // Flip a card
  const flipCard = useCallback((cardId: number) => {
    // Start game on first card flip if not started
    if (gameStatus === 'idle') {
      startGame();
    }
    
    // Don't allow more than 2 cards flipped at once
    if (flippedCards.length >= 2) return;
    
    // Don't allow flipping a card that's already flipped or matched
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    
    setFlippedCards(prev => [...prev, cardId]);
    
    // If this is the second card, check for a match
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(c => c.id === firstCardId)!;
      const secondCard = cards.find(c => c.id === cardId)!;
      
      if (firstCard.value === secondCard.value) {
        // Cards match
        setCards(prevCards => 
          prevCards.map(card => 
            (card.id === firstCardId || card.id === cardId) ? { ...card, isMatched: true } : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        // Cards don't match, flip them back after a delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              (card.id === firstCardId || card.id === cardId) ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
        }, matchTime);
      }
    }
  }, [cards, flippedCards, gameStatus, matchTime, startGame]);

  // Game timer
  useEffect(() => {
    let intervalId: number;
    
    if (gameStatus === 'playing') {
      intervalId = window.setInterval(() => {
        if (startTime) {
          const currentTime = Math.floor((Date.now() - startTime) / 1000);
          setGameTime(currentTime);
        }
      }, 1000);
    }
    
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStatus, startTime]);

  // Check if game is completed
  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0 && gameStatus === 'playing') {
      setGameStatus('completed');
    }
  }, [matchedPairs, totalPairs, gameStatus]);

  // Helper function to shuffle an array
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return {
    cards,
    moves,
    gameTime,
    gameStatus,
    matchedPairs,
    totalPairs,
    gridSize,
    flipCard,
    initializeGame,
    startGame,
  };
}
