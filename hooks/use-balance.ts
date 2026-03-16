/**
 * Hook for fetching balance data
 */

import { getBalance } from '@/services/mock/balance-mock';
import { type Balance } from '@/types/balance';
import { useCallback, useEffect, useState } from 'react';

/**
 * Return type for useBalance hook
 */
export interface UseBalanceReturn {
  balance: Balance | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching wallet balance
 * 
 * Fetches balance data from the mock service including:
 * - Total balance in Dash
 * - USD equivalent value
 * - Platform balance in Credits
 * 
 * Provides loading, error states, and refresh functionality.
 * 
 * @returns {UseBalanceReturn} Balance data with state management
 * 
 * @example
 * ```tsx
 * const { balance, loading, error, refresh } = useBalance();
 * 
 * if (loading) return <ActivityIndicator />;
 * if (error) return <ErrorMessage error={error} />;
 * if (!balance) return null;
 * 
 * return (
 *   <BalanceDisplay
 *     balance={balance.total}
 *     usdValue={balance.usdValue}
 *     platformBalance={balance.platformBalance}
 *   />
 * );
 * ```
 */
export function useBalance(): UseBalanceReturn {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const balanceData = await getBalance();
      setBalance(balanceData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    refresh,
  };
}
