import { ChainId } from '@cronaswap/core-sdk'

const rpc = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.CRONOS]: 'https://rpc.cronaswap.org',
  [ChainId.CRONOS_TESTNET]: 'https://devrpc.cronaswap.org',
}

export default rpc
