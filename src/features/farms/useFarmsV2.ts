import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { FARMSV2 } from '../../constants/farmsv2'
import { useDashboardV2Contract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../services/web3'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useFarmsV2 = () => {
  const { account, chainId } = useActiveWeb3React()

  const [farms, setFarms] = useState<any | undefined>()
  const dashboardContract = useDashboardV2Contract()

  const fetchAllFarms = useCallback(async () => {
    if (FARMSV2[chainId] === undefined || Object.keys(FARMSV2[chainId]).length === 0) {
      setFarms({ farms: [], userFarms: [], stakeFarms: [] })
      return
    }
    // Reset pools list
    const farmingPools = Object.keys(FARMSV2[chainId]).map((key) => {
      return { ...FARMSV2[chainId][key], lpToken: key }
    })

    // Array Pids
    const poolPids = farmingPools.map((pool: any) => {
      return pool.pid
    })

    // const { tokenPrice, totalTvlInUSD, allocPoint, apy, boostApy, tvl, tvlInUSD } =
    //   await dashboardContract?.infoOfPools(poolPids)

    // boostInfoOfPools
    const { tokenPrice, totalTvlInUSD, allocPoint, apy, boostApy, tvl, tvlInUSD } =
      await dashboardContract?.boostInfoOfPools(
        poolPids,
        account ? account : '0x000000000000000000000000000000000000dead'
      )

    const farms = farmingPools
      // .filter((pool: any) => {
      //     //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
      //     return !POOL_DENY.includes(pool?.id) && pairs.find((pair: any) => pair?.id === pool?.pair)
      // })
      .map((pool: any) => {
        return {
          ...pool,
          chef: 1,
          type: 'CLP',
          tokenPrice: tokenPrice / 1e18,
          totalTvlInUSD: totalTvlInUSD / 1e18,
          flpBalance: tvl[pool.id] / 1e18,
          tvl: tvlInUSD[pool.id] / 1e18,
          apr: apy[pool.id] / 1e16,
          lpPrice: tvlInUSD[pool.id] / tvl[pool.id],
          boostApr: boostApy ? boostApy[pool.id] / 1e16 : (apy[pool.id] * 2.5) / 1e16, // max boost 2.5x
          multiplier: Number(allocPoint[pool.id]),
        }
      })

    // console.log('farms:', farms)
    const sorted = _.orderBy(farms, ['multiplier'], ['desc'])

    setFarms({ farms: sorted, userFarms: [], stakeFarms: [] })

    // const staking = stakePools
    //     // .filter((pool: any) => {
    //     //     //console.log(KASHI_PAIRS.includes(Number(pool.id)), pool, Number(pool.id))
    //     //     return !POOL_DENY.includes(pool?.id) && pairs.find((pair: any) => pair?.id === pool?.pair)
    //     // })
    //     .map((pool: any) => {

    //         return {
    //             ...pool,
    //             type: 'FLP',
    //             tokenPrice: tokenPrice / 1e18,
    //             totalTvlInUSD: totalTvlInUSD / 1e18,
    //             flpBalance: tvl[pool.id] / 1e18,
    //             tvl: tvlInUSD[pool.id] / 1e18,
    //             apr: apy[pool.id] / 1e18,
    //             multiplier: `${allocPoint[pool.id].div(100).toString()}x`,
    //         }
    //     })

    // setFarms({ farms: sorted, userFarms: [], stakeFarms: staking})

    // if (account) {
    //     const userFarmDetails = await boringHelperContract?.pollPools(account, ids)
    //     //console.log('userFarmDetails:', userFarmDetails)
    //     const userFarms = userFarmDetails
    //         .filter((farm: any) => {
    //             return farm.balance.gt(BigNumber.from(0)) || farm.pending.gt(BigNumber.from(0))
    //         })
    //         .map((farm: any) => {
    //             //console.log('userFarm:', farm.id.toNumber(), farm)

    //             const id = farm.id.toNumber()
    //             const farmDetails = sorted.find((pair: any) => pair.id === id)
    //             const deposited = Fraction.from(farm.balance, BigNumber.from(10).pow(18)).toString(18)
    //             const depositedUSD =
    //                 farmDetails.slpBalance && Number(farmDetails.slpBalance / 1e18) > 0
    //                     ? (Number(deposited) * Number(farmDetails.tvl)) / (farmDetails.slpBalance / 1e18)
    //                     : 0
    //             const pending = Fraction.from(farm.pending, BigNumber.from(10).pow(18)).toString(18)

    //             return {
    //                 ...farmDetails,
    //                 type: farmDetails.type, // KMP or SLP
    //                 depositedLP: deposited,
    //                 depositedUSD: depositedUSD,
    //                 pendingSushi: pending
    //             }
    //         })
    //     setFarms({ farms: sorted, userFarms: userFarms })
    //     //console.log('userFarms:', userFarms)
    // } else {
    //     setFarms({ farms: sorted, userFarms: [] })
    // }
  }, [])

  useEffect(() => {
    fetchAllFarms()
  }, [fetchAllFarms])

  return farms
}

export default useFarmsV2
