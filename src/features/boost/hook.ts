import { useActiveWeb3React } from '../../services/web3'
import { NEVER_RELOAD, useSingleCallResult } from '../../state/multicall/hooks'
import { useVotingEscrowContract } from '../../hooks/useContract'
import { useMemo } from 'react'

export function useLockedBalance() {
  const { account } = useActiveWeb3React()

  const veCrona = useSingleCallResult(useVotingEscrowContract(), 'balanceOf', account ? [account] : undefined)
    ?.result?.[0]
  //   const veCrona = useSingleCallResult(useVotingEscrowContract(), 'balanceOf', account ? [account] : undefined, NEVER_RELOAD)
  //   ?.result?.[0]
  // const veCrona = 0

  const result = useSingleCallResult(useVotingEscrowContract(), 'locked', account ? [account] : undefined)?.result
  const lockAmount = result?.amount
  const lockEnd = result?.end

  return useMemo(() => ({ lockAmount, lockEnd, veCrona }), [result?.amount, result?.end, veCrona])
}
