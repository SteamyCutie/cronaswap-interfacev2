import { Token } from '@cronaswap/core-sdk'
import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import ethers from 'ethers'

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

interface IfoPoolInfo {
  saleAmount: string
  raiseAmount: string
  cronaToBurn: string
  distributionRatio: number // Range [0-1]
}

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  currency: Token
  // token: Token
  releaseTimestamp: number
  articleUrl: string
  campaignId: string
  tokenOfferingPrice: number
  description?: string
  twitterUrl?: string
  telegramUrl?: string
  version: number
  [PoolIds.poolBasic]?: IfoPoolInfo
  [PoolIds.poolUnlimited]: IfoPoolInfo
}

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInRaisingToken: BigNumber
  taxRate: number
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber
}

// IFO data unrelated to the user returned by useGetPublicIfoData
export interface PublicIfoData {
  isInitialized: boolean
  status: IfoStatus
  timesRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startTimeNum: number
  endTimeNum: number
  currencyPriceInUSD: BigNumber
  numberPoints: number
  thresholdPoints: ethers.BigNumber
  fetchIfoData: (currentTime: number) => void
  [PoolIds.poolBasic]?: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics
}

// User specific pool characteristics
export interface UserPoolCharacteristics {
  amountTokenCommittedInLP: BigNumber // @contract: amountPool
  offeringAmountInToken: BigNumber // @contract: userOfferingAmountPool
  refundingAmountInLP: BigNumber // @contract: userRefundingAmountPool
  taxAmountInLP: BigNumber // @contract: userTaxAmountPool
  hasClaimed: boolean // @contract: claimedPool
  isPendingTx: boolean
}

// Use only inside the useGetWalletIfoData hook
export interface WalletIfoState {
  isInitialized: boolean
  [PoolIds.poolBasic]?: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
  // ifoVeCrona: {
  //   veCrona: BigNumber
  //   veCronaLeft: BigNumber // credit left is the ifo credit minus the amount of `amountTokenCommittedInLP` in pool basic and unlimited
  // }
}

// Returned by useGetWalletIfoData
export interface WalletIfoData extends WalletIfoState {
  allowance: BigNumber
  contract: Contract
  setPendingTx: (status: boolean, poolId: PoolIds) => void
  setIsClaimed: (poolId: PoolIds) => void
  fetchIfoData: () => void
  resetIfoData: () => void
}
