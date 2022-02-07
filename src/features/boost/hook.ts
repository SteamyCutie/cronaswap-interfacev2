import { useActiveWeb3React } from '../../services/web3'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleMethods } from '../../state/multicall/hooks'
import { useRewardPoolContract, useVotingEscrowContract } from '../../hooks/useContract'
import { useMemo } from 'react'

export function useLockedBalance() {
  const { account } = useActiveWeb3React()

  if (!account) {
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
