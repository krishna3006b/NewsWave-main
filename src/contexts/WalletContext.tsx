import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { toast } from "@/hooks/use-toast";
import { truncateAddress } from "@/lib/utils";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export type WalletConnectionMethod = "browser" | "walletconnect";

interface WalletContextType {
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectionMethod: WalletConnectionMethod | null;
  error: string | null;
  connectBrowserWallet: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: (options?: { silent?: boolean }) => Promise<void>;
  hasBrowserWallet: boolean;
  resetError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

type WalletConnectListeners = {
  accountsChanged?: (accounts: string[]) => void;
  disconnect?: () => void;
  sessionDelete?: () => void;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMethod, setConnectionMethod] =
    useState<WalletConnectionMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasBrowserWallet, setHasBrowserWallet] = useState(false);

  const walletConnectProviderRef = useRef<EthereumProvider | null>(null);
  const walletConnectListenersRef = useRef<WalletConnectListeners>({});
  const originalEthereumRef = useRef<any>(undefined);

  useEffect(() => {
    originalEthereumRef.current = window.ethereum;
    setHasBrowserWallet(!!window.ethereum);

    checkExistingBrowserConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnectionMethod("browser");
          toast({
            title: "Wallet Connected",
            description: `Connected to ${truncateAddress(accounts[0])}`,
          });
        } else {
          handleDisconnect({ silent: true });
        }
      };

      const handleDisconnectEvent = () => {
        handleDisconnect({ silent: true });
      };

      window.ethereum.on?.("accountsChanged", handleAccountsChanged);
      window.ethereum.on?.("disconnect", handleDisconnectEvent);

      return () => {
        window.ethereum?.removeListener?.(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum?.removeListener?.("disconnect", handleDisconnectEvent);
      };
    }
  }, []);

  const checkExistingBrowserConnection = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setConnectionMethod("browser");
      }
    } catch (err) {
      console.error("Failed to check existing browser wallet connection", err);
    }
  };

  const ensureOriginalEthereum = () => {
    if (originalEthereumRef.current) {
      window.ethereum = originalEthereumRef.current;
    } else {
      delete window.ethereum;
    }
  };

  const connectBrowserWallet = async () => {
    ensureOriginalEthereum();

    if (!window.ethereum) {
      const message =
        "No browser wallet detected. Please install MetaMask or another Web3 wallet.";
      setError(message);
      toast({
        title: "Wallet Not Detected",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        throw new Error(
          "No accounts returned. Please unlock your wallet and try again."
        );
      }

      setAccount(accounts[0]);
      setConnectionMethod("browser");
      toast({
        title: "Wallet Connected",
        description: `Connected to ${truncateAddress(accounts[0])}`,
      });
    } catch (err: any) {
      console.error("Failed to connect browser wallet", err);

      let message = "Failed to connect wallet. Please try again.";
      if (err?.code === 4001) {
        message = "Connection request was rejected.";
      } else if (err?.code === -32002) {
        message = "Connection request already pending. Please check your wallet.";
      } else if (typeof err?.message === "string") {
        if (err.message.includes("already pending")) {
          message = "Connection request already pending. Please check your wallet.";
        } else if (err.message.includes("User rejected")) {
          message = "Connection was rejected. Please try again.";
        }
      }

      setError(message);
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const removeWalletConnectListeners = () => {
    const provider = walletConnectProviderRef.current;
    const listeners = walletConnectListenersRef.current;

    if (!provider) return;

    if (listeners.accountsChanged) {
      provider.removeListener(
        "accountsChanged",
        listeners.accountsChanged
      );
    }
    if (listeners.disconnect) {
      provider.removeListener("disconnect", listeners.disconnect);
    }
    if (listeners.sessionDelete) {
      provider.removeListener("session_delete", listeners.sessionDelete);
    }

    walletConnectListenersRef.current = {};
  };

  const teardownWalletConnectProvider = async () => {
    const provider = walletConnectProviderRef.current;

    if (provider) {
      removeWalletConnectListeners();
      try {
        await provider.disconnect();
      } catch (err) {
        console.warn("Failed to disconnect WalletConnect provider", err);
      }
    }
    walletConnectProviderRef.current = null;
    ensureOriginalEthereum();
  };

  const connectWalletConnect = async () => {
    const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

    if (!projectId) {
      const message =
        "WalletConnect project ID is not configured. Please add VITE_WALLETCONNECT_PROJECT_ID to your environment.";
      setError(message);
      toast({
        title: "WalletConnect Unavailable",
        description: message,
        variant: "destructive",
      });
      throw new Error(message);
    }

    setIsConnecting(true);
    setError(null);

    try {
      if (walletConnectProviderRef.current) {
        await teardownWalletConnectProvider();
      }

      const provider = await EthereumProvider.init({
        projectId,
        chains: [11155111],
        optionalChains: [1],
        showQrModal: true,
        metadata: {
          name: "NewsWave",
          description: "Decentralized news sharing platform",
          url: window.location.origin,
          icons: [
            "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
          ],
        },
      });

      walletConnectProviderRef.current = provider;

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setConnectionMethod("walletconnect");
          toast({
            title: "Wallet Connected",
            description: `Connected to ${truncateAddress(accounts[0])}`,
          });
        } else {
          handleDisconnect({ silent: false });
        }
      };

      const handleWalletConnectDisconnect = () => {
        handleDisconnect({ silent: false });
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("disconnect", handleWalletConnectDisconnect);
      provider.on("session_delete", handleWalletConnectDisconnect);

      walletConnectListenersRef.current = {
        accountsChanged: handleAccountsChanged,
        disconnect: handleWalletConnectDisconnect,
        sessionDelete: handleWalletConnectDisconnect,
      };

      const accounts = (await provider.connect()) as string[] | undefined;

      if (!accounts || accounts.length === 0) {
        throw new Error(
          "WalletConnect did not return any accounts. Please try again."
        );
      }

      window.ethereum = provider as any;

      setAccount(accounts[0]);
      setConnectionMethod("walletconnect");
      toast({
        title: "Wallet Connected",
        description: `Connected to ${truncateAddress(accounts[0])}`,
      });
    } catch (err: any) {
      console.error("Failed to connect via WalletConnect", err);

      await teardownWalletConnectProvider();

      let message = "Failed to connect with WalletConnect. Please try again.";
      if (typeof err?.message === "string") {
        if (err.message.includes("rejected")) {
          message = "Connection request was rejected.";
        } else if (err.message.includes("projectId")) {
          message = "WalletConnect configuration is invalid.";
        }
      }

      setError(message);
      toast({
        title: "WalletConnect Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async ({ silent = false } = {}) => {
    await teardownWalletConnectProvider();

    setAccount(null);
    setConnectionMethod(null);
    setError(null);

    if (!silent) {
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    }
  };

  const disconnect = async ({ silent = false } = {}) => {
    if (connectionMethod === "walletconnect") {
      await teardownWalletConnectProvider();
    }
    await handleDisconnect({ silent });
  };

  const resetError = () => {
    setError(null);
  };

  const value: WalletContextType = {
    account,
    isConnecting,
    isConnected: !!account,
    connectionMethod,
    error,
    connectBrowserWallet,
    connectWalletConnect,
    disconnect,
    hasBrowserWallet,
    resetError,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
