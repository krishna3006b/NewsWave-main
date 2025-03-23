
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { WalletConnect } from './WalletConnect.tsx';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-subtle' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center"
        >
          <span className="text-2xl font-bold tracking-tighter text-gradient">
            NewsWave
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-truthwave-600 transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-foreground/80 hover:text-truthwave-600 transition-colors font-medium"
          >
            About
          </Link>
          <Link 
            to="/feed" 
            className="text-foreground/80 hover:text-truthwave-600 transition-colors font-medium"
          >
            News Feed
          </Link>
          <Button 
            className="bg-truthwave-500 hover:bg-truthwave-600 transition-colors"
          >
            Submit News
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-subtle p-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-truthwave-600 transition-colors font-medium px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-foreground/80 hover:text-truthwave-600 transition-colors font-medium px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/feed" 
              className="text-foreground/80 hover:text-truthwave-600 transition-colors font-medium px-4 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              News Feed
            </Link>
            <Button 
              className="bg-truthwave-500 hover:bg-truthwave-600 transition-colors w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit News
            </Button>
          </div>
          <WalletConnect/>
        </div>
      )}
    </header>
  );
};

export default Navbar;
