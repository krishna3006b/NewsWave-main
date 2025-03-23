import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Clock, Share2, MessageSquare, ThumbsUp, ThumbsDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  verificationScore: number;
  communityScore: number;
  blockchainHash: string;
  ipfsHash: string;
  comments: number;
  upvotes: number;
  downvotes: number;
}

interface NewsCardProps {
  item: NewsItem;
  compact?: boolean;
}

const getVerificationBadge = (score: number) => {
  if (score >= 0.8) return "verification-badge-true";
  if (score >= 0.5) return "verification-badge-pending";
  return "verification-badge-false";
};

const getVerificationText = (score: number) => {
  if (score >= 0.8) return "Likely True";
  if (score >= 0.5) return "Unverified";
  return "Likely False";
};

const NewsCard: React.FC<NewsCardProps> = ({ item, compact = false }) => {
  const verificationBadgeClass = getVerificationBadge(item.verificationScore);
  const verificationText = getVerificationText(item.verificationScore);
  const scorePercentage = Math.round(item.verificationScore * 100);
  const cleanIpfsHash = item.ipfsHash.replace("ipfs://", "").replace(/\/0$/, "");

  const cardContent = compact ? (
    <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-elevated group">
      <div className="relative">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* <div className="absolute top-3 right-3">
          <div className={cn("verification-badge", verificationBadgeClass)}>
            {scorePercentage}% {verificationText}
          </div>
        </div> */}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{item.content}</p>
        <div className="flex justify-between items-center text-xs text-foreground/60">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {item.date}
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {item.comments}
            </span>
            <span className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {item.upvotes}
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-elevated group">
      <div className="relative">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* <div className="absolute top-4 right-4">
          <div className={cn("verification-badge", verificationBadgeClass)}>
            <Shield className="h-3 w-3 mr-1" />
            {scorePercentage}% {verificationText}
          </div>
        </div> */}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-3">{item.title}</h3>
        <p className="text-foreground/70 mb-5">{item.content}</p>
        
        <div className="flex flex-wrap justify-between items-center border-t border-gray-100 pt-4 text-sm">
          <div className="flex items-center text-foreground/60">
            <Clock className="h-4 w-4 mr-1" />
            {item.date}
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-truthwave-500">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {item.upvotes}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-truthwave-500">
                <ThumbsDown className="h-4 w-4 mr-1" />
                {item.downvotes}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-truthwave-500">
                <MessageSquare className="h-4 w-4 mr-1" />
                {item.comments}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/60 hover:text-truthwave-500">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-foreground/50 font-mono">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>IPFS: {item.ipfsHash}</span>
            <span>TX: {item.blockchainHash}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link
      to={`/article/${cleanIpfsHash}`}
      className="block transition-all duration-300 transform hover:-translate-y-1"
    >
      {cardContent}
    </Link>
  );
};

export default NewsCard;