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

export function useCoinTossCallback_PlaceBet(
  selectedCurrency: Currency | undefined,
  inputValue: string | undefined,
  totalBetsCount: number | 0
): {
  error?: string | ''
  rewards?: undefined | BigNumber
  claimRewards?: undefined | (() => Promise<{ tx: string; error: string }>)
  approvalState?: ApprovalState | undefined
  approveCallback?: () => Promise<void>
  contract?: Contract
  betsCountByPlayer?: number | 0
  minBetAmount?: BigNumber | undefined
  maxBetAmount?: BigNumber | undefined
  multiplier?: number | 0
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
  const [betsCountByPlayer, setbetsCountByPlayer] = useState<number>(0)
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

  useEffect(() => {
    async function FetchPlayerInfo() {
      try {
        if (account) {
          setbetsCountByPlayer((await conitossContract.getBetsCountByPlayer()).toNumber())
          setrewards(await conitossContract.getRewardsAmountByPlayer(tokenAddress))
        }
      } catch {}
    }

    FetchPlayerInfo()
  }, [account, selectedCurrency, totalBetsCount, balance])
  return useMemo(() => {
    if (!chainId && conitossContract) return NOT_APPLICABLE

    const hasInputAmount = Boolean(selectedCurrencyAmount?.greaterThan('0'))
    const sufficientBalance = selectedCurrencyAmount && balance && !balance.lessThan(selectedCurrencyAmount)
    const rangedBalance =
      selectedCurrencyAmount &&
      ((selectedCurrencyAmount?.greaterThan(minBetAmount?.toString()) &&
        selectedCurrencyAmount?.lessThan(maxBetAmount?.toString())) ||
        selectedCurrencyAmount?.equalTo(minBetAmount?.toString()) ||
        selectedCurrencyAmount?.equalTo(maxBetAmount?.toString()))
    return {
      multiplier,
      minBetAmount,
      maxBetAmount,
      betsCountByPlayer,
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
    betsCountByPlayer,
    approvalState,
  ])
}

export function useCoinTossCallback_GameReview(
  selectedCurrency: Currency | undefined,
  totalBetsCount: number | undefined
): {
  error?: string | ''
  betsByIndex?: []
  topGamers?: []
  betsByPlayer?: []
} {
  const { chainId, account } = useActiveWeb3React()
  const conitossContract = useCoinTossContract()

  const tokenAddress = selectedCurrency?.wrapped.address
  const [betsByPlayer, setbetsByPlayer] = useState<[]>([])
  const [betsByIndex, setbetsByIndex] = useState<[]>([])
  const [topGamers, settopGamers] = useState<[]>([])

  // let callResult = useSingleCallResult(conitossContract, 'getBetsByIndex', ['100'])?.result
  // const betsByIndex = useMemo(() => {
  //   return (callResult && callResult[0]) ?? []
  // }, [callResult])

  // callResult = useSingleCallResult(conitossContract, 'getTopGamers', [tokenAddress])?.result
  // const topGamers = useMemo(() => {
  //   return (callResult && callResult[0]) ?? []
  // }, [callResult])

  useEffect(() => {
    async function FetchPlayerInfo() {
      try {
        if (account) {
          setbetsByPlayer(await conitossContract.getBetsByPlayer('100'))
          // setbetsByPlayer(await conitossContract.getBetsByPlayer('100'))
        }
      } catch {}
    }

    FetchPlayerInfo()
  }, [account, selectedCurrency, totalBetsCount])
  return useMemo(() => {
    if (!chainId && conitossContract) return NOT_APPLICABLE
    return {
      betsByPlayer,
      topGamers,
      betsByIndex,
      contract: conitossContract,
    }
  }, [conitossContract, chainId, betsByIndex, betsByPlayer, topGamers, totalBetsCount])
}

export function useCoinTossCallback_Volume(selectedCurrency: Currency | undefined): {
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
} {
  const { chainId, account } = useActiveWeb3React()
  const conitossContract = useCoinTossContract()

  const tokenAddress = selectedCurrency?.wrapped.address

  const totalBetInfo = useSingleCallResult(conitossContract, 'getBetsAmountAndCountByToken', [tokenAddress])?.result
  const { totalBetsCount, totalBetsAmount } = useMemo(() => {
    return {
      totalBetsCount: BigNumber.from(totalBetInfo?.totalBetsCount.toString() ?? 0).toNumber(),
      totalBetsAmount: BigNumber.from(totalBetInfo?.totalBetsAmount.toString() ?? 0),
    }
  }, [totalBetInfo])

  const totalCounts = useSingleCallResult(conitossContract, 'getHeadsTailsCount' /*[tokenAddress]*/)?.result
  const { headsCount, tailsCount } = useMemo(() => {
    return {
      headsCount: BigNumber.from((totalCounts && totalCounts[0].toString()) ?? 0).toNumber(),
      tailsCount: BigNumber.from((totalCounts && totalCounts[1].toString()) ?? 0).toNumber(),
    }
  }, [totalCounts])
  return useMemo(() => {
    if (!chainId && conitossContract) return NOT_APPLICABLE

    return {
      headsCount,
      tailsCount,
      totalBetsAmount,
      totalBetsCount,
      contract: conitossContract,
    }
  }, [conitossContract, chainId, totalBetsAmount, totalBetsCount, headsCount, tailsCount])
}
