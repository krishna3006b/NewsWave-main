import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Smartphone, Chrome, Download, AlertCircle } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import type { WalletConnectionMethod } from "@/contexts/WalletContext";
import { cn } from "@/lib/utils";

interface WalletDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletDetectionModal({
  isOpen,
  onClose,
}: WalletDetectionModalProps) {
  const {
    hasBrowserWallet,
    isConnecting,
    connectBrowserWallet,
    connectWalletConnect,
    error,
    resetError,
  } = useWallet();
  const [pendingMethod, setPendingMethod] =
    useState<WalletConnectionMethod | null>(null);

  useEffect(() => {
    if (!isOpen) {
      resetError();
      setPendingMethod(null);
    }
  }, [isOpen, resetError]);

  const handleBrowserWalletConnect = async () => {
    setPendingMethod("browser");
    try {
      await connectBrowserWallet();
      onClose();
    } catch (error) {
      console.error("Browser wallet connection error:", error);
    } finally {
      setPendingMethod(null);
    }
  };

  const handleWalletConnectConnect = async () => {
    setPendingMethod("walletconnect");
    try {
      await connectWalletConnect();
      onClose();
    } catch (error) {
      console.error("WalletConnect error:", error);
    } finally {
      setPendingMethod(null);
    }
  };

  const handleInstallMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto"
        aria-describedby="wallet-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Wallet className="h-6 w-6 sm:h-7 sm:w-7 text-truthwave-600" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription id="wallet-modal-description">
            Choose your preferred connection method to access NewsWave's decentralized platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground bg-truthwave-50 p-3 rounded-lg border border-truthwave-100">
            <p className="leading-relaxed">
              Connect your wallet to submit news, verify articles, and interact
              with the blockchain-powered NewsWave platform.
            </p>
          </div>

          {hasBrowserWallet ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground/80 uppercase tracking-wide">
                Available Options
              </h3>
              
              <Button
                onClick={handleBrowserWalletConnect}
                disabled={isConnecting || pendingMethod !== null}
                className={cn(
                  "w-full h-auto py-4 px-4 flex items-center justify-start gap-4",
                  "bg-gradient-to-r from-truthwave-500 to-truthwave-600",
                  "hover:from-truthwave-600 hover:to-truthwave-700",
                  "text-white shadow-md transition-all duration-200",
                  "focus:ring-2 focus:ring-truthwave-500 focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex-shrink-0">
                  <Chrome className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="font-semibold text-base sm:text-lg">
                    {pendingMethod === "browser"
                      ? "Connecting..."
                      : "Browser Wallet"}
                  </span>
                  <span className="text-xs sm:text-sm text-white/80 text-left">
                    MetaMask, Coinbase, or other browser extension
                  </span>
                </div>
              </Button>

              <Button
                onClick={handleWalletConnectConnect}
                disabled={isConnecting || pendingMethod !== null}
                variant="outline"
                className={cn(
                  "w-full h-auto py-4 px-4 flex items-center justify-start gap-4",
                  "border-2 border-truthwave-200 hover:border-truthwave-400",
                  "hover:bg-truthwave-50 transition-all duration-200",
                  "focus:ring-2 focus:ring-truthwave-500 focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-truthwave-100 rounded-lg flex-shrink-0">
                  <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-truthwave-700" />
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="font-semibold text-base sm:text-lg text-foreground">
                    {pendingMethod === "walletconnect"
                      ? "Opening..."
                      : "WalletConnect"}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground text-left">
                    Mobile wallets via QR code or deep link
                  </span>
                </div>
              </Button>

              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full mt-2 hover:bg-gray-100"
                disabled={isConnecting || pendingMethod !== null}
              >
                Maybe Later
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    No Browser Wallet Detected
                  </p>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                    To use NewsWave, you'll need a Web3 wallet. We recommend
                    MetaMask for desktop or WalletConnect for mobile devices.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleInstallMetaMask}
                  className={cn(
                    "w-full h-auto py-4 px-4 flex items-center justify-start gap-4",
                    "bg-gradient-to-r from-amber-500 to-amber-600",
                    "hover:from-amber-600 hover:to-amber-700",
                    "text-white shadow-md transition-all duration-200"
                  )}
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex-shrink-0">
                    <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-semibold text-base sm:text-lg">
                      Install MetaMask
                    </span>
                    <span className="text-xs sm:text-sm text-white/80 text-left">
                      Most popular Web3 wallet for browsers
                    </span>
                  </div>
                </Button>

                <Button
                  onClick={handleWalletConnectConnect}
                  disabled={isConnecting || pendingMethod !== null}
                  variant="outline"
                  className={cn(
                    "w-full h-auto py-4 px-4 flex items-center justify-start gap-4",
                    "border-2 border-truthwave-200 hover:border-truthwave-400",
                    "hover:bg-truthwave-50 transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-truthwave-100 rounded-lg flex-shrink-0">
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-truthwave-700" />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-semibold text-base sm:text-lg text-foreground">
                      {pendingMethod === "walletconnect"
                        ? "Opening..."
                        : "Use Mobile Wallet"}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground text-left">
                      Connect via WalletConnect QR code
                    </span>
                  </div>
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4 px-2">
                After installing MetaMask, refresh this page to connect your
                wallet.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
