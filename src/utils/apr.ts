import BigNumber from 'bignumber.js'
import lpAprs from '../constants/lpAprs.json'

export const BSC_BLOCK_TIME = 1
export const CAKE_PER_BLOCK = new BigNumber(1.9025)
export const BLOCKS_PER_YEAR = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24 * 365) // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR)

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number
): number => {
  // apr div 4
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR).div(4)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cronaPriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cronaPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string
): { cronaRewardsApr: number; lpRewardsApr: number } => {
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeight)
  const cronaRewardsApr = yearlyCakeRewardAllocation.times(cronaPriceUsd).div(poolLiquidityUsd).times(100)
  let cronaRewardsAprAsNumber = null
  if (!cronaRewardsApr.isNaN() && cronaRewardsApr.isFinite()) {
    cronaRewardsAprAsNumber = cronaRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cronaRewardsApr: cronaRewardsAprAsNumber, lpRewardsApr }
}

export default null
