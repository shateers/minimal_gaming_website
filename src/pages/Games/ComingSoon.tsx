
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import FadeIn from "../../components/animations/FadeIn";

const ComingSoon = () => {
  const { gameName } = useParams();
  const formattedGameName = gameName 
    ? gameName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "This Game";

  useEffect(() => {
    document.title = `${formattedGameName} - Coming Soon - Shateer Games`;
  }, [formattedGameName]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-10 pb-16 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {formattedGameName} - Coming Soon!
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="mb-8 p-12 rounded-2xl bg-white border border-border">
              <div className="text-6xl mb-6">🎮</div>
              <p className="text-lg text-muted-foreground mb-6">
                We're working hard to bring you this exciting game soon. 
                Stay tuned for updates!
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <span className="mr-2">←</span> Back to games
              </Link>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="text-muted-foreground text-sm">
              Want to get notified when this game launches? Sign up for our newsletter!
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
