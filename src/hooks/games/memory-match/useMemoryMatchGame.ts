
import { useState, useEffect, useCallback } from 'react';

// Card types and interfaces
export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GameStatus = 'ready' | 'playing' | 'paused' | 'completed';
type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG = {
  easy: { pairs: 6, timeLimit: 60 },
  medium: { pairs: 10, timeLimit: 90 },
  hard: { pairs: 15, timeLimit: 120 }
};

// Card emojis for the game
const CARD_EMOJIS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🦄', '🐙', '🦋', '🐢', '🦖', '🦕', '🦝', '🦩',
  '🐳', '🐬', '🐠', '🐡', '🦈', '🐊', '🦓', '🦍'
];

export const useMemoryMatchGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timeLimit, setTimeLimit] = useState(DIFFICULTY_CONFIG.easy.timeLimit);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [matches, setMatches] = useState(0);
  const [totalPairs, setTotalPairs] = useState(DIFFICULTY_CONFIG.easy.pairs);

  // Initialize the game with shuffled cards
  const initializeGame = useCallback((diff: Difficulty = 'easy') => {
    const { pairs, timeLimit } = DIFFICULTY_CONFIG[diff];
    
    // Get a subset of emojis based on difficulty
    const emojiSubset = [...CARD_EMOJIS].slice(0, pairs);
    
    // Create pairs and shuffle
    const cardPairs = [...emojiSubset, ...emojiSubset]
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTimer(timeLimit);
    setTimeLimit(timeLimit);
    setGameStatus('ready');
    setMatches(0);
    setTotalPairs(pairs);
    setDifficulty(diff);
  }, []);

  // Handle card flips
  const handleCardFlip = useCallback((card: Card) => {
    // Ignore if game is not playing or card is already flipped/matched
    if (gameStatus !== 'playing' || card.isFlipped || card.isMatched) {
      return;
    }
    
    // If we already have 2 flipped cards, ignore new flips
    if (flippedCards.length === 2) {
      return;
    }
    
    // Update the flipped status of the card
    const updatedCards = cards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    
    setCards(updatedCards);
    
    // Add card to flippedCards
    const updatedFlippedCards = [...flippedCards, card];
    setFlippedCards(updatedFlippedCards);
    
    // If this is the second card flipped, check for a match
    if (updatedFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = updatedFlippedCards;
      
      if (first.value === second.value) {
        // It's a match!
        setTimeout(() => {
          const matchedCards = cards.map(c => 
            c.id === first.id || c.id === second.id 
              ? { ...c, isMatched: true } 
              : c
          );
          
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(prev => prev + 1);
          setScore(prev => prev + 10); // 10 points per match
          
          // Check if all pairs are matched
          if (matches + 1 === totalPairs) {
            setGameStatus('completed');
            // Bonus points for unused time and fewer moves
            const timeBonus = Math.floor(timer * 0.5);
            const moveBonus = Math.max(0, 30 - moves) * 2;
            setScore(prev => prev + timeBonus + moveBonus);
          }
        }, 500);
      } else {
        // Not a match, flip cards back
        setTimeout(() => {
          const resetCards = cards.map(c => 
            c.id === first.id || c.id === second.id 
              ? { ...c, isFlipped: false } 
              : c
          );
          
          setCards(resetCards);
          setFlippedCards([]);
          setScore(prev => Math.max(0, prev - 1)); // -1 point for wrong match
        }, 1000);
      }
    }
  }, [cards, flippedCards, gameStatus, matches, timer, totalPairs, moves]);

  // Start the game
  const startGame = useCallback(() => {
    setGameStatus('playing');
  }, []);

  // Reset the game
  const resetGame = useCallback(() => {
    initializeGame(difficulty);
  }, [initializeGame, difficulty]);

  // Change difficulty
  const changeDifficulty = useCallback((diff: Difficulty) => {
    if (gameStatus !== 'playing') {
      initializeGame(diff);
    }
  }, [initializeGame, gameStatus]);

  // Pause/resume game
  const togglePause = useCallback(() => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  // Timer effect
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (gameStatus === 'playing' && timer > 0) {
      intervalId = window.setInterval(() => {
        setTimer(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setGameStatus('completed');
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameStatus, timer]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    cards,
    gameStatus,
    moves,
    score,
    timer,
    difficulty,
    matches,
    totalPairs,
    formatTime,
    handleCardFlip,
    startGame,
    resetGame,
    changeDifficulty,
    togglePause,
    initializeGame
  };
};
