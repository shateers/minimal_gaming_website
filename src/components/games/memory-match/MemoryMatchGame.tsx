
import { useState, useEffect } from 'react';
import { useMemoryMatchGame, Card } from '../../../hooks/games/memory-match/useMemoryMatchGame';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MemoryMatchGame = () => {
  const {
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
    togglePause
  } = useMemoryMatchGame();

  const [animateMatches, setAnimateMatches] = useState(false);

  useEffect(() => {
    if (matches > 0) {
      setAnimateMatches(true);
      const timeout = setTimeout(() => setAnimateMatches(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [matches]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <div className="bg-secondary/30 px-4 py-2 rounded-lg">
            <div className="text-lg font-medium">
              Time: {formatTime(timer)}
            </div>
          </div>
          
          <div className="bg-secondary/30 px-4 py-2 rounded-lg">
            <div className="text-lg font-medium">
              Moves: {moves}
            </div>
          </div>
          
          <div className="bg-secondary/30 px-4 py-2 rounded-lg">
            <div className="text-lg font-medium">
              Score: {score}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue={difficulty} onValueChange={(value) => changeDifficulty(value as any)}>
          <TabsList>
            <TabsTrigger value="easy" disabled={gameStatus === 'playing'}>Easy</TabsTrigger>
            <TabsTrigger value="medium" disabled={gameStatus === 'playing'}>Medium</TabsTrigger>
            <TabsTrigger value="hard" disabled={gameStatus === 'playing'}>Hard</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-4 flex items-center justify-center">
        <div className={`text-xl font-semibold ${animateMatches ? 'animate-pulse text-green-600' : ''}`}>
          Matches: {matches}/{totalPairs}
        </div>
      </div>
      
      {gameStatus === 'ready' ? (
        <div className="text-center mb-8">
          <p className="mb-4 text-lg">Match all the pairs of cards before time runs out!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameStatus === 'completed' ? (
        <div className="text-center p-6 bg-green-100 text-green-800 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-2">
            {matches === totalPairs ? 'Congratulations! 🎉' : 'Time\'s Up! ⏰'}
          </h3>
          <p className="mb-2">
            {matches === totalPairs 
              ? `You matched all pairs in ${moves} moves with ${formatTime(timer)} remaining!`
              : `You matched ${matches} out of ${totalPairs} pairs.`}
          </p>
          <p className="text-2xl font-bold mb-4">Score: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : null}
      
      <div className={`grid gap-4 ${difficulty === 'easy' ? 'grid-cols-3 sm:grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4 sm:grid-cols-5' : 'grid-cols-5 sm:grid-cols-6'}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`
              cursor-pointer transform transition-all duration-300
              ${gameStatus !== 'playing' ? 'pointer-events-none' : ''}
              ${card.isMatched ? 'scale-90 opacity-70' : card.isFlipped ? 'rotate-y-180' : ''}
            `}
            onClick={() => handleCardFlip(card)}
          >
            <div className="card-inner w-16 h-16 sm:w-20 sm:h-20 rounded-lg shadow-md perspective-500">
              <div className={`
                absolute w-full h-full backface-hidden transition-transform duration-500 flex items-center justify-center text-2xl sm:text-3xl
                ${card.isFlipped ? 'rotate-y-180' : ''}
              `}>
                {card.isFlipped || card.isMatched ? (
                  <div className="w-full h-full bg-white rounded-lg border-2 border-primary flex items-center justify-center">
                    {card.value}
                  </div>
                ) : (
                  <div className="w-full h-full bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                    ?
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors"
        >
          Reset
        </button>
        
        {(gameStatus === 'playing' || gameStatus === 'paused') && (
          <button
            onClick={togglePause}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-sm hover:bg-secondary/90 transition-colors"
          >
            {gameStatus === 'playing' ? 'Pause' : 'Resume'}
          </button>
        )}
      </div>
      
      <style jsx>{`
        .perspective-500 {
          perspective: 500px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MemoryMatchGame;
