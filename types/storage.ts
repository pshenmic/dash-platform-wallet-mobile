/**
 * Encrypted storage types
 */

import { Wallet } from './wallet';
import { Identity } from './identity';

export interface EncryptedData {
  ciphertext: string
  iv: string
}

interface PrivateKey {
  keyId: number
  privateKey: string
}

export interface SecureStorageData {
  wallets: Wallet[]
  identities: Identity[]
  privateKeys: Record<string, PrivateKey[]>
  passwordHash: string
  version: string
}