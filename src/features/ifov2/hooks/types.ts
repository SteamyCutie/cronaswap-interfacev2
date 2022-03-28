import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { IfoStatus, PoolIds } from 'app/constants/types'
import { Token } from '@cronaswap/core-sdk'

export enum EnableStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  IS_ENABLING = 'is_enabling',
}

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInLP: BigNumber
  taxRate: number
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber
  raiseToken: Token
  raiseTokenPriceInUSD: BigNumber
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
  allowClaim: boolean
  offerToken: Token
  // raiseTokenPriceInUSD: BigNumber
  [PoolIds.poolBasic]?: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics
}

// User specific pool characteristics
export interface UserPoolCharacteristics {
  amountTokenCommittedInLP: BigNumber // @contract: amountPool
  offeringAmountInToken: BigNumber // @contract: userOfferingAmountPool
  refundingAmountInLP: BigNumber // @contract: userRefundingAmountPool
  taxAmountInLP: BigNumber // @contract: userTaxAmountPool
  offeringTokenTotalHarvest: BigNumber
  hasClaimed: boolean // @contract: claimedPool
}

// Use only inside the useGetWalletIfoData hook
export interface WalletIfoData {
  isInitialized: boolean
  contract: Contract
  [PoolIds.poolBasic]?: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
  ifoVeCrona?: {
    veCrona: BigNumber
    /**
     * credit left is the ifo credit minus the amount of `amountTokenCommittedInLP` in pool basic and unlimited
     * minimum is 0
     */
    veCronaLeft: BigNumber
  }
}
