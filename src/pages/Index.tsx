
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BlockchainVisual from '@/components/BlockchainVisual';
import NewsFeed from '@/components/NewsFeed';
import SubmitNews from '@/components/SubmitNews';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <BlockchainVisual />
        <NewsFeed />
        <SubmitNews />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
