import { ChainId, Currency, CurrencyAmount, NATIVE, WNATIVE } from '@cronaswap/core-sdk'

import { tryParseAmount } from '../functions/parse'
import { useActiveWeb3React } from '../services/web3'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCoinTossContract, useWETH9Contract } from './useContract'
import { maxAmountSpend } from 'app/functions'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { result } from 'lodash'

const NOT_APPLICABLE = { error: 'Not Applicable!' }

export default function useCoinTossCallback(
  selectedCurrency: Currency | undefined,
  inputValue: string | undefined
): {
  error?: string | ''
  rewards?: undefined | BigNumber
  claimRewards?: undefined | (() => Promise<{ tx: string; error: string }>)
  approvalState?: ApprovalState | undefined
  approveCallback?: () => Promise<void>
  contract?: Contract
  totalBetsCount?: number | 0
  totalBetsAmount?: BigNumber | undefined
  headsCount?: number | 0
  tailsCount?: number | 0
  betsCountByPlayer?: number | 0
  minBetAmount?: BigNumber | undefined
  maxBetAmount?: BigNumber | undefined
  multiplier?: number | 0
  betsByIndex?: []
  topGamers?: []
  betsByPlayer?: []
} {
  const { chainId, account } = useActiveWeb3React()
  const conitossContract = useCoinTossContract()
  const balance = maxAmountSpend(useCurrencyBalance(account ?? undefined, selectedCurrency))
  const selectedCurrencyAmount = useMemo(
    () => tryParseAmount(inputValue, selectedCurrency),
    [selectedCurrency, inputValue]
  )
  const tokenAddress = selectedCurrency?.wrapped.address
  const [approvalState, approveCallback] = useApproveCallback(selectedCurrencyAmount, conitossContract?.address)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const addTransaction = useTransactionAdder()

  const [rewards, setrewards] = useState<BigNumber>(undefined)
  // const [totalBetsCount, settotalBetsCount] = useState<number>(0)
  // const [totalBetsAmount, settotalBetsAmount] = useState<BigNumber>(undefined)
  // const [headsCount, setheadsCount] = useState<number>(0)
  // const [tailsCount, settailsCount] = useState<number>(0)
  const [betsCountByPlayer, setbetsCountByPlayer] = useState<number>(0)
  const [betsByPlayer, setbetsByPlayer] = useState<[]>([])
  // const [multiplier, setMultiplier] = useState<number>(0)
  let callResult = useSingleCallResult(conitossContract, 'getBetAmountRangeByToken', [
    selectedCurrency?.wrapped.address,
  ])?.result
  const { minBetAmount, maxBetAmount } = useMemo(() => {
    return { minBetAmount: callResult && callResult[0], maxBetAmount: callResult && callResult[1] }
  }, [callResult])

  callResult = useSingleCallResult(conitossContract, 'getMultiplier', [
    tokenAddress,
    selectedCurrencyAmount?.quotient.toString() ?? '0',
  ])?.result
  const multiplier: number = useMemo(() => {
    return BigNumber.from((callResult && callResult[0]?.toString()) ?? 0).toNumber()
  }, [callResult])

  // callResult = useSingleCallResult(conitossContract, 'getBetsCountByPlayer')?.result
  // const betsCountByPlayer = useMemo(async () => {
  //   debugger
  //   // return BigNumber.from(callResult?.toString() ?? 0).toNumber()
  //   const rst = (await conitossContract.getBetsCountByPlayer()).toNumber()
  //   return rst
  // }, [callResult])

  const totalBetInfo = useSingleCallResult(conitossContract, 'getBetsAmountAndCountByToken', [tokenAddress])?.result
  const { totalBetsCount, totalBetsAmount } = useMemo(() => {
    return {
      totalBetsCount: BigNumber.from(totalBetInfo?.totalBetsCount.toString() ?? 0).toNumber(),
      totalBetsAmount: BigNumber.from(totalBetInfo?.totalBetsAmount.toString() ?? 0),
    }
  }, [totalBetInfo])

  // callResult = useSingleCallResult(conitossContract, 'getRewardsAmountByPlayer', [tokenAddress])?.result
  // const rewards: BigNumber = useMemo(() => {
  //   return BigNumber.from(callResult?.toString() ?? 0)
  // }, [callResult])
  const totalCounts = useSingleCallResult(conitossContract, 'getHeadsTailsCount' /*[tokenAddress]*/)?.result
  const { headsCount, tailsCount } = useMemo(() => {
    return {
      headsCount: BigNumber.from((totalCounts && totalCounts[0].toString()) ?? 0).toNumber(),
      tailsCount: BigNumber.from((totalCounts && totalCounts[1].toString()) ?? 0).toNumber(),
    }
  }, [totalCounts])

  callResult = useSingleCallResult(conitossContract, 'getBetsByIndex', ['100'])?.result
  const betsByIndex = useMemo(() => {
    return (callResult && callResult[0]) ?? []
  }, [callResult])

  callResult = useSingleCallResult(conitossContract, 'getTopGamers', [tokenAddress])?.result
  const topGamers = useMemo(() => {
    return (callResult && callResult[0]) ?? []
  }, [callResult])

  let promise = useMemo(async () => {
    return account && (await conitossContract.getBetsCountByPlayer())
  }, [account, selectedCurrency, selectedCurrencyAmount, balance])

  promise.then((value) => {
    setbetsCountByPlayer(value?.toNumber())
  })

  promise = useMemo(async () => {
    return account && (await conitossContract.getRewardsAmountByPlayer(tokenAddress))
  }, [account, selectedCurrency, selectedCurrencyAmount, balance])

  promise.then((value) => {
    setrewards(value)
  })

  promise = useMemo(async () => {
    return account && (await conitossContract.getBetsByPlayer('100'))
  }, [account, selectedCurrency, balance])

  promise.then((value) => {
    setbetsByPlayer(value)
  })

  // useEffect(() => {
  //   async function FetchPlayerInfo() {
  //     try {
  //       // const betAmountRange = await conitossContract.getBetAmountRangeByToken(tokenAddress)
  //       // setminBetAmount(betAmountRange[0])
  //       // setmaxBetAmount(betAmountRange[1])
  //       // setMultiplier(
  //       //   await conitossContract.getMultiplier(tokenAddress, selectedCurrencyAmount?.quotient.toString() ?? '0')
  //       // )

  //       // const totalBetInfo = await conitossContract.getBetsAmountAndCountByToken(tokenAddress)
  //       // settotalBetsCount(totalBetInfo?.totalBetsCount.toNumber())
  //       // settotalBetsAmount(totalBetInfo?.totalBetsAmount)
  //       // const totalCounts = await conitossContract.getHeadsTailsCount()
  //       // setheadsCount(totalCounts[0].toNumber())
  //       // settailsCount(totalCounts[1].toNumber())
  //       if (account) {
  //         // setbetsCountByPlayer((await conitossContract.getBetsCountByPlayer()).toNumber())
  //         // setrewards(await conitossContract.getRewardsAmountByPlayer(tokenAddress))
  //       }
  //     } catch {}
  //   }

  //   FetchPlayerInfo()
  // }, [account, selectedCurrency, selectedCurrencyAmount, balance])
  return useMemo(() => {
    if (!chainId) return NOT_APPLICABLE

    const hasInputAmount = Boolean(selectedCurrencyAmount?.greaterThan('0'))
    const sufficientBalance = selectedCurrencyAmount && balance && !balance.lessThan(selectedCurrencyAmount)
    const rangedBalance =
      (selectedCurrencyAmount &&
        selectedCurrencyAmount.greaterThan(minBetAmount?.toString()) &&
        selectedCurrencyAmount.lessThan(maxBetAmount?.toString())) ||
      selectedCurrencyAmount?.equalTo(minBetAmount?.toString()) ||
      selectedCurrencyAmount?.equalTo(maxBetAmount?.toString())
    return {
      betsByPlayer,
      topGamers,
      betsByIndex,
      multiplier,
      minBetAmount,
      maxBetAmount,
      betsCountByPlayer,
      headsCount,
      tailsCount,
      totalBetsAmount,
      totalBetsCount,
      approvalState,
      approveCallback,
      error: sufficientBalance
        ? rangedBalance
          ? undefined
          : `${selectedCurrency?.symbol} Bet Amount Out of Range`
        : hasInputAmount
        ? `Insufficient ${selectedCurrency?.symbol} balance`
        : `Enter ${selectedCurrency?.symbol} amount`,
      rewards: rewards,
      claimRewards: async () => {
        try {
          const txReceipt = await conitossContract.claimRewards(selectedCurrency.wrapped.address)
          addTransaction(txReceipt, {
            summary: `Get Rewards of ${selectedCurrency.symbol}`,
          })
          return { tx: txReceipt, error: undefined }
        } catch (error) {
          return { tx: undefined, error: error?.message }
        }
      },
      contract: conitossContract,
    }
  }, [
    conitossContract,
    chainId,
    selectedCurrencyAmount,
    balance,
    addTransaction,
    rewards,
    minBetAmount,
    maxBetAmount,
    totalBetsAmount,
    totalBetsCount,
    headsCount,
    tailsCount,
    betsCountByPlayer,
    approvalState,
    betsByIndex,
    betsByPlayer,
    topGamers,
  ])
}
