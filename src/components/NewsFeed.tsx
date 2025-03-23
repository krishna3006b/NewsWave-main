import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { getAllNews, NewsItem as EthereumNewsItem } from "@/lib/ethereum";
import { getFromIPFS, NewsContent } from "@/lib/ipfs";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";

interface NewsItem {
  id: string;
  ipfsHash: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
  author: string;
  verificationScore: number;
  communityScore: number;
  blockchainHash: string;
  comments: number;
  upvotes: number;
  downvotes: number;
  imageUrl?: string;
}

const NewsFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
    
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0].address);
          }
        } catch (error) {
          console.error("Failed to check wallet:", error);
        }
      }
    };
    
    checkWallet();
    
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });
    }
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const newsItems = await getAllNews();
      console.log("Raw news items from blockchain:", newsItems); // Debug log
      
      const newsWithDetails = await Promise.all(
        newsItems.map(async (item) => {
          try {
            const ipfsData: NewsContent = await getFromIPFS(item.ipfsHash);
            console.log("IPFS data for", item.ipfsHash, ":", ipfsData); // Debug log
            const date = new Date(item.timestamp).toLocaleString();
            
            return {
              id: item.ipfsHash,
              ipfsHash: item.ipfsHash,
              title: item.title,
              content: ipfsData.content || "",
              date,
              timestamp: item.timestamp,
              author: item.author,
              verificationScore: ipfsData.verificationScore || 0.5,
              communityScore: 0,
              blockchainHash: item.ipfsHash,
              comments: 0,
              upvotes: 0,
              downvotes: 0,
              imageUrl: undefined,
            };
          } catch (error) {
            console.error("Error fetching IPFS data for", item.ipfsHash, error);
            const date = new Date(item.timestamp).toLocaleString();
            return {
              id: item.ipfsHash,
              ipfsHash: item.ipfsHash,
              title: item.title || "Untitled",
              content: "",
              date,
              timestamp: item.timestamp,
              author: item.author,
              verificationScore: 0.5,
              communityScore: 0,
              blockchainHash: item.ipfsHash,
              comments: 0,
              upvotes: 0,
              downvotes: 0,
              imageUrl: undefined,
            };
          }
        })
      );

      const sortedNews = newsWithDetails.sort((a, b) => b.timestamp - a.timestamp);
      setNews(sortedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Failed to load news",
        description: "There was an error loading the latest news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(item => {
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (verificationFilter === 'verified' && item.verificationScore < 0.8) {
      return false;
    }
    if (verificationFilter === 'unverified' && item.verificationScore >= 0.8) {
      return false;
    }
    
    return true;
  });

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
            <p className="text-foreground/70">Discover blockchain-verified news stories from around the world</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
              <input
                type="text"
                placeholder="Search news..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-truthwave-500 focus:border-transparent w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={verificationFilter === 'verified' ? 'default' : 'outline'} 
                className={verificationFilter === 'verified' ? 'bg-truthwave-500 hover:bg-truthwave-600' : ''}
                onClick={() => setVerificationFilter(verificationFilter === 'verified' ? null : 'verified')}
              >
                <Filter className="h-4 w-4 mr-2" />
                Verified
              </Button>
              <Button 
                variant={verificationFilter === 'unverified' ? 'default' : 'outline'}
                className={verificationFilter === 'unverified' ? 'bg-truthwave-500 hover:bg-truthwave-600' : ''}
                onClick={() => setVerificationFilter(verificationFilter === 'unverified' ? null : 'unverified')}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Unverified
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="h-64 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map(item => (
              <NewsCard key={item.ipfsHash} item={item} />
            ))}
          </div>
        )}
        
        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">No news stories found matching your criteria</p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="border-truthwave-500 text-truthwave-600"
            onClick={fetchNews}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Stories"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;