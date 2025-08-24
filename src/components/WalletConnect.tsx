import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { connectWallet } from "@/lib/ethereum";
import { truncateAddress } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { WalletDetectionModal } from "./WalletDetectionModal";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        eventName: string,
        callback: (...args: any[]) => void
      ) => void;
      [key: string]: any;
    };
  }
}

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          } else {
            // No account connected, show modal after a short delay
            setTimeout(() => setShowModal(true), 2000);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
          // Show modal if there's an error checking connection
          setTimeout(() => setShowModal(true), 2000);
        }
      } else {
        // No wallet detected, show modal after a short delay
        setTimeout(() => setShowModal(true), 2000);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast({
            title: "Wallet Connected",
            description: `Connected to ${truncateAddress(accounts[0])}`,
          });
        } else {
          setAccount(null);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
            variant: "destructive",
          });
          // Show modal when wallet is disconnected
          setTimeout(() => setShowModal(true), 2000);
        }
      });
    }
  }, []);

  const handleConnect = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setAccount(address);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${truncateAddress(address)}`,
      });
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

  const handleWalletConnected = (address: string) => {
    setAccount(address);
    setShowModal(false);
  };

  return (
    <div>
      {account ? (
        <Button variant="outline" className="glass">
          {truncateAddress(account)}
        </Button>
      ) : (
        <Button onClick={() => setShowModal(true)} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}

      <WalletDetectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onWalletConnected={handleWalletConnected}
      />
    </div>
  );
}
