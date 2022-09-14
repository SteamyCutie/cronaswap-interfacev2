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
    '0xaEE229d77671A0683efFeC08069634EcA7F10E86': {
      bid: 1,
    }
  }
}