import { useActiveWeb3React } from '../../services/web3'
import { NEVER_RELOAD, useSingleCallResult } from '../../state/multicall/hooks'
import { useVotingEscrowContract } from '../../hooks/useContract'
import { useMemo } from 'react'

export function useLockedBalance() {
  const { account } = useActiveWeb3React()

  const cronaSupply = useSingleCallResult(useVotingEscrowContract(), 'supply', undefined)?.result?.[0]

  const veCronaSupply = useSingleCallResult(useVotingEscrowContract(), 'totalSupply', undefined)?.result?.[0]

  const veCrona = useSingleCallResult(useVotingEscrowContract(), 'balanceOf', account ? [account] : undefined)
    ?.result?.[0]

  const result = useSingleCallResult(useVotingEscrowContract(), 'locked', account ? [account] : undefined)?.result
  const lockAmount = result?.amount
  const lockEnd = result?.end

  return useMemo(
    () => ({ lockAmount, lockEnd, veCrona, cronaSupply, veCronaSupply }),
    [result?.amount, result?.end, veCrona, cronaSupply, veCronaSupply]
  )
}
