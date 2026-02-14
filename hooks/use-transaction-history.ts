/**
 * Hook for fetching and grouping transactions
 */

import { getTransactions } from '@/services/mock/transaction-mock';
import { type Transaction } from '@/types/transaction';
import { useCallback, useEffect, useState } from 'react';

/**
 * Transaction group with date and transactions
 */
export interface TransactionGroup {
  date: string;
  dateDisplay: string;
  transactions: Transaction[];
}

/**
 * Return type for useTransactionHistory hook
 */
export interface UseTransactionHistoryReturn {
  groups: TransactionGroup[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Formats a date as "DD Month YYYY" (e.g., "20 June 2025")
 */
export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Formats a date as a key for grouping (YYYY-MM-DD)
 */
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Groups transactions by date
 */
export function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionGroup[] {
  const grouped = new Map<string, Transaction[]>();
  
  for (const transaction of transactions) {
    const dateKey = formatDateKey(transaction.timestamp);
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    
    grouped.get(dateKey)!.push(transaction);
  }
  
  const groups: TransactionGroup[] = [];
  
  for (const [dateKey, transactions] of grouped.entries()) {
    const firstTransaction = transactions[0];
    
    groups.push({
      date: dateKey,
      dateDisplay: formatDate(firstTransaction.timestamp),
      transactions,
    });
  }
  
  // Sort groups by date (most recent first)
  groups.sort((a, b) => b.date.localeCompare(a.date));
  
  return groups;
}

/**
 * Hook for fetching and grouping transaction history
 * 
 * Fetches transactions from the mock service and groups them by date.
 * Provides loading, error states, and refresh functionality.
 */
export function useTransactionHistory(): UseTransactionHistoryReturn {
  const [groups, setGroups] = useState<TransactionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const transactions = await getTransactions();
      const groupedTransactions = groupTransactionsByDate(transactions);
      
      setGroups(groupedTransactions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    groups,
    loading,
    error,
    refresh,
  };
}
