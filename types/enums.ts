/**
 * Network and wallet type enums
 */

export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet'
}

export enum WalletType {
  seedphrase = 'seedphrase',
  keystore = 'keystore'
}

export enum IdentityType {
  regular = 'regular',
  masternode = 'masternode',
  voting = 'voting',
}

export type NetworkType = 'testnet' | 'mainnet'