import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'
import { PoolIds } from 'app/constants/types'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { CurrencyAmount, Token } from '@cronaswap/core-sdk'

export default function useIfoPool(contract: Contract) {
  const addTransaction = useTransactionAdder()

  // depositPool
  const depositPool = useCallback(
    async (amount: CurrencyAmount<Token> | undefined, poolId: string) => {
      if (amount?.quotient) {
        try {
          const tx = await contract?.depositPool(amount?.quotient.toString(), poolId === PoolIds.poolBasic ? 0 : 1)

          // const args = [amount?.quotient.toString(), unlockTime]

          // const gasLimit = await contract.estimateGas.createLockWithMc(...args)
          // const tx = await contract.createLockWithMc(...args, {
          //     gasLimit: gasLimit.mul(120).div(100),
          // })

          return addTransaction(tx, { summary: 'Commit Success' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, contract]
  )

  // harvestPool
  const harvestPool = useCallback(
    async (poolId: string) => {
      try {
        const tx = await contract?.harvestPool(poolId === PoolIds.poolBasic ? 0 : 1)
        return addTransaction(tx, { summary: 'Claim IFO Tokens' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, contract]
  )

  return { harvestPool, depositPool }
}
