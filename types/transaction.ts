/**
 * Transaction type definitions
 */

export type TransactionType = 'receive' | 'send' | 'documents_batch';

export type TransactionChain = 'Core' | 'Platform';

export interface Transaction {
  id: string;
  type: TransactionType;
  chain: TransactionChain;
  timestamp: Date;
  amount: number;
  usdAmount: number;
  from?: string;
  to?: string;
  hash?: string;
}
