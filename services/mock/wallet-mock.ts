/**
 * Mock wallet data service
 */

import { type Wallet, type WalletType } from '@/types/wallet';

/**
 * Default API delay in milliseconds
 */
const DEFAULT_DELAY = 500;

/**
 * Mock wallet data
 */
const MOCK_WALLETS: Wallet[] = [
  {
    id: 'wallet-1',
    name: 'Main Wallet',
    type: 'Key Store',
    address: 'yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr',
  },
  {
    id: 'wallet-2',
    name: 'Hardware Wallet',
    type: 'Hardware',
    address: 'yTsGq4wV8WF5GKLaYV2C8jR5nJtKm9WxXr',
  },
  {
    id: 'wallet-3',
    name: 'Watch Only',
    type: 'Watch Only',
    address: 'yUjKm9P3vR4dW8nLaQxF5jZtGm2HxWrXr',
  },
];

/**
 * Current active wallet (defaults to first wallet)
 */
let activeWalletId = MOCK_WALLETS[0].id;

/**
 * Simulates API delay
 */
function delay(ms: number = DEFAULT_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a random Dash address
 */
export function generateAddress(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let address = 'y'; // Dash testnet addresses start with 'y'
  
  for (let i = 0; i < 33; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
}

/**
 * Creates a mock wallet
 */
export function createMockWallet(
  name: string,
  type: WalletType,
  address?: string
): Wallet {
  return {
    id: `wallet-${Date.now()}`,
    name,
    type,
    address: address ?? generateAddress(),
  };
}

/**
 * Gets all wallets with simulated API delay
 */
export async function getWallets(delayMs?: number): Promise<Wallet[]> {
  await delay(delayMs);
  return [...MOCK_WALLETS];
}

/**
 * Gets the active wallet with simulated API delay
 */
export async function getActiveWallet(delayMs?: number): Promise<Wallet> {
  await delay(delayMs);
  
  const wallet = MOCK_WALLETS.find((w) => w.id === activeWalletId);
  
  if (!wallet) {
    throw new Error('Active wallet not found');
  }
  
  return { ...wallet };
}

/**
 * Gets a wallet by ID with simulated API delay
 */
export async function getWalletById(
  id: string,
  delayMs?: number
): Promise<Wallet | null> {
  await delay(delayMs);
  
  const wallet = MOCK_WALLETS.find((w) => w.id === id);
  return wallet ? { ...wallet } : null;
}

/**
 * Sets the active wallet
 */
export async function setActiveWallet(
  id: string,
  delayMs?: number
): Promise<void> {
  await delay(delayMs);
  
  const wallet = MOCK_WALLETS.find((w) => w.id === id);
  
  if (!wallet) {
    throw new Error(`Wallet with id ${id} not found`);
  }
  
  activeWalletId = id;
}

/**
 * Adds a new wallet
 */
export async function addWallet(
  wallet: Omit<Wallet, 'id'>,
  delayMs?: number
): Promise<Wallet> {
  await delay(delayMs);
  
  const newWallet: Wallet = {
    id: `wallet-${Date.now()}`,
    ...wallet,
  };
  
  MOCK_WALLETS.push(newWallet);
  return { ...newWallet };
}
