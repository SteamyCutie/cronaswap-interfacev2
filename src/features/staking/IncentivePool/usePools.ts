import { POOLS } from 'app/constants/pools'
import { useDashboardV2Contract } from 'app/hooks'
import useTokenBalance from 'app/hooks/useTokenBalance'
import { useActiveWeb3React } from 'app/services/web3'

import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const usePools = () => {
  const { chainId } = useActiveWeb3React()
  const dashboardContract = useDashboardV2Contract()

  const [pools, setPools] = useState<any | undefined>()

  const fetchAllPools = useCallback(async () => {
    // Reset pools list
    const incentivePools = Object.keys(POOLS[chainId]).map((key) => {
      return { ...POOLS[chainId][key], smartChef: key }
    })

    // Array Pids
    // const poolPids = incentivePools.map((pool: any) => {
    //   return pool.pid
    // })

    // const { tokenPrice, totalTvlInUSD, allocPoint, apy, tvl, tvlInUSD } = await dashboardContract?.valueOfAsset()

    const pools = incentivePools
      // .filter((pool: any) => {
      //     //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
      //     return !POOL_DENY.includes(pool?.id) && pairs.find((pair: any) => pair?.id === pool?.pair)
      // })
      .map((pool: any) => {
        return {
          ...pool,
          tvl: 1,
          apr: 0.12,
        }
      })

    // console.log('pools:', pools)
    const sorted = _.orderBy(pools, ['apr'], ['desc'])

    setPools({ pools: sorted, userPools: [], stakePools: [] })
  }, [])

  useEffect(() => {
    fetchAllPools()
  }, [fetchAllPools])

  return pools
}

export default usePools
