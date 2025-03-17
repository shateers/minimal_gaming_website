
import FadeIn from "../animations/FadeIn";

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto py-16 border-t border-border">
      <FadeIn>
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
          Why Choose Shateer Games?
        </h2>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FadeIn delay={0.1}>
          <div className="p-6 rounded-2xl bg-white border border-border">
            <h3 className="text-xl font-semibold mb-3">Distraction-Free</h3>
            <p className="text-muted-foreground">
              Clean interface with no ads, pop-ups, or unnecessary elements to distract from your gameplay.
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <div className="p-6 rounded-2xl bg-white border border-border">
            <h3 className="text-xl font-semibold mb-3">Responsive Design</h3>
            <p className="text-muted-foreground">
              Enjoy your favorite games on any device with our fully responsive design.
            </p>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <div className="p-6 rounded-2xl bg-white border border-border">
            <h3 className="text-xl font-semibold mb-3">Optimized Performance</h3>
            <p className="text-muted-foreground">
              Lightning-fast loading times and smooth gameplay for the best gaming experience.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Features;
