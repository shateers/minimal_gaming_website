
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

// Define types for the crossword
type Direction = "across" | "down";
type Cell = {
  char: string;
  number?: number;
  isBlack: boolean;
  isRevealed: boolean;
};
type Word = {
  id: number;
  direction: Direction;
  clue: string;
  answer: string;
  row: number;
  col: number;
};

// Sample crossword data (in a real app, this would come from an API or database)
const SAMPLE_CROSSWORD = {
  grid: [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ], // 0 = normal cell, 1 = black cell
  words: [
    {
      id: 1,
      direction: "across",
      clue: "Not digital",
      answer: "ANALOG",
      row: 0,
      col: 0,
    },
    {
      id: 2,
      direction: "down",
      clue: "Large primate",
      answer: "APE",
      row: 0,
      col: 0,
    },
    {
      id: 3,
      direction: "across",
      clue: "Small insect",
      answer: "ANT",
      row: 2,
      col: 0,
    },
    {
      id: 4,
      direction: "down",
      clue: "Not old",
      answer: "NEW",
      row: 0,
      col: 2,
    },
    {
      id: 5,
      direction: "across",
      clue: "Opposite of night",
      answer: "DAY",
      row: 4,
      col: 0,
    },
    {
      id: 6,
      direction: "down",
      clue: "Lion's home",
      answer: "DEN",
      row: 4,
      col: 0,
    },
    {
      id: 7,
      direction: "across",
      clue: "Unit of time",
      answer: "HOUR",
      row: 6,
      col: 0,
    },
    {
      id: 8,
      direction: "down",
      clue: "Not yes",
      answer: "NO",
      row: 0,
      col: 5,
    },
    {
      id: 9,
      direction: "across",
      clue: "Audio device",
      answer: "EAR",
      row: 0,
      col: 3,
    },
    {
      id: 10,
      direction: "down",
      clue: "Measurement of time",
      answer: "ERA",
      row: 0,
      col: 3,
    },
  ] as Word[],
};

const Crossword = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<Direction>("across");
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<"playing" | "paused" | "over">("playing");
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const cluesRef = useRef<HTMLDivElement>(null);

  // Initialize the crossword
  useEffect(() => {
    document.title = "Crossword - GameHub";
    initCrossword();
    
    // Start timer
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  useEffect(() => {
    // Check if the crossword is complete
    if (board.length > 0) {
      const isAllFilled = board.every(row => 
        row.every(cell => cell.isBlack || cell.char !== '')
      );
      
      if (isAllFilled) {
        const isAllCorrect = words.every(word => {
          return checkWordCorrect(word);
        });
        
        if (isAllCorrect) {
          setIsComplete(true);
          setGameStatus("over");
          if (timerInterval) {
            clearInterval(timerInterval);
          }
        }
      }
    }
  }, [board, words, timerInterval]);

  // Check if a word is filled in correctly
  const checkWordCorrect = (word: Word) => {
    const { row, col, direction, answer } = word;
    
    for (let i = 0; i < answer.length; i++) {
      let r = row;
      let c = col;
      
      if (direction === "across") {
        c += i;
      } else {
        r += i;
      }
      
      if (r >= board.length || c >= board[0].length) {
        return false;
      }
      
      if (board[r][c].char.toUpperCase() !== answer[i]) {
        return false;
      }
    }
    
    return true;
  };

  // Initialize the crossword
  const initCrossword = () => {
    const { grid, words } = SAMPLE_CROSSWORD;
    const height = grid.length;
    const width = grid[0].length;
    
    // Initialize the board with empty cells
    const newBoard: Cell[][] = [];
    for (let i = 0; i < height; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < width; j++) {
        row.push({
          char: "",
          isBlack: grid[i][j] === 1,
          isRevealed: false,
        });
      }
      newBoard.push(row);
    }
    
    // Add numbers to cells where words start
    let cellNumber = 1;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!newBoard[i][j].isBlack) {
          const startsAcross = j === 0 || newBoard[i][j-1].isBlack;
          const startsDown = i === 0 || newBoard[i-1][j].isBlack;
          
          if (startsAcross || startsDown) {
            newBoard[i][j].number = cellNumber++;
          }
        }
      }
    }
    
    setBoard(newBoard);
    setWords(words);
    
    // Select the first word if there is one
    if (words.length > 0) {
      setSelectedWordId(words[0].id);
      setSelectedCell({ row: words[0].row, col: words[0].col });
      setSelectedDirection(words[0].direction);
    }
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== "playing" || board[row][col].isBlack) {
      return;
    }
    
    // If clicking the same cell, toggle direction
    if (selectedCell?.row === row && selectedCell?.col === col) {
      setSelectedDirection(prev => prev === "across" ? "down" : "across");
    } else {
      setSelectedCell({ row, col });
    }
    
    // Find word that contains this cell
    const wordsAtCell = words.filter(word => {
      const { row: wordRow, col: wordCol, direction, answer } = word;
      for (let i = 0; i < answer.length; i++) {
        let r = wordRow;
        let c = wordCol;
        
        if (direction === "across") {
          c += i;
        } else {
          r += i;
        }
        
        if (r === row && c === col) {
          return true;
        }
      }
      return false;
    });
    
    // Select the word based on the direction
    const wordInDirection = wordsAtCell.find(word => word.direction === selectedDirection);
    const wordInOtherDirection = wordsAtCell.find(word => word.direction !== selectedDirection);
    
    if (wordInDirection) {
      setSelectedWordId(wordInDirection.id);
    } else if (wordInOtherDirection) {
      setSelectedWordId(wordInOtherDirection.id);
      setSelectedDirection(wordInOtherDirection.direction);
    }
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameStatus !== "playing" || !selectedCell) {
      return;
    }
    
    const { row, col } = selectedCell;
    
    if (e.key === "Backspace" || e.key === "Delete") {
      // Clear the current cell
      const newBoard = [...board];
      newBoard[row][col].char = "";
      setBoard(newBoard);
      
      // Move to the previous cell
      moveToAdjacentCell(-1);
    } else if (e.key === "ArrowLeft") {
      moveInDirection(0, -1);
    } else if (e.key === "ArrowRight") {
      moveInDirection(0, 1);
    } else if (e.key === "ArrowUp") {
      moveInDirection(-1, 0);
    } else if (e.key === "ArrowDown") {
      moveInDirection(1, 0);
    } else if (e.key === "Tab") {
      e.preventDefault();
      moveToNextWord(e.shiftKey ? -1 : 1);
    } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      // Enter a letter
      const newBoard = [...board];
      newBoard[row][col].char = e.key.toUpperCase();
      setBoard(newBoard);
      
      // Move to the next cell
      moveToAdjacentCell(1);
    }
  };

  // Move to an adjacent cell in the current direction
  const moveToAdjacentCell = (direction: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const increment = direction; // 1 for forward, -1 for backward
    
    if (selectedDirection === "across") {
      let newCol = col + increment;
      
      // Check if the new column is valid
      if (newCol >= 0 && newCol < board[0].length && !board[row][newCol].isBlack) {
        setSelectedCell({ row, col: newCol });
      }
    } else {
      let newRow = row + increment;
      
      // Check if the new row is valid
      if (newRow >= 0 && newRow < board.length && !board[newRow][col].isBlack) {
        setSelectedCell({ row: newRow, col });
      }
    }
  };

  // Move in a specific direction (for arrow keys)
  const moveInDirection = (rowDelta: number, colDelta: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const newRow = row + rowDelta;
    const newCol = col + colDelta;
    
    // Check if the new position is valid
    if (
      newRow >= 0 && newRow < board.length &&
      newCol >= 0 && newCol < board[0].length &&
      !board[newRow][newCol].isBlack
    ) {
      setSelectedCell({ row: newRow, col: newCol });
      
      // Update selected direction based on movement
      if (rowDelta !== 0 && colDelta === 0) {
        setSelectedDirection("down");
      } else if (rowDelta === 0 && colDelta !== 0) {
        setSelectedDirection("across");
      }
    }
  };

  // Move to the next or previous word
  const moveToNextWord = (direction: number) => {
    if (!selectedWordId) return;
    
    const currentIndex = words.findIndex(word => word.id === selectedWordId);
    if (currentIndex === -1) return;
    
    let newIndex = (currentIndex + direction) % words.length;
    if (newIndex < 0) newIndex = words.length - 1;
    
    const newWord = words[newIndex];
    setSelectedWordId(newWord.id);
    setSelectedCell({ row: newWord.row, col: newWord.col });
    setSelectedDirection(newWord.direction);
    
    // Scroll the clue into view
    const clueElement = document.getElementById(`clue-${newWord.id}`);
    if (clueElement && cluesRef.current) {
      cluesRef.current.scrollTop = clueElement.offsetTop - cluesRef.current.offsetTop;
    }
  };

  // Handle clue click
  const handleClueClick = (word: Word) => {
    if (gameStatus !== "playing") {
      return;
    }
    
    setSelectedWordId(word.id);
    setSelectedCell({ row: word.row, col: word.col });
    setSelectedDirection(word.direction);
    
    // Ensure the board is focused
    boardRef.current?.focus();
  };

  // Reset the crossword
  const handleReset = () => {
    const newBoard = board.map(row => 
      row.map(cell => ({
        ...cell,
        char: "",
        isRevealed: false,
      }))
    );
    
    setBoard(newBoard);
    setGameStatus("playing");
    setIsComplete(false);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    // Select the first word if there is one
    if (words.length > 0) {
      setSelectedWordId(words[0].id);
      setSelectedCell({ row: words[0].row, col: words[0].col });
      setSelectedDirection(words[0].direction);
    }
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    if (gameStatus === "playing") {
      setGameStatus("paused");
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    } else if (gameStatus === "paused") {
      setGameStatus("playing");
      const interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  // Reveal the selected cell or word
  const handleReveal = (type: "cell" | "word" | "puzzle") => {
    if (gameStatus !== "playing") return;
    
    const newBoard = [...board];
    
    if (type === "cell" && selectedCell) {
      const { row, col } = selectedCell;
      const selectedWord = words.find(word => word.id === selectedWordId);
      
      if (selectedWord) {
        let letterIndex = -1;
        
        for (let i = 0; i < selectedWord.answer.length; i++) {
          let r = selectedWord.row;
          let c = selectedWord.col;
          
          if (selectedWord.direction === "across") {
            c += i;
          } else {
            r += i;
          }
          
          if (r === row && c === col) {
            letterIndex = i;
            break;
          }
        }
        
        if (letterIndex !== -1) {
          newBoard[row][col].char = selectedWord.answer[letterIndex];
          newBoard[row][col].isRevealed = true;
        }
      }
    } else if (type === "word" && selectedWordId) {
      const selectedWord = words.find(word => word.id === selectedWordId);
      
      if (selectedWord) {
        for (let i = 0; i < selectedWord.answer.length; i++) {
          let r = selectedWord.row;
          let c = selectedWord.col;
          
          if (selectedWord.direction === "across") {
            c += i;
          } else {
            r += i;
          }
          
          newBoard[r][c].char = selectedWord.answer[i];
          newBoard[r][c].isRevealed = true;
        }
      }
    } else if (type === "puzzle") {
      words.forEach(word => {
        for (let i = 0; i < word.answer.length; i++) {
          let r = word.row;
          let c = word.col;
          
          if (word.direction === "across") {
            c += i;
          } else {
            r += i;
          }
          
          newBoard[r][c].char = word.answer[i];
          newBoard[r][c].isRevealed = true;
        }
      });
    }
    
    setBoard(newBoard);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get the words that start with a specific number
  const getWordsByNumber = (number: number, direction: Direction) => {
    return words.filter(word => {
      // Find the cell where this word starts
      const startCell = board[word.row]?.[word.col];
      return startCell?.number === number && word.direction === direction;
    });
  };

  // Get the clue for the selected word
  const getSelectedWordClue = () => {
    if (!selectedWordId) return "";
    
    const word = words.find(w => w.id === selectedWordId);
    return word ? word.clue : "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-10 pb-16">
        <div className="game-container animate-fade-in max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
              <h1 className="text-3xl font-bold">Crossword</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-secondary/30 px-4 py-2 rounded-lg">
                <div className="text-lg font-medium">
                  Time: {formatTime(timer)}
                </div>
              </div>
            </div>
          </div>

          {board.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:flex-1 order-2 lg:order-1">
                <div 
                  ref={boardRef}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  className="outline-none"
                >
                  <div className={`
                      grid grid-cols-${board[0].length} gap-[1px] bg-gray-300 p-1 rounded-md
                      mx-auto max-w-md ${gameStatus === "paused" ? "opacity-50" : ""}
                    `}
                    style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}
                  >
                    {board.map((row, rowIndex) => (
                      row.map((cell, colIndex) => {
                        const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                        const isInSelectedWord = selectedWordId !== null && words.some(word => {
                          if (word.id !== selectedWordId) return false;
                          
                          const { row, col, direction, answer } = word;
                          for (let i = 0; i < answer.length; i++) {
                            let r = row;
                            let c = col;
                            
                            if (direction === "across") {
                              c += i;
                            } else {
                              r += i;
                            }
                            
                            if (r === rowIndex && c === colIndex) {
                              return true;
                            }
                          }
                          return false;
                        });
                        
                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`
                              relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center
                              text-base font-medium ${cell.isBlack ? "bg-gray-900" : "bg-white"}
                              ${isSelected ? "bg-blue-100" : ""} 
                              ${isInSelectedWord && !isSelected ? "bg-blue-50" : ""}
                              ${cell.isRevealed ? "text-red-500" : ""}
                              transition-colors
                            `}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                          >
                            {cell.isBlack ? null : (
                              <>
                                {cell.number && (
                                  <span className="absolute top-0 left-0.5 text-[9px] text-gray-500">
                                    {cell.number}
                                  </span>
                                )}
                                {cell.char}
                              </>
                            )}
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="text-lg font-medium mb-2">
                    {selectedWordId && (
                      <div>
                        <span className="text-gray-600">
                          {getSelectedWordClue()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button 
                      onClick={handleReset} 
                      className="game-control-button"
                    >
                      Restart
                    </button>

                    {gameStatus !== "over" && (
                      <button 
                        onClick={handlePauseResume} 
                        className="game-control-button"
                      >
                        {gameStatus === "playing" ? "Pause" : "Resume"}
                      </button>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReveal("cell")}
                        className="game-control-button"
                        disabled={gameStatus !== "playing" || !selectedCell}
                      >
                        Reveal Cell
                      </button>
                      
                      <button
                        onClick={() => handleReveal("word")}
                        className="game-control-button"
                        disabled={gameStatus !== "playing" || !selectedWordId}
                      >
                        Reveal Word
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                ref={cluesRef}
                className="lg:w-64 order-1 lg:order-2 overflow-y-auto max-h-[70vh] lg:max-h-[600px]"
              >
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <h3 className="text-lg font-semibold mb-3">Across</h3>
                  <ul className="space-y-2">
                    {words
                      .filter(word => word.direction === "across")
                      .map(word => {
                        const cellNumber = board[word.row]?.[word.col]?.number;
                        return (
                          <li 
                            key={word.id}
                            id={`clue-${word.id}`}
                            className={`
                              cursor-pointer text-sm p-1 rounded
                              ${selectedWordId === word.id ? "bg-blue-100" : ""}
                              hover:bg-blue-50 transition-colors
                            `}
                            onClick={() => handleClueClick(word)}
                          >
                            <span className="font-semibold">{cellNumber}.</span> {word.clue}
                          </li>
                        );
                      })}
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Down</h3>
                  <ul className="space-y-2">
                    {words
                      .filter(word => word.direction === "down")
                      .map(word => {
                        const cellNumber = board[word.row]?.[word.col]?.number;
                        return (
                          <li 
                            key={word.id}
                            id={`clue-${word.id}`}
                            className={`
                              cursor-pointer text-sm p-1 rounded
                              ${selectedWordId === word.id ? "bg-blue-100" : ""}
                              hover:bg-blue-50 transition-colors
                            `}
                            onClick={() => handleClueClick(word)}
                          >
                            <span className="font-semibold">{cellNumber}.</span> {word.clue}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {isComplete && (
            <div className="mt-6 text-center">
              <div className="text-xl font-medium text-green-600">
                Congratulations! You've completed the crossword!
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Crossword;
