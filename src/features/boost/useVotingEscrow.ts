import { CurrencyAmount, Token } from '@cronaswap/core-sdk'
import { useRewardPoolContract, useVotingEscrowContract } from 'app/hooks/useContract'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

export default function useVotingEscrow() {
  const addTransaction = useTransactionAdder()
  const reward = useRewardPoolContract()
  const contract = useVotingEscrowContract()

  // createLockWithMc
  const createLockWithMc = useCallback(
    async (amount: CurrencyAmount<Token> | undefined, unlockTime: number) => {
      if (amount?.quotient) {
        try {
          const tx = await contract?.createLock(amount?.quotient.toString(), unlockTime)
          return addTransaction(tx, { summary: 'Create CRONA lock' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, contract]
  )

  // withdrawWithMc
  const withdrawWithMc = useCallback(async () => {
    try {
      const tx = await contract?.withdraw()
      return addTransaction(tx, { summary: 'Withdraw CRONA' })
    } catch (e) {
      return e
    }
  }, [addTransaction, contract])

  // increaseAmountWithMc
  const increaseAmountWithMc = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await contract?.increaseAmount(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Increase Lock Amount' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, contract]
  )

  // increaseUnlockTimeWithMc
  const increaseUnlockTimeWithMc = useCallback(
    async (unlockTime: number) => {
      try {
        const tx = await contract?.increaseUnlockTime(unlockTime)
        return addTransaction(tx, { summary: 'Increase Lock Time' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, contract]
  )

  // getReward
  const claimRewards = useCallback(async () => {
    try {
      const tx = await reward?.getReward()
      return addTransaction(tx, { summary: 'Claim CRONA Rewards' })
    } catch (e) {
      return e
    }
  }, [addTransaction, reward])

  const claimHarvestRewards = useCallback(async () => {
    try {
      const tx = await reward?.harvest()
      return addTransaction(tx, { summary: 'Auto Boost Rewards' })
    } catch (e) {
      return e
    }
  }, [addTransaction, reward])

  return {
    claimRewards,
    claimHarvestRewards,
    createLockWithMc,
    increaseAmountWithMc,
    increaseUnlockTimeWithMc,
    withdrawWithMc,
  }
}
