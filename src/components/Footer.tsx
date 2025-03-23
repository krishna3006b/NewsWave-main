
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-truthwave-50/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-bold tracking-tighter text-gradient">TruthWave</span>
            </Link>
            <p className="text-foreground/70 mb-6 max-w-md">
              A decentralized, blockchain-based news platform that enables anonymous sharing with AI-verified trust scores. Empowering truth in the digital age.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/50 hover:text-truthwave-500 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-foreground/50 hover:text-truthwave-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-foreground/50 hover:text-truthwave-500 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/feed" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  News Feed
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  Submit News
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  Blockchain Explorer
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  IPFS Gateway
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-truthwave-600 transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-sm text-foreground/60">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-4 w-4 mr-2 text-truthwave-500" />
              <span>
                Protected by blockchain technology. All content is immutable and verified.
              </span>
            </div>
            <div>
              <span>&copy; {new Date().getFullYear()} NewsWave. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
