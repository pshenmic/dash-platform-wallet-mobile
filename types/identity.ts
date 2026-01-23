/**
 * Identity types
 */

import { IdentityType } from './enums';

export interface Identity {
  index: number
  type: IdentityType
  proTxHash: null | string
  identifier: string
  label: string | null
}

export interface IdentityInfo {
  type: IdentityType
  proTxHash: null | string
  identifier: string
}