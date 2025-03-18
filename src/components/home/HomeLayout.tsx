
import { useState, useMemo } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Hero from "./Hero";
import Features from "./Features";
import GameCategory from "./GameCategory";
import SearchBar from "./SearchBar";
import { gameCategories } from "../../data/gameCategories";

const HomeLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return gameCategories;

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    
    return gameCategories.map(category => ({
      ...category,
      games: category.games.filter(game => 
        game.title.toLowerCase().includes(lowercaseSearchTerm) || 
        game.description.toLowerCase().includes(lowercaseSearchTerm)
      )
    })).filter(category => category.games.length > 0);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const hasResults = filteredCategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10">
        <section className="max-w-7xl mx-auto pb-20">
          <Hero />
          
          <SearchBar onSearch={handleSearch} />

          {hasResults ? (
            filteredCategories.map((category, categoryIndex) => (
              <GameCategory
                key={category.name}
                name={category.name}
                games={category.games}
                categoryIndex={categoryIndex}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-muted-foreground">
                No games found matching "{searchTerm}"
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try a different search term or browse our categories
              </p>
            </div>
          )}
        </section>

        <Features />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomeLayout;
