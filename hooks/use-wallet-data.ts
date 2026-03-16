/**
 * Hook for fetching wallet data
 */

import { getActiveWallet } from '@/services/mock/wallet-mock';
import { type Wallet } from '@/types/wallet';
import { useCallback, useEffect, useState } from 'react';

/**
 * Return type for useWalletData hook
 */
export interface UseWalletDataReturn {
  wallet: Wallet | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching active wallet data
 * 
 * Fetches the active wallet from the mock service.
 * Provides loading, error states, and refresh functionality.
 * 
 * @returns {UseWalletDataReturn} Wallet data with state management
 * 
 * @example
 * ```tsx
 * const { wallet, loading, error, refresh } = useWalletData();
 * 
 * if (loading) return <ActivityIndicator />;
 * if (error) return <ErrorMessage error={error} />;
 * if (!wallet) return null;
 * 
 * return <WalletHeader wallet={wallet} />;
 * ```
 */
export function useWalletData(): UseWalletDataReturn {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWalletData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const walletData = await getActiveWallet();
      setWallet(walletData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchWalletData();
  }, [fetchWalletData]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return {
    wallet,
    loading,
    error,
    refresh,
  };
}
