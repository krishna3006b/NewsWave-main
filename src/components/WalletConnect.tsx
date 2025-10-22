import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { truncateAddress, cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";
import { WalletDetectionModal } from "./WalletDetectionModal";
import { Wallet, LogOut, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectProps {
  variant?: "desktop" | "mobile";
}

export function WalletConnect({ variant = "desktop" }: WalletConnectProps) {
  const {
    account,
    isConnecting,
    disconnect,
    connectionMethod,
  } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const connectButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileSwitchButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const isMobileVariant = variant === "mobile";

  const connectionLabel =
    connectionMethod === "walletconnect" ? "WalletConnect" : "Browser Wallet";

  const openModalFromTrigger = (trigger?: HTMLButtonElement | null) => {
    activeTriggerRef.current = trigger ?? null;
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);

    const fallbackTrigger =
      activeTriggerRef.current ??
      (account
        ? isMobileVariant
          ? mobileSwitchButtonRef.current
          : dropdownTriggerRef.current
        : connectButtonRef.current);

    activeTriggerRef.current = null;
    fallbackTrigger?.focus({ preventScroll: true });
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast({
        title: "Disconnect Failed",
        description: "There was an error disconnecting your wallet.",
        variant: "destructive",
      });
    }
  };

  const handleCopyAddress = async () => {
    if (!account) return;

    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const modal = (
    <WalletDetectionModal isOpen={showModal} onClose={handleModalClose} />
  );

  if (account) {
    if (isMobileVariant) {
      return (
        <>
          <div className="w-full space-y-3">
            <div className="rounded-xl border border-truthwave-200 bg-white/80 px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Connected Account
                  </p>
                  <p className="font-mono text-sm sm:text-base text-foreground">
                    {truncateAddress(account)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    via {connectionLabel}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-truthwave-50"
                  onClick={handleCopyAddress}
                  aria-label={copied ? "Address copied" : "Copy wallet address"}
                >
                  {copied ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                ref={mobileSwitchButtonRef}
                onClick={(event) =>
                  openModalFromTrigger(event.currentTarget)
                }
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Switch Wallet</span>
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </Button>
            </div>
          </div>
          {modal}
        </>
      );
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={dropdownTriggerRef}
              variant="outline"
              className="glass flex items-center gap-2 border-truthwave-200 hover:bg-truthwave-50 focus:ring-2 focus:ring-truthwave-500 transition-all"
            >
              <Wallet className="h-4 w-4 text-truthwave-600" />
              <span>{truncateAddress(account)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="text-xs uppercase text-muted-foreground">
                Connected via {connectionLabel}
              </span>
              <span className="font-mono text-sm text-foreground">
                {truncateAddress(account)}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCopyAddress}
              className="cursor-pointer focus:bg-truthwave-50"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Address</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => openModalFromTrigger(dropdownTriggerRef.current)}
              className="cursor-pointer focus:bg-truthwave-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Switch Wallet</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {modal}
      </>
    );
  }

  return (
    <>
      <Button
        ref={connectButtonRef}
        onClick={(event) => openModalFromTrigger(event.currentTarget)}
        disabled={isConnecting}
        className={cn(
          "bg-truthwave-500 hover:bg-truthwave-600 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-truthwave-500 focus:ring-offset-2",
          isMobileVariant && "w-full justify-center py-3 text-base"
        )}
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </span>
        <span className="sm:hidden">
          {isConnecting ? "..." : "Connect"}
        </span>
      </Button>
      {modal}
    </>
  );
}
