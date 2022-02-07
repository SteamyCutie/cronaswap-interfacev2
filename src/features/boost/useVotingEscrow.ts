import { CurrencyAmount, Token } from '@cronaswap/core-sdk'
import { useCallWithGasPrice } from 'app/hooks/useCallWithGasPrice'
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
          // const tx = await contract?.createLockWithMc(amount?.quotient.toString(), unlockTime)

          const args = [amount?.quotient.toString(), unlockTime]

          const gasLimit = await contract.estimateGas.createLockWithMc(...args)
          const tx = await contract.createLockWithMc(...args, {
            gasLimit: gasLimit.mul(120).div(100),
          })

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
      // const tx = await contract?.withdraw()

      const args = []
      const gasLimit = await contract.estimateGas.withdraw(...args)
      const tx = await contract.withdraw(...args, {
        gasLimit: gasLimit.mul(120).div(100),
      })

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
          // const tx = await contract?.increaseAmountWithMc(amount?.quotient.toString())

          const args = [amount?.quotient.toString()]

          const gasLimit = await contract.estimateGas.increaseAmountWithMc(...args)
          const tx = await contract.increaseAmountWithMc(...args, {
            gasLimit: gasLimit.mul(120).div(100),
          })

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
        // const tx = await contract?.increaseUnlockTimeWithMc(unlockTime)

        const args = [unlockTime]

        const gasLimit = await contract.estimateGas.increaseUnlockTimeWithMc(...args)
        const tx = await contract.increaseUnlockTimeWithMc(...args, {
          gasLimit: gasLimit.mul(120).div(100),
        })

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

  // harvest
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
