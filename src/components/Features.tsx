
import React from 'react';
import { Shield, Database, Eye, Server, FileText, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Shield className="h-8 w-8 text-truthwave-500" />,
    title: 'Anonymous Sharing',
    description: 'Share critical information without revealing your identity. Built-in protections for whistleblowers and journalists at risk.'
  },
  {
    icon: <Database className="h-8 w-8 text-truthwave-500" />,
    title: 'Blockchain Verified',
    description: 'All content is stored on IPFS and verified on the Sepolia blockchain, ensuring it can never be tampered with or deleted.'
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-truthwave-500" />,
    title: 'AI Truth Scoring',
    description: 'Advanced OpenAI algorithms evaluate content and assign a truth probability score to help readers assess credibility.'
  },
  {
    icon: <Eye className="h-8 w-8 text-truthwave-500" />,
    title: 'Community Verification',
    description: 'Users can upvote, downvote and flag content, creating a hybrid human-AI verification system for maximum accuracy.'
  },
  {
    icon: <FileText className="h-8 w-8 text-truthwave-500" />,
    title: 'Multiple Content Types',
    description: 'Share text articles, documents, images, videos, or links—all with the same level of verification and protection.'
  },
  {
    icon: <Server className="h-8 w-8 text-truthwave-500" />,
    title: 'Decentralized Architecture',
    description: 'No central authority controls the platform. Completely resistant to censorship and takedown attempts.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="section-padding py-20 bg-gradient-to-b from-background to-truthwave-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-truthwave-50 text-truthwave-700 font-medium py-1 px-3 rounded-full text-sm inline-block mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Truth in the Digital Age</h2>
          <p className="text-foreground/70">
            TruthWave combines cutting-edge technologies to create a platform where information remains free, verified, and protected from manipulation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel p-8 rounded-xl transition-all duration-300 hover:shadow-elevated"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-truthwave-50 p-3 rounded-lg w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
