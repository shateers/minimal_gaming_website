
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type WordSet = {
  category: string;
  words: string[];
  difficulty: "easy" | "medium" | "hard";
};

const WORD_SETS: WordSet[] = [
  {
    category: "Fruits",
    words: ["Apple", "Banana", "Orange", "Grape", "Strawberry"],
    difficulty: "easy"
  },
  {
    category: "Countries",
    words: ["France", "Japan", "Brazil", "Egypt", "Australia"],
    difficulty: "easy"
  },
  {
    category: "Sports",
    words: ["Soccer", "Basketball", "Tennis", "Golf", "Swimming"],
    difficulty: "easy"
  },
  {
    category: "Colors",
    words: ["Red", "Blue", "Green", "Yellow", "Purple"],
    difficulty: "easy"
  },
  {
    category: "Musical Instruments",
    words: ["Piano", "Guitar", "Violin", "Trumpet", "Drums"],
    difficulty: "medium"
  },
  {
    category: "Planets",
    words: ["Mercury", "Venus", "Earth", "Mars", "Jupiter"],
    difficulty: "medium"
  },
  {
    category: "Occupations",
    words: ["Doctor", "Teacher", "Engineer", "Chef", "Lawyer"],
    difficulty: "medium"
  },
  {
    category: "Mammals",
    words: ["Elephant", "Lion", "Dolphin", "Bear", "Kangaroo"],
    difficulty: "medium"
  },
  {
    category: "Programming Languages",
    words: ["JavaScript", "Python", "Java", "C++", "Ruby"],
    difficulty: "hard"
  },
  {
    category: "Greek Gods",
    words: ["Zeus", "Athena", "Apollo", "Poseidon", "Hermes"],
    difficulty: "hard"
  },
  {
    category: "Chemical Elements",
    words: ["Hydrogen", "Oxygen", "Carbon", "Gold", "Sodium"],
    difficulty: "hard"
  },
  {
    category: "Shakespeare Plays",
    words: ["Hamlet", "Macbeth", "Othello", "Romeo and Juliet", "King Lear"],
    difficulty: "hard"
  }
];

type Difficulty = "easy" | "medium" | "hard" | "all";

const Pinpoint = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [currentWordSet, setCurrentWordSet] = useState<WordSet | null>(null);
  const [revealedWords, setRevealedWords] = useState<number[]>([]);
  const [userGuess, setUserGuess] = useState("");
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
    document.title = "Pinpoint - GameHub";
    startGame();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [difficulty]);

  const startGame = () => {
    setRevealedWords([]);
    setUserGuess("");
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

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
          setUserGuess("");
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
        setUserGuess("");
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <span className="mr-2">←</span> Back to games
            </Link>
            <h1 className="text-3xl font-bold">Pinpoint</h1>
            <p className="text-muted-foreground mt-2">
              Guess the category based on the revealed words. The fewer words you need, the more points you earn!
            </p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Score: {score}
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Round: {round}/{maxRounds}
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="easy" onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <TabsList>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {gameCompleted ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
              <p className="text-lg mb-4">
                Your final score: <span className="font-bold text-primary">{score}</span>
              </p>
              <p className="mb-6">
                Time taken: {formatTime(timer)}
              </p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-border p-6">
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Revealed Words:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentWordSet && currentWordSet.words.map((word, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg text-center font-medium ${
                        revealedWords.includes(index) 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-gray-100 text-gray-100 border border-transparent'
                      }`}
                    >
                      {revealedWords.includes(index) ? word : 'Hidden'}
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleGuessSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="Guess the category..."
                    className={`w-full p-3 border ${
                      feedback === "correct" ? "border-green-500 bg-green-50" :
                      feedback === "incorrect" ? "border-red-500 bg-red-50" :
                      "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    disabled={!!feedback}
                  />
                  {feedback && (
                    <div className={`absolute right-3 top-3 ${
                      feedback === "correct" ? "text-green-500" : "text-red-500"
                    }`}>
                      {feedback === "correct" ? "✓" : "✗"}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!!feedback || !userGuess.trim()}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Submit Guess
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleGetHint}
                    disabled={!!feedback || hintUsed || !currentWordSet}
                    className="py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Hint
                  </button>
                </div>
              </form>
              
              {hintUsed && currentWordSet && (
                <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                  <p className="text-sm font-medium">
                    Hint: The category starts with the letter "{currentWordSet.category.charAt(0).toUpperCase()}"
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-muted-foreground">
                <div>
                  Words revealed: {revealedWords.length}/5
                </div>
                <div>
                  {hintUsed ? "Hint used (-points)" : "No hint used"}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Words from a category will be revealed one at a time.</li>
              <li>Your goal is to guess the category with as few words as possible.</li>
              <li>The fewer words you need to see, the more points you earn.</li>
              <li>If your guess is incorrect, another word will be revealed.</li>
              <li>You can use a hint to see the first letter of the category, but it will reduce your points.</li>
              <li>Complete 5 rounds to finish the game.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pinpoint;
