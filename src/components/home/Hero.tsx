
import FadeIn from "../animations/FadeIn";

const Hero = () => {
  return (
    <div className="text-center mb-16">
      <FadeIn>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Minimalist Gaming Experience
        </h1>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Enjoy classic games with a clean, distraction-free design. 
          No ads, no clutter—just pure gameplay.
        </p>
      </FadeIn>
    </div>
  );
};

export default Hero;
