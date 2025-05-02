
import FadeIn from "../animations/FadeIn";
import GameCard from "../layout/GameCard";

interface Game {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  image_url?: string; // Add support for Supabase image URLs
}

interface GameCategoryProps {
  name: string;
  games: Game[];
  categoryIndex: number;
}

const GameCategory = ({ name, games, categoryIndex }: GameCategoryProps) => {
  return (
    <div className="mb-16">
      <FadeIn delay={0.1 * categoryIndex}>
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200 text-gray-800">
          {name}
        </h2>
      </FadeIn>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game, index) => (
          <GameCard
            key={game.title}
            title={game.title}
            description={game.description}
            href={game.href}
            imageSrc={game.imageSrc}
            image_url={game.image_url}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default GameCategory;
