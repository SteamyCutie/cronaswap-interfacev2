import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useContract } from 'app/hooks'
import SMART_CHEF_ABI from 'app/constants/abis/smartChef.json'

export default function useSmartChef(pool) {
  const contract = useContract(pool.smartChef, SMART_CHEF_ABI)

  // Deposit
  const deposit = useCallback(
    async (amount: BigNumber) => {
      try {
        return await contract?.deposit(amount.toString())
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (amount: BigNumber) => {
      try {
        return await contract?.withdraw(amount)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  // Withdraw
  const emergencyWithdraw = useCallback(async () => {
    try {
      return await contract?.emergencyWithdraw()
    } catch (e) {
      console.error(e)
      return e
    }
  }, [contract])

  const harvest = useCallback(async () => {
    try {
      return await contract?.deposit(Zero)
    } catch (e) {
      console.error(e)
      return e
    }
  }, [contract])

  return { deposit, withdraw, emergencyWithdraw, harvest }
}
