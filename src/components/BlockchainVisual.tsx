
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const BlockchainVisual: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBlock(prev => (prev + 1) % 5);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { hash: '0xf731…2e19', time: '2 mins ago', articles: 3 },
    { hash: '0x7d9c…98a3', time: '5 mins ago', articles: 7 },
    { hash: '0x3b21…56f7', time: '11 mins ago', articles: 5 },
    { hash: '0x8e47…3c22', time: '18 mins ago', articles: 9 },
    { hash: '0xa103…7f49', time: '27 mins ago', articles: 6 }
  ];

  const getConnectorClass = (index: number) => {
    if (index === activeBlock) return "border-truthwave-500 border-2";
    return "border-gray-200";
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-truthwave-50 text-truthwave-700 font-medium py-1 px-3 rounded-full text-sm inline-block mb-4">
            Blockchain Technology
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Immutable Truth on the Blockchain</h2>
          <p className="text-foreground/70">
            Every piece of content is permanently recorded on the blockchain, creating an unalterable record of information that cannot be censored or deleted.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-row-reverse justify-center mb-16 overflow-x-auto py-6 px-4">
            {blocks.map((block, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className={cn("flex-grow border-t-2 mt-12 mx-3", getConnectorClass(index))} style={{ minWidth: "40px" }}></div>
                )}
                <div 
                  className={cn(
                    "w-48 min-w-48 glass-panel p-4 transition-all",
                    activeBlock === index 
                      ? "border-truthwave-500 border-2 shadow-elevated" 
                      : "opacity-70"
                  )}
                >
                  <div className="text-xs text-foreground/60 mb-1">Block Hash</div>
                  <div className="font-mono text-sm font-bold mb-3">{block.hash}</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground/60">{block.time}</span>
                    <span className="text-truthwave-600 font-semibold">{block.articles} articles</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="relative mb-12">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-16 border-l-2 border-dashed border-truthwave-500"></div>
          </div>

          <div className="glass-panel p-6 shadow-glass max-w-2xl mx-auto">
            <div className="font-mono text-xs text-foreground/60 mb-1">Current Transaction</div>
            <div className="font-mono text-sm font-bold mb-4">0x7b2265...f81a42</div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Content Hash (IPFS)</span>
                <span className="font-mono text-sm">QmZ9...7aPL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Timestamp</span>
                <span className="font-mono text-sm">1625184000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Verification Score</span>
                <span className="font-mono text-sm text-green-600">0.92</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Publisher Address</span>
                <span className="font-mono text-sm">0x58f7...2c91</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainVisual;
