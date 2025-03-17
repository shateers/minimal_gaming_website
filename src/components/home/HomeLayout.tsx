
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Hero from "./Hero";
import Features from "./Features";
import GameCategory from "./GameCategory";
import { gameCategories } from "../../data/gameCategories";

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10">
        <section className="max-w-7xl mx-auto pb-20">
          <Hero />

          {gameCategories.map((category, categoryIndex) => (
            <GameCategory
              key={category.name}
              name={category.name}
              games={category.games}
              categoryIndex={categoryIndex}
            />
          ))}
        </section>

        <Features />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomeLayout;
