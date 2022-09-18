import { ChainId } from '@cronaswap/core-sdk'

export type BatchInfo = {
  bid: number
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: BatchInfo
  }
}

export const BATCHES: AddressMap = {
  // 0x4b5b334e2F5284C7Cd9cB09118C5189Bc8be3F34
  [ChainId.BSC_TESTNET]: {
    '0x4ece1Ed4F13849FDF44b6D81cFb4DD52dFc04468': {
      bid: 1,
    },
  },
}
