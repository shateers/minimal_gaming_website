
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Question = {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: number;
};

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "paris",
    category: "Geography",
    difficulty: 1
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    answer: "mars",
    category: "Astronomy",
    difficulty: 1
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    answer: "leonardo da vinci",
    category: "Art",
    difficulty: 1
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    answer: "oxygen",
    category: "Science",
    difficulty: 1
  },
  {
    id: 5,
    question: "What is the largest mammal in the world?",
    answer: "blue whale",
    category: "Animals",
    difficulty: 2
  },
  {
    id: 6,
    question: "In which year did World War II end?",
    answer: "1945",
    category: "History",
    difficulty: 2
  },
  {
    id: 7,
    question: "Which famous physicist developed the theory of relativity?",
    answer: "albert einstein",
    category: "Science",
    difficulty: 2
  },
  {
    id: 8,
    question: "What is the largest organ in the human body?",
    answer: "skin",
    category: "Biology",
    difficulty: 2
  },
  {
    id: 9,
    question: "Which mountain is the highest in the world?",
    answer: "mount everest",
    category: "Geography",
    difficulty: 3
  },
  {
    id: 10,
    question: "Who wrote the play 'Hamlet'?",
    answer: "william shakespeare",
    category: "Literature",
    difficulty: 3
  },
  {
    id: 11,
    question: "Which country has the largest population in the world?",
    answer: "china",
    category: "Geography",
    difficulty: 3
  },
  {
    id: 12,
    question: "What is the hardest natural substance on Earth?",
    answer: "diamond",
    category: "Science",
    difficulty: 3
  },
  {
    id: 13,
    question: "Who is the composer of the 'Moonlight Sonata'?",
    answer: "ludwig van beethoven",
    category: "Music",
    difficulty: 4
  },
  {
    id: 14,
    question: "Which ancient wonder was located in Alexandria?",
    answer: "lighthouse",
    category: "History",
    difficulty: 4
  },
  {
    id: 15,
    question: "What is the capital of Australia?",
    answer: "canberra",
    category: "Geography",
    difficulty: 4
  },
];

const Crossclimb = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(1);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  // Initialize the game
  useEffect(() => {
    document.title = "Crossclimb - GameHub";
    startGame();

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  // Load questions for the current level
  useEffect(() => {
    loadQuestionsForLevel(currentLevel);
  }, [currentLevel]);

  const startGame = () => {
    setCurrentLevel(1);
    setMaxLevel(1);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setFeedback("");
    setGameCompleted(false);
    setStreak(0);
    
    // Start timer
    setTimer(0);
    if (timerInterval) clearInterval(timerInterval);
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    loadQuestionsForLevel(1);
  };

  const loadQuestionsForLevel = (level: number) => {
    // Filter questions by difficulty level and take 3 random ones
    const questions = SAMPLE_QUESTIONS.filter(q => q.difficulty === level);
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    setCurrentQuestions(selected);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase();
    
    if (isCorrect) {
      setFeedback("correct");
      setStreak(prev => prev + 1);
      
      // Move to next question or level
      setTimeout(() => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
          // Next question
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Next level
          const nextLevel = currentLevel + 1;
          if (nextLevel <= 4) {
            setCurrentLevel(nextLevel);
            setMaxLevel(prev => Math.max(prev, nextLevel));
          } else {
            // Game completed
            setGameCompleted(true);
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
          }
        }
        
        setUserAnswer("");
        setFeedback("");
      }, 1500);
    } else {
      setFeedback("incorrect");
      setStreak(0);
      
      setTimeout(() => {
        setUserAnswer("");
        setFeedback("");
      }, 1500);
    }
  };

  const handleLevelSelect = (level: number) => {
    if (level <= maxLevel) {
      setCurrentLevel(level);
      setCurrentQuestionIndex(0);
      setUserAnswer("");
      setFeedback("");
    }
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
            <h1 className="text-3xl font-bold">Crossclimb</h1>
            <p className="text-muted-foreground mt-2">
              Test your knowledge by answering trivia questions to climb to higher levels.
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
                  Level: {currentLevel}/4
                </div>
              </div>
              
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Streak: {streak}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(level => (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  disabled={level > maxLevel}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium
                    ${level === currentLevel ? 'bg-primary text-primary-foreground' : 
                      level <= maxLevel ? 'bg-secondary text-secondary-foreground' : 'bg-gray-200 text-gray-500'}
                    ${level <= maxLevel ? 'hover:opacity-90' : ''}
                    transition-colors disabled:cursor-not-allowed
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {gameCompleted ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
              <p className="text-lg mb-4">
                You've completed all levels of Crossclimb!
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
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                  </span>
                  <span className="text-sm font-medium px-3 py-1 bg-secondary/30 rounded-full">
                    {currentQuestions[currentQuestionIndex]?.category || ""}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold mb-6">
                  {currentQuestions[currentQuestionIndex]?.question || "Loading question..."}
                </h2>
                
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
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
                  
                  <button
                    type="submit"
                    disabled={!!feedback || !userAnswer.trim()}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </form>
                
                {feedback === "incorrect" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Hint: The answer starts with "{currentQuestions[currentQuestionIndex]?.answer.charAt(0)}"
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-2">Level {currentLevel} Progress</h3>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all"
                    style={{ width: `${((currentQuestionIndex) / currentQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-bold mb-4">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Answer trivia questions correctly to progress.</li>
              <li>Each level contains 3 questions of increasing difficulty.</li>
              <li>Complete all 4 levels to win the game.</li>
              <li>Build a streak by answering questions correctly in a row.</li>
              <li>Your answers aren't case sensitive, but spelling matters!</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Crossclimb;
