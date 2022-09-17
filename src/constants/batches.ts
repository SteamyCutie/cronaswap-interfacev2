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
  [ChainId.BSC_TESTNET]: {
    '0x4b5b334e2F5284C7Cd9cB09118C5189Bc8be3F34': {
      bid: 1,
    },
  },
}
