/**
 * Key pair and private key types
 */

import { KeyType, Purpose, SecurityLevel } from './key-enums';

export interface KeyPair {
  keyId: number
  keyType: KeyType
  publicKeyHash: string
  purpose: Purpose
  securityLevel: SecurityLevel
  encryptedPrivateKey: string | null
  pending: boolean
}

export interface PrivateKey {
  keyId: number
  keyType: KeyType
  privateKey: string
  purpose: Purpose
  securityLevel: SecurityLevel
}