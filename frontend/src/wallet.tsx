import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_HEX_CHAIN_ID = '0x14a34';

interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

interface WalletContextValue {
  address: string | null;
  chainId: number | null;
  isAvailable: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBaseSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

function provider(): Eip1193Provider | undefined {
  return typeof window === 'undefined' ? undefined : window.ethereum;
}

function normalizeChainId(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;
  const parsed = value.startsWith('0x') ? Number.parseInt(value, 16) : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export const WalletProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const isAvailable = typeof window !== 'undefined' && Boolean(window.ethereum);

  const refresh = useCallback(async () => {
    const injected = provider();
    if (!injected) return;
    const accounts = await injected.request({ method: 'eth_accounts' }) as string[];
    const currentChain = await injected.request({ method: 'eth_chainId' });
    setAddress(accounts[0] ?? null);
    setChainId(normalizeChainId(currentChain));
  }, []);

  useEffect(() => {
    const injected = provider();
    if (!injected) return undefined;

    void refresh().catch(() => {
      setAddress(null);
      setChainId(null);
    });

    const onAccountsChanged = (accounts: unknown) => {
      const nextAccounts = Array.isArray(accounts) ? accounts as string[] : [];
      setAddress(nextAccounts[0] ?? null);
    };
    const onChainChanged = (nextChainId: unknown) => setChainId(normalizeChainId(nextChainId));
    injected.on?.('accountsChanged', onAccountsChanged);
    injected.on?.('chainChanged', onChainChanged);
    return () => {
      injected.removeListener?.('accountsChanged', onAccountsChanged);
      injected.removeListener?.('chainChanged', onChainChanged);
    };
  }, [refresh]);

  const connect = useCallback(async () => {
    const injected = provider();
    if (!injected) throw new Error('NO_WALLET');
    setIsConnecting(true);
    try {
      const accounts = await injected.request({ method: 'eth_requestAccounts' }) as string[];
      const currentChain = await injected.request({ method: 'eth_chainId' });
      setAddress(accounts[0] ?? null);
      setChainId(normalizeChainId(currentChain));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => setAddress(null), []);

  const switchToBaseSepolia = useCallback(async () => {
    const injected = provider();
    if (!injected) throw new Error('NO_WALLET');
    await injected.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_SEPOLIA_HEX_CHAIN_ID }] });
    setChainId(BASE_SEPOLIA_CHAIN_ID);
  }, []);

  const value = useMemo(() => ({ address, chainId, isAvailable, isConnecting, connect, disconnect, switchToBaseSepolia }), [
    address, chainId, isAvailable, isConnecting, connect, disconnect, switchToBaseSepolia,
  ]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used inside WalletProvider');
  return context;
}

export { BASE_SEPOLIA_CHAIN_ID };
