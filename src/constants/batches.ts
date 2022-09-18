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
    '0x627B76eCA4B969D7aBab0727C7B5cbB7D795Ec4F': {
      bid: 1,
    },
  },
}
