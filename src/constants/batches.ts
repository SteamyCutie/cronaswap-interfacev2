import { ChainId } from '@cronaswap/core-sdk'

export type BatchInfo = {
  bid: number
  earned?: number
  totalBonds?: number
  bondsAvailable?: number
  dailyApr?: number
  bondPrice?: number
  expirePeriod: number
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: BatchInfo
  }
}

export const BATCHES: AddressMap = {
  [ChainId.BSC_TESTNET]: {
    '0x0000000000000000000000000000000000000000': {
      bid: 1,
      earned: 0,
      totalBonds: 10000,
      bondsAvailable: 2999,
      dailyApr: 2,
      bondPrice: 1000,
      expirePeriod: 70
    },
    '0x0000000000000000000000000000000000000001': {
      bid: 2,
      earned: 0,
      totalBonds: 5000,
      bondsAvailable: 100,
      dailyApr: 1,
      bondPrice: 100,
      expirePeriod: 60
    },
    '0x0000000000000000000000000000000000000002': {
      bid: 3,
      earned: 0,
      totalBonds: 20000,
      bondsAvailable: 9999,
      dailyApr: 4,
      bondPrice: 2000,
      expirePeriod: 85
    },
    '0x0000000000000000000000000000000000000003': {
      bid: 4,
      earned: 0,
      totalBonds: 15000,
      bondsAvailable: 2999,
      dailyApr: 2,
      bondPrice: 1000,
      expirePeriod: 30
    }
  }
}