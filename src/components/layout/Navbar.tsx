
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4 
                ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-semibold tracking-tight transition-transform hover:scale-105"
        >
          GameHub
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/games/tic-tac-toe">Tic Tac Toe</NavLink>
          <NavLink to="/games/snake">Snake</NavLink>
        </nav>

        <div className="md:hidden">
          {/* Mobile menu button - could be expanded in the future */}
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="relative text-foreground/80 font-medium hover:text-foreground transition-colors
                after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]
                after:bg-primary after:origin-center after:scale-x-0 hover:after:scale-x-100
                after:transition-transform after:duration-300"
    >
      {children}
    </Link>
  );
};

export default Navbar;
