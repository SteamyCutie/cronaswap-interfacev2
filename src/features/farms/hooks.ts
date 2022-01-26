import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { ChainId, CurrencyAmount, JSBI, MASTERCHEF_ADDRESS } from '@cronaswap/core-sdk'

import { useActiveWeb3React } from '../../services/web3'
import { Contract } from '@ethersproject/contracts'
import { Zero } from '@ethersproject/constants'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useDashboardV1Contract, useMasterChefContract, useMasterChefV2Contract } from '../../hooks/useContract'

import zip from 'lodash/zip'
import concat from 'lodash/concat'
import { Chef } from './enum'
import { CRONA } from '../../config/tokens'
import { useToken } from '../../hooks/Tokens'
import { BigNumber } from '@ethersproject/bignumber'

export function useChefContract(chef: Chef) {
  const masterChefV1Contract = useMasterChefContract()
  const masterChefV2Contract = useMasterChefV2Contract()

  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefV1Contract,
      [Chef.MASTERCHEF_V2]: masterChefV2Contract,
    }),
    [masterChefV1Contract, masterChefV2Contract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

export function useUserInfo(farm, token) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

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

  const contract = useChefContract(farm.chef)

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

export function useChefPositions(contract?: Contract | null) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }

    return [...Array(numberOfPools.toNumber()).keys()].map((pid) => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingCrona = useSingleContractMultipleData(args ? contract : null, 'pendingCrona', args)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args)

  return useMemo(() => {
    if (!pendingCrona || !userInfo) {
      return []
    }
    return zip(pendingCrona, userInfo)
      .map((data, i) => ({
        id: args[i][0],
        pendingCrona: data[0].result?.[0] || Zero,
        amount: data[1].result?.[0] || Zero,
      }))
      .filter(({ pendingCrona, amount }) => {
        return (pendingCrona && !pendingCrona.isZero()) || (amount && !amount.isZero())
      })
  }, [args, pendingCrona, userInfo])
}

export function usePositions() {
  return useChefPositions(useMasterChefV2Contract())
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

// Has used for CronaSwapV2 //////////////////////////////////////////

export const useCronaUsdcPrice = (): BigNumber | undefined => {
  const dashboard = useDashboardV1Contract()
  return useSingleCallResult(dashboard, 'rewardPriceInUSD')?.result?.[0]
}

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
