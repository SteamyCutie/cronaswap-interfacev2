import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { useCallback } from 'react'
import { useChefContract } from './hooks'
import { Chef } from './enum'

export default function useMasterChef(chef: Chef) {
  const contract = useChefContract(chef)

  // Deposit
  const deposit = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        return await contract?.deposit(pid, amount.toString())
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  // Withdraw
  const withdraw = useCallback(
    async (pid: number, amount: BigNumber) => {
      try {
        return await contract?.withdraw(pid, amount)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const harvest = useCallback(
    async (pid: number) => {
      try {
        return await contract?.deposit(pid, Zero)
      } catch (e) {
        console.error(e)
        return e
      }
    },
    [contract]
  )

  const harvestAll = useCallback(async () => {
    try {
      return await contract?.harvestAllRewards()
    } catch (e) {
      console.error(e)
      return e
    }
  }, [contract])

  return { deposit, withdraw, harvest, harvestAll }
}
