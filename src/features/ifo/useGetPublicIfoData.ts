import BigNumber from 'bignumber.js'
import { useState, useCallback, useMemo } from 'react'
import { CRO_BLOCK_TIME } from 'config'
import IFOV2_ABI from 'constants/abis/ifoV2.json'
import { CRONA } from 'config/tokens'
import { Ifo, IfoStatus, PoolIds, PoolCharacteristics } from 'constants/types'
import { ethers } from 'ethers'
import { useCronaUsdcPrice } from '../farms/hooks'
import { BIG_ZERO, BIG_ONE } from 'app/functions/bigNumber'
import { getStatus } from './helpers'
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useContract } from 'app/hooks'

interface PublicIfoData {
  isInitialized: boolean
  status: IfoStatus
  blocksRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startTimeNum: number
  endTimeNum: number
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
  limitPerUserInRaisingToken: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
})

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  const { address, releaseTimestamp } = ifo
  const ifoContract = useContract(ifo.address, IFOV2_ABI)

  // const cronaPriceUsd = useCronaUsdcPrice()
  // const currencyPriceInUSD = ifo.currency === CRONA ? new BigNumber(cronaPriceUsd) : BIG_ONE
  const currencyPriceInUSD = BIG_ONE

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
      limitPerUserInRaisingToken: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInRaisingToken: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    thresholdPoints: undefined,
    startTimeNum: 0,
    endTimeNum: 0,
    numberPoints: 0,
  })

  const fetchIfoData = useCallback(
    async (currentTime: number) => {
      // block info
      const callsData = useMemo(
        () => [
          { methodName: 'startTime', callInputs: [] }, // startTime
          { methodName: 'endTime', callInputs: [] }, // endTime
          { methodName: 'viewPoolInformation', callInputs: [0] }, // viewPoolInformation pid=0
          { methodName: 'viewPoolInformation', callInputs: [1] }, // viewPoolInformation pid=1
          { methodName: 'viewPoolTaxRateOverflow', callInputs: [1] }, // viewPoolTaxRateOverflow pid=1
        ],
        []
      )

      const results = useSingleContractMultipleMethods(ifoContract, callsData)
      const [
        { result: startTime },
        { result: endTime },
        { result: poolBasic },
        { result: poolUnlimited },
        { result: taxRate },
      ] = results

      const poolBasicFormatted = formatPool(poolBasic)
      const poolUnlimitedFormatted = formatPool(poolUnlimited)

      const startTimeNum = startTime ? startTime[0].toNumber() : 0
      const endTimeNum = endTime ? endTime[0].toNumber() : 0
      const taxRateNum = taxRate ? ethers.FixedNumber.from(taxRate[0]).divUnsafe(TAX_PRECISION).toUnsafeFloat() : 0

      const status = getStatus(currentTime, startTimeNum, endTimeNum)
      const totalBlocks = endTimeNum - startTimeNum
      const timesRemaining = endTimeNum - currentTime

      // Calculate the total progress until finished or until start
      const progress =
        currentTime > startTimeNum
          ? ((currentTime - startTimeNum) / totalBlocks) * 100
          : ((currentTime - releaseTimestamp) / (startTimeNum - releaseTimestamp)) * 100

      setState((prev) => ({
        ...prev,
        isInitialized: true,
        secondsUntilEnd: timesRemaining,
        secondsUntilStart: startTimeNum - currentTime,
        poolBasic: { ...poolBasicFormatted, taxRate: 0 },
        poolUnlimited: { ...poolUnlimitedFormatted, taxRate: taxRateNum },
        status,
        progress,
        timesRemaining,
        startTimeNum,
        endTimeNum,
        thresholdPoints: 0,
        numberPoints: 0,
      }))
    },
    [releaseTimestamp, address]
  )

  return { ...state, currencyPriceInUSD, fetchIfoData }
}

export default useGetPublicIfoData
