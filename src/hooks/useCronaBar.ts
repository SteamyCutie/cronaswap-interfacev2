import { Currency, CurrencyAmount, Token } from '@cronaswap/core-sdk'

import { useCallback } from 'react'
import { useMasterChefContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'

const useCronaBar = () => {
  const addTransaction = useTransactionAdder()
  const masterchefContract = useMasterChefContract()

  const enterStaking = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await masterchefContract?.enterStaking(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Enter CronaBar' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, masterchefContract]
  )

  const leaveStaking = useCallback(
    async (amount: CurrencyAmount<Token> | undefined) => {
      if (amount?.quotient) {
        try {
          const tx = await masterchefContract?.leaveStaking(amount?.quotient.toString())
          return addTransaction(tx, { summary: 'Leave CronaBar' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, masterchefContract]
  )

  return { enterStaking, leaveStaking }
}

export default useCronaBar
