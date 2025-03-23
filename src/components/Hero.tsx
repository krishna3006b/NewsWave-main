
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Zap } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-20 flex items-center">
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-truthwave-300/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-truthwave-300/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="staggered-fade-in">
            <span className="bg-truthwave-50 text-truthwave-700 font-medium py-1 px-3 rounded-full text-sm inline-block mb-4">
              Decentralized Truth Platform
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Share News Without <span className="text-gradient">Fear</span>, Verify With <span className="text-gradient">Transparency</span>
            </h1>
            <p className="text-foreground/70 text-lg mb-8 max-w-lg">
              A blockchain-powered platform for anonymous news sharing with AI-verified truth scores. Making information free, accessible, and verified for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-truthwave-500 hover:bg-truthwave-600 transition-all flex items-center gap-2 h-12 px-6 rounded-lg text-white font-medium">
                Explore Feed
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-truthwave-500 text-truthwave-600 h-12 px-6 rounded-lg font-medium hover:bg-truthwave-50 transition-all">
                Submit News
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-2">
                <Shield className="text-truthwave-600 h-5 w-5" />
                <span className="text-foreground/80 font-medium">Secure & Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="text-truthwave-600 h-5 w-5" />
                <span className="text-foreground/80 font-medium">Blockchain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="text-truthwave-600 h-5 w-5" />
                <span className="text-foreground/80 font-medium">AI Powered</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="glass-panel p-1 rounded-3xl shadow-glass-card relative overflow-hidden animate-float">
              <div className="bg-white rounded-3xl overflow-hidden p-5 pb-0 shadow-subtle">
                <img 
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Journalism illustration" 
                  className="w-full h-auto rounded-t-2xl shadow-subtle object-cover"
                  style={{ maxHeight: '350px' }}
                />
                <div className="absolute top-7 right-7">
                  <div className="verification-badge verification-badge-true animate-pulse-subtle">
                    95% Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
