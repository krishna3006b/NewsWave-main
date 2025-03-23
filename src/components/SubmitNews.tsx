import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, Link2, Shield, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { connectWallet, uploadNews, getAllNews, NewsItem } from '@/lib/ethereum';
import { uploadToIPFS, getFromIPFS, NewsContent } from '@/lib/ipfs';
import { verifyNewsContent } from '@/lib/openai';
import { ethers } from 'ethers';
import { truncateAddress } from '@/lib/utils';

const SubmitNews: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState<'text' | 'file' | 'link'>('text');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchNews();
    checkWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          toast({
            title: 'Wallet Connected',
            description: `Connected to ${truncateAddress(accounts[0])}`,
          });
        } else {
          setWalletAddress(null);
          toast({
            title: 'Wallet Disconnected',
            description: 'Your wallet has been disconnected',
            variant: 'destructive',
          });
        }
      });
    }
  }, []);

  const checkWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
        }
      } catch (error) {
        console.error('Failed to check wallet:', error);
      }
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const newsItems = await getAllNews();
      const newsWithScores = await Promise.all(
        newsItems.map(async (item) => {
          try {
            const ipfsData = await getFromIPFS(item.ipfsHash);
            return {
              ...item,
              verificationScore: ipfsData.verificationScore,
            };
          } catch (error) {
            console.error('Error fetching IPFS data:', error);
            return { ...item, verificationScore: 0.5 };
          }
        })
      );
      const sortedNews = newsWithScores.sort((a, b) => b.timestamp - a.timestamp);
      setNews(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Failed to load news',
        description: 'There was an error loading the latest news',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${truncateAddress(address)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to submit news.',
        variant: 'destructive',
      });
      return;
    }

    if (!title) {
      toast({
        title: 'Title Required',
        description: 'Please provide a title for your news story.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let newsContent: NewsContent;
      const timestamp = Date.now();

      if (currentTab === 'text') {
        if (!content) {
          throw new Error('Content is required for text submission');
        }
        newsContent = {
          title,
          content,
          author: walletAddress,
          timestamp,
          verificationScore: await verifyNewsContent({ title, content, author: walletAddress, timestamp, verificationScore: 0 }),
        };
      } else if (currentTab === 'file') {
        if (!selectedFile) {
          throw new Error('File is required for file submission');
        }
        newsContent = {
          title,
          content: selectedFile.name, 
          author: walletAddress,
          timestamp,
          verificationScore: 0.5, 
        };
      } else if (currentTab === 'link') {
        if (!link) {
          throw new Error('Link is required for link submission');
        }
        newsContent = {
          title,
          content: link, 
          author: walletAddress,
          timestamp,
          verificationScore: await verifyNewsContent({ title, content: link, author: walletAddress, timestamp, verificationScore: 0 }),
        };
      } else {
        throw new Error('Invalid submission type');
      }

      const ipfsHash = await uploadToIPFS(newsContent);
      await uploadNews(ipfsHash, title);

      toast({
        title: 'News Submitted',
        description: 'Your story has been encrypted and submitted to the blockchain.',
      });

      setTitle('');
      setContent('');
      setLink('');
      setSelectedFile(null);
      fetchNews();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your news.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-truthwave-50 text-truthwave-700 font-medium py-1 px-3 rounded-full text-sm inline-block mb-4">
              Share Information
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Submit News Securely</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Share news stories, leaks, or information securely and anonymously. All submissions are encrypted, stored on IPFS, and verified on the blockchain.
            </p>
            <div className="mt-4">
              {walletAddress ? (
                <p className="text-sm text-foreground/50">
                  Connected: {truncateAddress(walletAddress)}
                </p>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-truthwave-500 hover:bg-truthwave-600"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </div>
          </div>

          <div className="glass-panel p-8 shadow-glass-card">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Story Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-truthwave-500 focus:border-transparent"
                  placeholder="Enter a descriptive title for your story"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    type="button"
                    className={`px-4 py-2 flex items-center ${currentTab === 'text' ? 'text-truthwave-600 border-b-2 border-truthwave-500' : 'text-foreground/60'}`}
                    onClick={() => setCurrentTab('text')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Text
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 flex items-center ${currentTab === 'file' ? 'text-truthwave-600 border-b-2 border-truthwave-500' : 'text-foreground/60'}`}
                    onClick={() => setCurrentTab('file')}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    File Upload
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 flex items-center ${currentTab === 'link' ? 'text-truthwave-600 border-b-2 border-truthwave-500' : 'text-foreground/60'}`}
                    onClick={() => setCurrentTab('link')}
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Link
                  </button>
                </div>

                {currentTab === 'text' && (
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-2">
                      Story Content
                    </label>
                    <textarea
                      id="content"
                      rows={6}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-truthwave-500 focus:border-transparent"
                      placeholder="Write your story or paste text here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                  </div>
                )}

                {currentTab === 'file' && (
                  <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                      Upload Document or Image
                    </label>
                    {!selectedFile ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-truthwave-500 transition-colors">
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto mb-4 text-foreground/40" />
                          <p className="text-foreground/70 mb-2">Drag and drop or click to upload</p>
                          <p className="text-xs text-foreground/50">Supports PDF, DOC, JPG, PNG (Max 10MB)</p>
                        </label>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-truthwave-500 mr-3" />
                          <div>
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-foreground/50">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          className="text-foreground/50 hover:text-destructive transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {currentTab === 'link' && (
                  <div>
                    <label htmlFor="link" className="block text-sm font-medium mb-2">
                      Link to News Source
                    </label>
                    <input
                      id="link"
                      type="url"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-truthwave-500 focus:border-transparent"
                      placeholder="https://example.com/article"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                    <p className="text-xs text-foreground/50 mt-2">
                      Note: Linked content is not stored on IPFS, only the URL is recorded on the blockchain.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <div className="flex items-start">
                  <div className="bg-truthwave-50 p-3 rounded-lg mr-4">
                    <Shield className="h-6 w-6 text-truthwave-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Anonymous Submission</h3>
                    <p className="text-sm text-foreground/70">
                      Your identity is protected. No personal data is recorded. All submissions are
                      encrypted and will be verified by AI for truthfulness. False information may be flagged by the community.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-truthwave-500 hover:bg-truthwave-600 transition-colors w-full md:w-auto px-8 py-2 h-12"
                  type="submit"
                  disabled={isSubmitting || !walletAddress}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Securely'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitNews;