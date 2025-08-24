import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Download, AlertCircle } from "lucide-react";
import { connectWallet } from "@/lib/ethereum";
import { toast } from "@/hooks/use-toast";
import { truncateAddress } from "@/lib/utils";

interface WalletDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (address: string) => void;
}

export function WalletDetectionModal({
  isOpen,
  onClose,
  onWalletConnected,
}: WalletDetectionModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    // Check if wallet is available
    setHasWallet(!!window.ethereum);
  }, []);

  const handleConnect = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      const address = await connectWallet();
      onWalletConnected(address);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${truncateAddress(address)}`,
      });
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInstallWallet = () => {
    // Open MetaMask installation page
    window.open("https://metamask.io/download/", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {hasWallet ? "Connect Your Wallet" : "Install a Wallet"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {hasWallet ? (
            <>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to access NewsWave's decentralized news
                platform. You'll be able to submit news, verify articles, and
                interact with the blockchain.
              </p>

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>

              <Button variant="outline" onClick={onClose} className="w-full">
                Maybe Later
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  No wallet detected. You need to install a Web3 wallet to use
                  NewsWave.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                We recommend MetaMask, a secure and popular Web3 wallet that
                allows you to interact with decentralized applications.
              </p>

              <Button
                onClick={handleInstallWallet}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Install MetaMask
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                After installation, refresh the page to connect your wallet.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
