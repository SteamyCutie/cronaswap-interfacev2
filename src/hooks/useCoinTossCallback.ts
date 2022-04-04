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

const NOT_APPLICABLE = { error: 'Not Applicable!' }

export default function useCoinTossCallback(
  selectedCurrency: Currency | undefined,
  inputValue: string | undefined
): {
  error?: string
  rewards?: undefined | BigNumber
  claimRewards?: undefined | (() => Promise<{ tx: string; error: string }>)
  approvalState?: ApprovalState
  approveCallback?: () => Promise<void>
  contract?: Contract
  totalBetsCount?: number
  totalBetsAmount?: BigNumber
  headsCount?: number
  tailsCount?: number
  betsCountByPlayer?: number
  minBetAmount?: BigNumber
  maxBetAmount?: BigNumber
} {
  const { chainId, account } = useActiveWeb3React()
  const conitossContract = useCoinTossContract()
  const balance = maxAmountSpend(useCurrencyBalance(account ?? undefined, selectedCurrency))
  const selectedCurrencyAmount = useMemo(
    () => tryParseAmount(inputValue, selectedCurrency),
    [selectedCurrency, inputValue]
  )
  const [approvalState, approveCallback] = useApproveCallback(selectedCurrencyAmount, conitossContract?.address)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const addTransaction = useTransactionAdder()

  const [rewards, setrewards] = useState<BigNumber>()
  const [totalBetsCount, settotalBetsCount] = useState<number>(0)
  const [totalBetsAmount, settotalBetsAmount] = useState<BigNumber>()
  const [headsCount, setheadsCount] = useState<number>(0)
  const [tailsCount, settailsCount] = useState<number>(0)
  const [betsCountByPlayer, setbetsCountByPlayer] = useState<number>(0)
  const [minBetAmount, setminBetAmount] = useState<BigNumber>()
  const [maxBetAmount, setmaxBetAmount] = useState<BigNumber>()

  useEffect(() => {
    async function FetchPlayerInfo() {
      try {
        const tokenAddress = selectedCurrency?.wrapped.address
        const totalBetInfo = await conitossContract.getBetsAmountAndCountByToken(tokenAddress)

        settotalBetsCount(totalBetInfo?.totalBetsCount.toNumber())
        settotalBetsAmount(totalBetInfo?.totalBetsAmount)
        const totalCounts = await conitossContract.getHeadsTailsCount()
        setheadsCount(totalCounts[0].toNumber())
        settailsCount(totalCounts[1].toNumber())

        setbetsCountByPlayer((await conitossContract.getBetsCountByPlayer()).toNumber())
        const betAmountRange = await conitossContract.getBetAmountRangeByToken(tokenAddress)
        setminBetAmount(betAmountRange[0])
        setmaxBetAmount(betAmountRange[1])
        if (account) {
          setrewards(
            await conitossContract.getRewardsAmountByPlayer(tokenAddress, {
              from: account,
            })
          )
        }
      } catch {}
    }

    FetchPlayerInfo()
  }, [account, selectedCurrency, selectedCurrencyAmount])
  return useMemo(() => {
    if (!chainId) return NOT_APPLICABLE

    const hasInputAmount = Boolean(selectedCurrencyAmount?.greaterThan('0'))
    const sufficientBalance = selectedCurrencyAmount && balance && !balance.lessThan(selectedCurrencyAmount)
    return {
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
        ? undefined
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
  }, [conitossContract, chainId, selectedCurrencyAmount, balance, addTransaction])
}
