import BigNumber from 'bignumber.js'
import { useState, useCallback } from 'react'
import { CRO_BLOCK_TIME } from 'config'
import ifoV2Abi from 'constants/abis/ifoV2.json'
import { CRONA } from 'config/tokens';
import { Ifo, IfoStatus, PoolIds, PoolCharacteristics } from 'constants/types'
import { ethers } from 'ethers'
import { useCronaUsdcPrice } from '../farms/hooks'
import { BIG_ZERO, BIG_ONE } from 'app/functions/bigNumber';
import { getStatus } from './helpers';
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks';

interface PublicIfoData {
  isInitialized: boolean
  status: IfoStatus
  blocksRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startBlockNum: number
  endBlockNum: number
  currencyPriceInUSD: BigNumber
  numberPoints: number
  thresholdPoints: ethers.BigNumber
  fetchIfoData: (currentBlock: number) => void
  [PoolIds.poolBasic]?: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics
}

// 1,000,000,000 / 100
const TAX_PRECISION = ethers.FixedNumber.from(10000000000)

const formatPool = (pool) => ({
  raisingAmountPool: pool ? new BigNumber(pool[0].toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool[1].toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
})

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address, releaseBlockNumber } = ifo
  const cronaPriceUsd = useCronaUsdcPrice()
  const currencyPriceInUSD = ifo.currency === CRONA ? new BigNumber(cronaPriceUsd) : BIG_ONE

  const [state, setState] = useState({
    isInitialized: false,
    status: 'idle' as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolBasic: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    thresholdPoints: undefined,
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
  })

  const fetchIfoData = useCallback(
    async (currentBlock: number) => {
      const [startBlock, endBlock, poolBasic, poolUnlimited, taxRate] =
        await multicallv2(ifoV2Abi, [
          {
            address,
            name: 'startBlock',
          },
          {
            address,
            name: 'endBlock',
          },
          {
            address,
            name: 'viewPoolInformation',
            params: [0],
          },
          {
            address,
            name: 'viewPoolInformation',
            params: [1],
          },
          {
            address,
            name: 'viewPoolTaxRateOverflow',
            params: [1],
          }
        ])

      const poolBasicFormatted = formatPool(poolBasic)
      const poolUnlimitedFormatted = formatPool(poolUnlimited)

      const startBlockNum = startBlock ? startBlock[0].toNumber() : 0
      const endBlockNum = endBlock ? endBlock[0].toNumber() : 0
      const taxRateNum = taxRate ? ethers.FixedNumber.from(taxRate[0]).divUnsafe(TAX_PRECISION).toUnsafeFloat() : 0

      const status = getStatus(currentBlock, startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress until finished or until start
      const progress =
        currentBlock > startBlockNum
          ? ((currentBlock - startBlockNum) / totalBlocks) * 100
          : ((currentBlock - releaseBlockNumber) / (startBlockNum - releaseBlockNumber)) * 100

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        secondsUntilEnd: blocksRemaining * CRO_BLOCK_TIME,
        secondsUntilStart: (startBlockNum - currentBlock) * CRO_BLOCK_TIME,
        poolBasic: { ...poolBasicFormatted, taxRate: 0 },
        poolUnlimited: { ...poolUnlimitedFormatted, taxRate: taxRateNum },
        status,
        progress,
        blocksRemaining,
        startBlockNum,
        endBlockNum,
        thresholdPoints: 0,
        numberPoints: 0,
      }))
    },
    [releaseBlockNumber, address],
  )

  return { ...state, currencyPriceInUSD, fetchIfoData }
}

export default useGetPublicIfoData

