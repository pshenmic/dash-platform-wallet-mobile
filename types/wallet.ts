/**
 * Wallet types
 */

import { WalletType, NetworkType } from './enums';
import { IdentityInfo } from './identity';

export interface Wallet {
  walletId: string
  type: WalletType
  network: NetworkType
  label: string | null
  encryptedMnemonic: string | null
  seedHash: string | null
  currentIdentity: string | null
  createdAt: Date
}

export interface WalletInfo {
  identities: IdentityInfo[]
  currentIdentity: string | null
}