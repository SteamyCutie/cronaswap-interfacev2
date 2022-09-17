import { CurrencyAmount, JSBI, ONE } from '@cronaswap/core-sdk'
import BigNumber from 'bignumber.js'
import { useContract, useDashboardV2Contract, useTokenContract } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useBlockNumber } from 'app/state/application/hooks'
import { useSingleCallResult, useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SMART_CHEF_ABI from 'app/constants/abis/smartChef.json'
import BATCH_NODE_ABI from 'app/constants/abis/batch-node.json'
import { parseUnits } from '@ethersproject/units'

export function useUserInfo(pool, token) {
  const { account } = useActiveWeb3React()
  const contract = useContract(pool.smartChef, SMART_CHEF_ABI)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [pool, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return {
    amount: amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined,
  }
}

export function usePendingReward(pool, token) {
  const { account } = useActiveWeb3React()
  const contract = useContract(pool.smartChef, SMART_CHEF_ABI)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(account)]
  }, [pool, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingReward', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
}

export function useBatchInfo(batch, account, earningToken) {
  const dashboardContract = useDashboardV2Contract()

  const earningTokenPrice = useSingleCallResult(dashboardContract, 'valueOfAsset', [
    earningToken.address,
    parseUnits('1', earningToken.decimals),
  ])?.result

  const contract = useContract(batch.batchNode, BATCH_NODE_ABI);

  const pending = useSingleCallResult(contract, 'pending', [account])?.result
  const bondsAvailable = useSingleCallResult(contract, 'available')?.result
  const batchLimit = useSingleCallResult(contract, 'batchLimit')?.result
  const batchSold = useSingleCallResult(contract, 'batchSold')?.result
  const expiration = useSingleCallResult(contract, 'expiration')?.result
  const price = useSingleCallResult(contract, 'price')?.result
  const rewardPerNodePerSecond = useSingleCallResult(contract, 'rewardPerNodePerSecond')?.result
  const startTime = useSingleCallResult(contract, 'startTime')?.result
  const userLimit = useSingleCallResult(contract, 'userLimit')?.result

  return {
    pending: pending?.[0],
    bondsAvailable: bondsAvailable?.[0],
    batchLimit: batchLimit?.[0],
    batchSold: batchSold?.[0],
    expiration: expiration?.[0],
    price: price?.[0],
    rewardPerNodePerSecond: rewardPerNodePerSecond?.[0],
    startTime: startTime?.[0],
    userLimit: userLimit?.[0],
    earningTokenPrice: earningTokenPrice?.valueInUSD
  }
}

// fetch pools info
export function usePoolsInfo(pool) {
  const dashboardContract = useDashboardV2Contract()
  const contract = useContract(pool.smartChef, SMART_CHEF_ABI)
  const blockNumber = useBlockNumber()

  // total staked
  const totalStaked = useSingleCallResult(useTokenContract(pool.stakingToken.id, false), 'balanceOf', [
    pool.smartChef,
  ])?.result
  const stakingTokenPrice = useSingleCallResult(dashboardContract, 'valueOfAsset', [
    pool.pid == 8 ? '0xadbd1231fb360047525bedf962581f3eee7b49fe' : pool.stakingToken.id, // pid=8 is grona, grona no liquidity no price, use crona as token
    parseUnits('1', pool.stakingToken.decimals),
  ])?.result
  const earningTokenPrice = useSingleCallResult(dashboardContract, 'valueOfAsset', [
    pool.earningToken.id,
    parseUnits('1', pool.earningToken.decimals),
  ])?.result

  // block info
  const callsData = useMemo(
    () => [
      { methodName: 'startBlock', callInputs: [] }, // startBlock
      { methodName: 'bonusEndBlock', callInputs: [] }, // bonusEndBlock
    ],
    []
  )

  const results = useSingleContractMultipleMethods(contract, callsData)

  if (results && Array.isArray(results) && results.length === callsData.length) {
    const [{ result: startBlock }, { result: bonusEndBlock }] = results

    const aprVaule = getPoolApr(
      Number(stakingTokenPrice?.valueInUSD?.toFixed(18)), //FIXED 18 decimal
      Number(earningTokenPrice?.valueInUSD?.toFixed(18)), //FIXED 18 decimal
      Number(totalStaked?.[0]?.toFixed(18)), //FIXED 18 decimal
      Number(pool.tokenPerBlock)
    )

    return {
      apr: aprVaule,
      endInBlock: blockNumber < Number(bonusEndBlock?.[0]) ? Number(bonusEndBlock?.[0]) - blockNumber : 0,
      bonusEndBlock: bonusEndBlock?.[0],
      totalStaked: totalStaked?.[0],
      totalStakedInUSD: Number(totalStaked?.[0]),
      stakingTokenPrice: stakingTokenPrice?.valueInUSD,
      earningTokenPrice: earningTokenPrice?.valueInUSD,
    }
  }

  return {
    apr: 100,
    endInBlock: undefined,
    bonusEndBlock: undefined,
    totalStaked: undefined,
    totalStakedInUSD: undefined,
    stakingTokenPrice: undefined,
    earningTokenPrice: undefined,
  }
}

// Calc pool APR
export const CRONOS_BLOCK_TIME = 6 // FIXME block time
export const BLOCKS_PER_YEAR = (60 / CRONOS_BLOCK_TIME) * 60 * 24 * 365 // 10512000

export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}
