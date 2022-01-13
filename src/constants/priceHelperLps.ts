import tokens from './tokens'
import { SerializedFarmConfig } from './types'

// migrate from cronaswapv1
const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absense of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  {
    pid: null,
    lpSymbol: 'USDC-CRO LP',
    lpAddresses: {
      25: '0x0625A68D25d304aed698c806267a4e369e8Eb12a',
      338: '0xf6fe38ed67f19ec20541b79de7ac191668bb39c9',
    },
    token: tokens.usdc,
    quoteToken: tokens.wcro,
  },
]

export default priceHelperLps
