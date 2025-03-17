
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  index: number;
}

const GameCard = ({ title, description, href, imageSrc, index }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardRef.current!);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`opacity-0 transform translate-y-10 ${
        isVisible ? "animate-slide-in" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link
        to={href}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative rounded-2xl overflow-hidden border border-border bg-white shadow-sm
                     transition-all duration-500 ease-out p-6 h-full
                     ${isHovered ? "shadow-md scale-[1.02] border-[#C84B31]/30" : ""}`}
        >
          <div className="flex flex-col h-full">
            <div className="mb-4 bg-secondary/50 rounded-xl h-40 overflow-hidden">
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={title} 
                  className="w-full h-full object-contain transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  {title}
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
            
            <div className={`text-sm font-medium transition-all duration-300 
                          relative inline-flex items-center gap-1
                          ${isHovered ? "translate-x-1 text-[#C84B31] font-semibold" : ""}`}>
              Play now
              <span className="transition-transform duration-300 transform" style={{ 
                marginLeft: '4px',
                transform: isHovered ? 'translateX(3px)' : 'translateX(0)' 
              }}>→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GameCard;
