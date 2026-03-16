/**
 * Wallet type definitions
 */

export type WalletType = 'Key Store' | 'Hardware' | 'Watch Only';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  address: string;
}
