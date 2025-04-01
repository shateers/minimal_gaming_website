
import { useState, useEffect } from 'react';
import { WordSet, WORD_SETS } from '@/data/pinpointWordSets';

type Difficulty = "easy" | "medium" | "hard" | "all";

export const usePinpointGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [currentWordSet, setCurrentWordSet] = useState<WordSet | null>(null);
  const [revealedWords, setRevealedWords] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // Initialize the game
  useEffect(() => {
    startGame();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);

  const startGame = () => {
    setRevealedWords([]);
    setFeedback("");
    setScore(0);
    setRound(1);
    setGameCompleted(false);
    setHintUsed(false);
    
    // Start timer
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    // Select a random word set
    selectRandomWordSet();
  };

  const selectRandomWordSet = () => {
    // Filter word sets by difficulty
    const availableSets = difficulty === "all" 
      ? WORD_SETS 
      : WORD_SETS.filter(set => set.difficulty === difficulty);
    
    if (availableSets.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableSets.length);
    setCurrentWordSet(availableSets[randomIndex]);
    
    // Start with one revealed word
    const firstWordIndex = Math.floor(Math.random() * 5);
    setRevealedWords([firstWordIndex]);
  };

  const handleGuessSubmit = (userGuess: string) => {
    if (!userGuess.trim() || !currentWordSet) return;
    
    const isCorrect = userGuess.toLowerCase().trim() === currentWordSet.category.toLowerCase();
    
    if (isCorrect) {
      setFeedback("correct");
      
      // Calculate points
      const pointsPerWord = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
      const points = pointsPerWord * (6 - revealedWords.length) - (hintUsed ? pointsPerWord : 0);
      
      setScore(prev => prev + points);
      
      // Move to next round or end game
      setTimeout(() => {
        if (round < maxRounds) {
          setRound(prev => prev + 1);
          selectRandomWordSet();
          setFeedback("");
          setHintUsed(false);
        } else {
          // Game completed
          setGameCompleted(true);
          if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
          }
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      
      setTimeout(() => {
        setFeedback("");
        
        // Reveal another word if possible
        if (currentWordSet && revealedWords.length < currentWordSet.words.length) {
          let newWordIndex;
          do {
            newWordIndex = Math.floor(Math.random() * currentWordSet.words.length);
          } while (revealedWords.includes(newWordIndex));
          
          setRevealedWords(prev => [...prev, newWordIndex]);
        }
      }, 1500);
    }
  };

  const handleGetHint = () => {
    if (!currentWordSet || hintUsed) return;
    
    // Provide the first letter of the category
    setHintUsed(true);
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    difficulty,
    currentWordSet,
    revealedWords,
    feedback,
    timer,
    score,
    round,
    maxRounds,
    gameCompleted,
    hintUsed,
    setDifficulty,
    startGame,
    handleGuessSubmit,
    handleGetHint,
    formatTime
  };
};
