
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  image_url?: string; 
  index: number;
}

const GameCard = ({ 
  title, 
  description, 
  href, 
  imageSrc, 
  image_url, 
  index 
}: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Prioritize image_url from Supabase, fallback to imageSrc
  const imageSource = image_url || imageSrc;
  
  // Fix 3: Default fallback image path
  const fallbackImage = "/public/placeholder.svg";

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
          className={`relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm
                     transition-all duration-300 h-full
                     ${isHovered ? "shadow-md translate-y-[-5px]" : ""}`}
        >
          <div className="flex flex-col h-full p-5">
            <div className="mb-4 bg-gray-100 rounded-lg h-40 overflow-hidden flex items-center justify-center">
              {imageSource && !imageError ? (
                <img 
                  src={imageSource} 
                  alt={title} 
                  className="w-full h-full object-contain transition-transform duration-700 ease-out"
                  onError={(e) => {
                    console.log("Image load error for:", title);
                    // Fix 2: Set fallback image if original fails
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-gray-100 to-gray-200">
                  <span className="text-xl font-semibold text-gray-500">{title.charAt(0)}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
            
            <div className={`text-sm font-medium transition-all duration-300 
                          inline-flex items-center gap-1 mt-auto
                          ${isHovered ? "text-blue-600" : "text-blue-500"}`}>
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
