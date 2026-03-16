/**
 * Mock balance data service
 */

import { type Balance } from '@/types/balance';
import { getTransactions } from './transaction-mock';

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
 * Mock balance data matching Figma specs
 * 
 * Design values:
 * - Main balance: Đ12,864.71
 * - USD value: $6221.00
 * - Platform balance: 32,000,000,000 Credits
 */
const MOCK_BALANCE: Balance = {
  total: 12864.71,
  usdValue: 6221.0,
  platformBalance: 32000000000,
};

/**
 * Gets the current balance with simulated API delay
 */
export async function getBalance(delayMs?: number): Promise<Balance> {
  await delay(delayMs);
  return { ...MOCK_BALANCE };
}

/**
 * Calculates balance from transaction history
 * 
 * This function demonstrates how balance could be calculated
 * from transactions. In production, this would come from the blockchain.
 */
export async function calculateBalanceFromTransactions(
  delayMs?: number
): Promise<Balance> {
  await delay(delayMs);
  
  const transactions = await getTransactions(0); // No additional delay
  
  let totalReceived = 0;
  let totalSent = 0;
  let platformReceived = 0;
  let platformSent = 0;
  
  for (const tx of transactions) {
    if (tx.type === 'receive') {
      totalReceived += tx.amount;
      if (tx.chain === 'Platform') {
        platformReceived += tx.amount;
      }
    } else if (tx.type === 'send' || tx.type === 'documents_batch') {
      totalSent += tx.amount;
      if (tx.chain === 'Platform') {
        platformSent += tx.amount;
      }
    }
  }
  
  const total = totalReceived - totalSent;
  const platformBalance = platformReceived - platformSent;
  const dashPrice = 25; // Mock USD price per DASH
  
  return {
    total: parseFloat(total.toFixed(8)),
    usdValue: parseFloat((total * dashPrice).toFixed(2)),
    platformBalance: parseFloat(platformBalance.toFixed(8)),
  };
}

/**
 * Gets the Core chain balance (total - platform) with simulated API delay
 */
export async function getCoreBalance(delayMs?: number): Promise<number> {
  await delay(delayMs);
  
  const coreBalance = MOCK_BALANCE.total - MOCK_BALANCE.platformBalance;
  return parseFloat(coreBalance.toFixed(8));
}

/**
 * Gets the Platform chain balance with simulated API delay
 */
export async function getPlatformBalance(delayMs?: number): Promise<number> {
  await delay(delayMs);
  return MOCK_BALANCE.platformBalance;
}

/**
 * Gets the USD value of a specific amount with simulated API delay
 */
export async function getUsdValue(
  amount: number,
  delayMs?: number
): Promise<number> {
  await delay(delayMs);
  
  const dashPrice = 25; // Mock USD price per DASH
  return parseFloat((amount * dashPrice).toFixed(2));
}

/**
 * Updates the balance (for testing purposes)
 */
export async function updateBalance(
  newBalance: Partial<Balance>,
  delayMs?: number
): Promise<Balance> {
  await delay(delayMs);
  
  Object.assign(MOCK_BALANCE, newBalance);
  return { ...MOCK_BALANCE };
}
