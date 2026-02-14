/**
 * Mock transaction data service
 */

import {
    type Transaction,
    type TransactionChain,
    type TransactionType,
} from '@/types/transaction';

/**
 * Default API delay in milliseconds
 */
const DEFAULT_DELAY = 500;

/**
 * Simulates API delay
 */
function delay(ms: number = DEFAULT_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a random transaction hash
 */
function generateHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return hash;
}

/**
 * Generates a random Dash address
 */
function generateAddress(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let address = 'y';
  
  for (let i = 0; i < 33; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
}

/**
 * Generates a random amount between min and max
 */
function randomAmount(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a date in the past (up to 30 days ago)
 */
function generatePastDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

/**
 * Creates a mock transaction
 */
export function createMockTransaction(
  type: TransactionType,
  chain: TransactionChain,
  daysAgo: number,
  amount?: number
): Transaction {
  const txAmount = amount ?? randomAmount(0.1, 100);
  const dashPrice = 25; // Mock USD price per DASH
  
  return {
    id: `tx-${Date.now()}-${Math.random()}`,
    type,
    chain,
    timestamp: generatePastDate(daysAgo),
    amount: parseFloat(txAmount.toFixed(8)),
    usdAmount: parseFloat((txAmount * dashPrice).toFixed(2)),
    from: type === 'receive' ? generateAddress() : 'yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr',
    to: type === 'send' ? generateAddress() : 'yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr',
    hash: generateHash(),
  };
}

/**
 * Mock transaction history (30+ transactions spanning multiple dates)
 */
const MOCK_TRANSACTIONS: Transaction[] = [
  // Today
  createMockTransaction('receive', 'Core', 0, 5.2),
  createMockTransaction('send', 'Platform', 0, 1.5),
  
  // Yesterday
  createMockTransaction('receive', 'Core', 1, 10.8),
  createMockTransaction('documents_batch', 'Platform', 1, 0.05),
  createMockTransaction('send', 'Core', 1, 3.2),
  
  // 2 days ago
  createMockTransaction('receive', 'Platform', 2, 7.5),
  createMockTransaction('send', 'Core', 2, 2.1),
  createMockTransaction('receive', 'Core', 2, 15.3),
  createMockTransaction('documents_batch', 'Platform', 2, 0.03),
  
  // 3 days ago
  createMockTransaction('send', 'Platform', 3, 4.7),
  createMockTransaction('receive', 'Core', 3, 8.9),
  createMockTransaction('send', 'Core', 3, 1.8),
  
  // 4 days ago
  createMockTransaction('receive', 'Core', 4, 12.4),
  createMockTransaction('documents_batch', 'Platform', 4, 0.08),
  createMockTransaction('send', 'Platform', 4, 6.3),
  createMockTransaction('receive', 'Platform', 4, 9.1),
  
  // 5 days ago
  createMockTransaction('send', 'Core', 5, 3.5),
  createMockTransaction('receive', 'Core', 5, 11.2),
  createMockTransaction('documents_batch', 'Platform', 5, 0.04),
  
  // 7 days ago
  createMockTransaction('receive', 'Platform', 7, 14.6),
  createMockTransaction('send', 'Core', 7, 5.9),
  createMockTransaction('receive', 'Core', 7, 8.3),
  
  // 10 days ago
  createMockTransaction('send', 'Platform', 10, 7.2),
  createMockTransaction('documents_batch', 'Platform', 10, 0.06),
  createMockTransaction('receive', 'Core', 10, 16.8),
  
  // 14 days ago
  createMockTransaction('receive', 'Platform', 14, 10.5),
  createMockTransaction('send', 'Core', 14, 4.1),
  createMockTransaction('receive', 'Core', 14, 13.7),
  
  // 20 days ago
  createMockTransaction('documents_batch', 'Platform', 20, 0.07),
  createMockTransaction('send', 'Platform', 20, 8.4),
  createMockTransaction('receive', 'Core', 20, 19.2),
  
  // 28 days ago
  createMockTransaction('receive', 'Platform', 28, 11.9),
  createMockTransaction('send', 'Core', 28, 6.5),
  createMockTransaction('receive', 'Core', 28, 22.1),
];

/**
 * Gets all transactions with simulated API delay
 */
export async function getTransactions(delayMs?: number): Promise<Transaction[]> {
  await delay(delayMs);
  
  // Return sorted by timestamp (most recent first)
  return [...MOCK_TRANSACTIONS].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Gets transactions filtered by type with simulated API delay
 */
export async function getTransactionsByType(
  type: TransactionType,
  delayMs?: number
): Promise<Transaction[]> {
  await delay(delayMs);
  
  return MOCK_TRANSACTIONS.filter((tx) => tx.type === type).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Gets transactions filtered by chain with simulated API delay
 */
export async function getTransactionsByChain(
  chain: TransactionChain,
  delayMs?: number
): Promise<Transaction[]> {
  await delay(delayMs);
  
  return MOCK_TRANSACTIONS.filter((tx) => tx.chain === chain).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Gets transactions for a specific date range with simulated API delay
 */
export async function getTransactionsByDateRange(
  startDate: Date,
  endDate: Date,
  delayMs?: number
): Promise<Transaction[]> {
  await delay(delayMs);
  
  return MOCK_TRANSACTIONS.filter(
    (tx) =>
      tx.timestamp >= startDate &&
      tx.timestamp <= endDate
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Gets a transaction by ID with simulated API delay
 */
export async function getTransactionById(
  id: string,
  delayMs?: number
): Promise<Transaction | null> {
  await delay(delayMs);
  
  const transaction = MOCK_TRANSACTIONS.find((tx) => tx.id === id);
  return transaction ? { ...transaction } : null;
}

/**
 * Gets recent transactions (last N transactions) with simulated API delay
 */
export async function getRecentTransactions(
  count: number = 10,
  delayMs?: number
): Promise<Transaction[]> {
  await delay(delayMs);
  
  const sorted = [...MOCK_TRANSACTIONS].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  return sorted.slice(0, count);
}
