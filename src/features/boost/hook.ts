import { useActiveWeb3React } from '../../services/web3'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleMethods } from '../../state/multicall/hooks'
import { useRewardPoolContract, useVotingEscrowContract } from '../../hooks/useContract'
import { useMemo } from 'react'

export function useLockedBalance() {
  const { account } = useActiveWeb3React()

  // const cronaSupply = useSingleCallResult(useVotingEscrowContract(), 'supply', undefined)?.result?.[0]

  // const veCronaSupply = useSingleCallResult(useVotingEscrowContract(), 'totalSupply', undefined)?.result?.[0]

  // const veCrona = useSingleCallResult(useVotingEscrowContract(), 'balanceOf', account ? [account] : undefined)
  //   ?.result?.[0]

  // const result = useSingleCallResult(useVotingEscrowContract(), 'locked', account ? [account] : undefined)?.result
  // const lockAmount = result?.amount
  // const lockEnd = result?.end

  // return useMemo(
  //   () => ({ lockAmount, lockEnd, veCrona, cronaSupply, veCronaSupply }),
  //   [result?.amount, result?.end, veCrona, cronaSupply, veCronaSupply]
  // )

  const harvestRewards = useSingleCallResult(useRewardPoolContract(), 'calculateHarvestCronaRewards', undefined)?.result
  const rewards = useSingleCallResult(
    useRewardPoolContract(),
    'calculateUserRewards',
    account ? [account] : undefined
  )?.result

  const booster = useVotingEscrowContract()
  const callsData = useMemo(
    () => [
      { methodName: 'supply', callInputs: [] }, // cronaSupply
      { methodName: 'totalSupply', callInputs: [] }, // veCronaSupply
      { methodName: 'balanceOf', callInputs: [account ? account : undefined] }, // veCrona
      { methodName: 'locked', callInputs: [account ? account : undefined] }, // user locked info
    ],
    []
  )

  const results = useSingleContractMultipleMethods(booster, callsData)

  // lockAmount, lockEnd, veCrona, cronaSupply, veCronaSupply
  if (results && Array.isArray(results) && results.length === callsData.length) {
    const [{ result: cronaSupply }, { result: veCronaSupply }, { result: veCrona }, { result: lockInfo }] = results
    return {
      cronaSupply: cronaSupply?.[0],
      veCronaSupply: veCronaSupply?.[0],
      veCrona: veCrona?.[0],
      lockEnd: lockInfo?.end,
      lockAmount: lockInfo?.amount,
      rewards: rewards?.[0],
      harvestRewards: harvestRewards?.[0],
    }
  }

  return {
    cronaSupply: undefined,
    veCronaSupply: undefined,
    veCrona: undefined,
    lockEnd: undefined,
    lockAmount: undefined,
    rewards: undefined,
    harvestRewards: undefined,
  }
}
