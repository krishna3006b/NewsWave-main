import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatDate, truncateAddress } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Article = () => {
  const { id } = useParams<{ id: string }>(); 
  const [article, setArticle] = useState<{
    title: string;
    content: string;
    author: string;
    timestamp: number;
    verificationScore?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [ipfsHash, setIpfsHash] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const fullIpfsHash = `ipfs://${id}`;
        setIpfsHash(fullIpfsHash);

        console.log("Fetching IPFS content for hash:", id);
        const response = await fetch(`https://ipfs.io/ipfs/${id}/0`); 
        if (!response.ok) {
          throw new Error(`IPFS fetch failed with status: ${response.status}`);
        }
        const data = await response.json();

        setArticle({
          title: data.title,
          content: data.content,
          author: data.author,
          timestamp: data.timestamp,
          verificationScore: data.verificationScore,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          title: "Failed to load article",
          description: "There was an error loading the article",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const shareArticle = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: article?.title || "NewsWave Article",
          text: "Check out this verified news article on NewsWave",
          url: url,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        });
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-20 md:pt-24 pb-12 md:pb-16 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm mb-6 md:mb-8 hover:text-primary transition-colors duration-200 ease-in-out"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to all news</span>
          </Link>

          {loading ? (
            <div className="space-y-6">
              <div className="h-8 w-full md:w-2/3 bg-muted/40 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-muted/40 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-muted/40 rounded animate-pulse" />
              <div className="h-96 bg-muted/30 rounded-lg animate-pulse mt-8" />
            </div>
          ) : article ? (
            <div className="animate-in fade-in duration-500 ease-in-out">
              <div className="flex flex-col gap-4 mb-8 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base">
                  <div className="text-muted-foreground">
                    By {truncateAddress(article.author)}
                  </div>

                  <div className="text-muted-foreground">
                    {formatDate(article.timestamp)}
                  </div>

                  {article.verificationScore !== undefined && (
                    <VerificationBadge score={article.verificationScore} />
                  )}
                </div>
              </div>

              <Card className="p-4 sm:p-6 md:p-8 mb-8 md:mb-12 prose prose-neutral dark:prose-invert max-w-none shadow-sm border-opacity-50">
                <div className="whitespace-pre-line text-base md:text-lg leading-relaxed">
                  {article.content}
                </div>
              </Card>

              <Card className="rounded-lg border p-4 sm:p-6 md:p-8 bg-card shadow-sm overflow-hidden">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Verification Details</h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium mb-1.5 text-muted-foreground">Content Hash (IPFS)</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="bg-muted px-2 py-1.5 rounded text-sm font-mono break-all">
                        {ipfsHash}
                      </code>
                      <a
                        href={`https://ipfs.io/ipfs/${id}/0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors duration-200"
                        title="View on IPFS"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1.5 text-muted-foreground">Verification Score</p>
                    <p>
                      {article.verificationScore !== undefined ? (
                        <VerificationBadge score={article.verificationScore} size="lg" />
                      ) : (
                        "Not verified"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1.5 text-muted-foreground">Timestamp</p>
                    <p className="font-medium">{formatDate(article.timestamp)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1.5 text-muted-foreground">Author Address</p>
                    <code className="bg-muted px-2 py-1.5 rounded text-sm font-mono break-all inline-block max-w-full">
                      {article.author}
                    </code>
                  </div>
                </div>

                <Separator className="my-6 md:my-8 opacity-50" />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={shareArticle}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-muted/50 transition-colors duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <h2 className="text-2xl font-bold mb-3">Article Not Found</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                The article you're looking for doesn't exist or couldn't be loaded.
              </p>
              <Button asChild className="transition-all duration-200 hover:shadow-md">
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 md:py-8 border-t border-opacity-40">
        <div className="container text-center text-sm text-muted-foreground">
          <p>VerifyVault — Truth, verified and preserved on the blockchain</p>
        </div>
      </footer>
    </div>
  );
};

export default Article;
