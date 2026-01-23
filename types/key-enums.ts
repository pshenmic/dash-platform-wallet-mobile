/**
 * Key-related enums from dash-platform-sdk
 */

export enum KeyType {
  ECDSA_SECP256K1 = 0,
  BLS12_381 = 1,
  ECDSA_HASH160 = 2,
  BIP13_SCRIPT_HASH = 3,
  EDDSA_25519_HASH160 = 4,
}

export enum Purpose {
  AUTHENTICATION = 0,
  ENCRYPTION = 1,
  DECRYPTION = 2,
  TRANSFER = 3,
  SYSTEM = 4,
  VOTING = 5,
  OWNER = 6,
}

export enum SecurityLevel {
  MASTER = 0,
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
}
