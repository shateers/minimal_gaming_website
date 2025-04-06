import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, profile } = useAuth();
  
  // Check if user has admin privileges
  const isAdmin = profile?.is_admin === true;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Shateer Games
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/leaderboard" className="hover:text-primary transition-colors">
            Leaderboard
          </Link>
          
          {!loading && isAdmin && (
            <Link to="/admin/games" className="hover:text-primary transition-colors">
              Admin
            </Link>
          )}
          
          {!loading && !user ? (
            <>
              <Link
                to="/signin"
                className="hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md"
              >
                Sign Up
              </Link>
              <Link
                to="/admin/signin"
                className="hover:text-primary transition-colors text-sm"
              >
                Admin Login
              </Link>
            </>
          ) : !loading && user ? (
            <Link
              to="/profile"
              className="hover:text-primary transition-colors"
            >
              My Profile
            </Link>
          ) : null}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <span className="text-2xl">×</span>
          ) : (
            <span className="text-2xl">≡</span>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-primary transition-colors py-1"
            >
              Home
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-primary transition-colors py-1"
            >
              Leaderboard
            </Link>
            
            {isAdmin && (
              <Link
                to="/admin/games"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-primary transition-colors py-1"
              >
                Admin
              </Link>
            )}
            
            {!loading && !user ? (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-primary transition-colors py-1"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md inline-block w-fit"
                >
                  Sign Up
                </Link>
              </>
            ) : !loading && user ? (
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-primary transition-colors py-1"
              >
                My Profile
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
