import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId, CurrencyAmount, JSBI, MASTERCHEF_ADDRESS } from '@cronaswap/core-sdk'

import { useActiveWeb3React } from '../../services/web3'
import { Contract } from '@ethersproject/contracts'
import { Zero } from '@ethersproject/constants'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useMasterChefContract } from '../../hooks/useContract'

import zip from 'lodash/zip'
import concat from 'lodash/concat'
import { Chef } from './enum'
import { CRONA } from '../../config/tokens'
import { useToken } from '../../hooks/Tokens'

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract,
      [Chef.MASTERCHEF_V2]: masterChefContract,
    }),
    [masterChefContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(0)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return {
    amount: amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined,
  }
}

export function usePendingCrona(farm) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(0)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingCrona', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(CRONA[chainId], amount) : undefined
}

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }

    //filter 0 pool
    return [...Array(numberOfPools.toNumber()).keys()]
      .filter((pid) => pid != 0)
      .map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingCrona = useSingleContractMultipleData(args ? contract : null, 'pendingCrona', args)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  const getChef = useCallback(() => {
    if (MASTERCHEF_ADDRESS[chainId] === contract.address) {
      return Chef.MASTERCHEF
    }

    // else if (MASTERCHEF_V2_ADDRESS[chainId] === contract.address) {
    //   return Chef.MASTERCHEF_V2
    // }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingCrona || !userInfo) {
      return []
    }
    return zip(pendingCrona, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingCrona: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
        chef: getChef(),
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingCrona, amount }) => {
        return (pendingCrona && !pendingCrona.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingCrona, userInfo])
}

export function usePositions(chainId = undefined) {
  // const [masterChefV1Positions, masterChefV2Positions] = [
  //   useChefPositions(useMasterChefContract(), undefined, chainId),
  //   useChefPositions(useMasterChefV2Contract(), undefined, chainId),
  // ]
  // return concat(masterChefV1Positions, masterChefV2Positions)

  const [masterChefV1Positions] = [useChefPositions(useMasterChefContract(), undefined, chainId)]
  return concat(masterChefV1Positions)
}

export function useCronaFarms(contract?: Contract | null) {
  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!numberOfPools) {
      return
    }

    //filter 0 pools
    return [...Array(numberOfPools.toNumber()).keys()].filter((pid) => pid != 0).map((pid) => [String(pid)])
  }, [numberOfPools])

  const poolInfo = useSingleContractMultipleData(args ? contract : null, 'poolInfo', args)

  return useMemo(() => {
    if (!poolInfo) {
      return []
    }
    return zip(poolInfo).map((data, i) => ({
      id: args[i][0],
      lpToken: data[0].result?.['lpToken'] || '',
      allocPoint: data[0].result?.['allocPoint'] || '',
      lastRewardTime: data[0].result?.['lastRewardTime'] || '',
      accCronaPerShare: data[0].result?.['accCronaPerShare'] || '',
    }))
  }, [args, poolInfo])
}

export function useFarms() {
  return useCronaFarms(useMasterChefContract())
}

export function useCronaMasterChefInfo(contract) {
  const cronaPerSecond = useSingleCallResult(contract ? contract : null, 'cronaPerSecond', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const totalAllocPoint = useSingleCallResult(contract ? contract : null, 'totalAllocPoint', undefined, NEVER_RELOAD)
    ?.result?.[0]

  return useMemo(() => ({ cronaPerSecond, totalAllocPoint }), [cronaPerSecond, totalAllocPoint])
}

export function useMasterChefInfo() {
  return useCronaMasterChefInfo(useMasterChefContract())
}

// Has used for CronaSwapV2
export function useTokenInfo(tokenContract?: Contract | null) {
  const _totalSupply = useSingleCallResult(tokenContract ? tokenContract : null, 'totalSupply', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const _burnt = useSingleCallResult(
    tokenContract ? tokenContract : null,
    'balanceOf',
    ['0x000000000000000000000000000000000000dEaD'],
    NEVER_RELOAD
  )?.result?.[0]

  const totalSupply = _totalSupply ? JSBI.BigInt(_totalSupply.toString()) : JSBI.BigInt(0)
  const burnt = _burnt ? JSBI.BigInt(_burnt.toString()) : JSBI.BigInt(0)

  const circulatingSupply = JSBI.subtract(totalSupply, burnt)

  const token = useToken(tokenContract.address)

  return useMemo(() => {
    if (!token) {
      return {
        totalSupply: '0',
        burnt: '0',
        circulatingSupply: '0',
      }
    }

    return {
      totalSupply: CurrencyAmount.fromRawAmount(token, totalSupply).toFixed(0),
      burnt: CurrencyAmount.fromRawAmount(token, burnt).toFixed(0),
      circulatingSupply: CurrencyAmount.fromRawAmount(token, circulatingSupply).toFixed(0),
    }
  }, [totalSupply, burnt, circulatingSupply, token])
}

/*
  Currently expensive to render farm list item. The infinite scroll is used to
  to minimize this impact. This hook pairs with it, keeping track of visible
  items and passes this to <InfiniteScroll> component.
*/
export function useInfiniteScroll(items): [number, Dispatch<number>] {
  const [itemsDisplayed, setItemsDisplayed] = useState(10)
  useEffect(() => setItemsDisplayed(10), [items.length])
  return [itemsDisplayed, setItemsDisplayed]
}
