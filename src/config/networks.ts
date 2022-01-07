import { ChainId } from '@cronaswap/core-sdk'

const Avalanche = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/avalanche.jpg'
const Mainnet = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg'
const Cronos = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/bsc.jpg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.CRONOS]: Cronos,
  [ChainId.CRONOS_TESTNET]: Avalanche,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.CRONOS]: 'Cronos Mainnet',
  [ChainId.CRONOS_TESTNET]: 'Cronos Testnet',
}
