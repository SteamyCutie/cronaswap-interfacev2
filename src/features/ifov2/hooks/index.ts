import BigNumber from 'bignumber.js'
import { FixedNumber } from '@ethersproject/bignumber'
import { Ifo } from 'app/constants/types'
import { BIG_ONE, BIG_ZERO } from 'app/functions/bigNumber'
import { useIfoV2Contract, useVotingEscrowAtContract } from 'app/hooks'
import { useSingleCallResult, useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useMemo } from 'react'
import { getStatus } from './helpers'
import { useWeb3React } from '@web3-react/core'

const TAX_PRECISION = FixedNumber.from(10000000000)

const formatPool = (pool) => ({
  raisingAmountPool: pool ? new BigNumber(pool[0].toString()) : BIG_ZERO,
  offeringAmountPool: pool ? new BigNumber(pool[1].toString()) : BIG_ZERO,
  limitPerUserInLP: pool ? new BigNumber(pool[2].toString()) : BIG_ZERO,
  hasTax: pool ? pool[3] : false,
  totalAmountPool: pool ? new BigNumber(pool[4].toString()) : BIG_ZERO,
  sumTaxesOverflow: pool ? new BigNumber(pool[5].toString()) : BIG_ZERO,
})

// Get ifo card infos
export function useGetPublicIfoData(ifo: Ifo) {
  const { address, releaseTimestamp } = ifo
  const raiseTokenPriceInUSD = BIG_ONE
  const currentTime = Date.parse(new Date().toString()) / 1000

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

  const results = useSingleContractMultipleMethods(useIfoV2Contract(address), callsData)
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
  const taxRateNum = taxRate ? FixedNumber.from(taxRate[0]).divUnsafe(TAX_PRECISION).toUnsafeFloat() : 0

  const status = getStatus(currentTime, startTimeNum, endTimeNum)
  const totalSaleTimes = endTimeNum - startTimeNum
  const timesRemaining = endTimeNum - currentTime

  // // Calculate the total progress until finished or until start
  const progress =
    currentTime > startTimeNum
      ? ((currentTime - startTimeNum) / totalSaleTimes) * 100
      : ((currentTime - releaseTimestamp) / (startTimeNum - releaseTimestamp)) * 100

  return {
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
    raiseTokenPriceInUSD,
  }
}

// wallet data
export function useGetWalletIfoData(ifo: Ifo) {
  const { account } = useWeb3React()
  const { address, raiseToken } = ifo
  const ifoContract = useIfoV2Contract(address)
  const veCronaContract = useVotingEscrowAtContract()

  if (!account) {
    return {
      isInitialized: false,
      contract: ifoContract,
      poolBasic: {
        amountTokenCommittedInLP: BIG_ZERO,
        offeringAmountInToken: BIG_ZERO,
        refundingAmountInLP: BIG_ZERO,
        taxAmountInLP: BIG_ZERO,
        hasClaimed: false,
      },
      poolUnlimited: {
        amountTokenCommittedInLP: BIG_ZERO,
        offeringAmountInToken: BIG_ZERO,
        refundingAmountInLP: BIG_ZERO,
        taxAmountInLP: BIG_ZERO,
        hasClaimed: false,
      },
    }
  }

  const callsData = useMemo(
    () => [
      { methodName: 'viewUserInfo', callInputs: [account, [0, 1]] }, // viewUserInfo
      { methodName: 'viewUserOfferingAndRefundingAmountsForPools', callInputs: [account, [0, 1]] }, // viewUserOfferingAndRefundingAmountsForPools
    ],
    [account]
  )

  const results = useSingleContractMultipleMethods(ifoContract, callsData)
  const [{ result: userInfo }, { result: amounts }] = results

  // Calc VeCRONA
  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account), ifo.veCronaCheckPoint]
  }, [account, ifo])

  const veCrona = useSingleCallResult(args ? veCronaContract : null, 'balanceOf', args)?.result

  // const creditLeftWithNegative = veCrona?.[0].minus(new BigNumber(userInfo?.[0][0].toString())).minus(new BigNumber(userInfo?.[0][1].toString()))
  const creditLeftWithNegative = new BigNumber(veCrona?.[0].toString()).minus(
    new BigNumber(userInfo?.[0][0].toString())
  )

  const ifoVeCrona = {
    veCrona: veCrona?.[0].toString(),
    veCronaLeft: BigNumber.maximum(BIG_ZERO, creditLeftWithNegative),
  }

  return {
    isInitialized: true,
    contract: ifoContract,
    poolBasic: {
      amountTokenCommittedInLP: new BigNumber(userInfo?.[0][0].toString()),
      offeringAmountInToken: new BigNumber(amounts?.[0][0][0].toString()),
      refundingAmountInLP: new BigNumber(amounts?.[0][0][1].toString()),
      taxAmountInLP: new BigNumber(amounts?.[0][0][2].toString()),
      hasClaimed: userInfo?.[1][0],
    },
    poolUnlimited: {
      amountTokenCommittedInLP: new BigNumber(userInfo?.[0][1].toString()),
      offeringAmountInToken: new BigNumber(amounts?.[0][1][0].toString()),
      refundingAmountInLP: new BigNumber(amounts?.[0][1][1].toString()),
      taxAmountInLP: new BigNumber(amounts?.[0][1][2].toString()),
      hasClaimed: userInfo?.[1][1],
    },
    ifoVeCrona,
  }
}
