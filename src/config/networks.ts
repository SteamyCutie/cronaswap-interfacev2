import { ChainId } from '@cronaswap/core-sdk'

const Mainnet = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg'
const Cronos = 'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/icons/network/cronos.png'
const Binance = 'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/icons/network/bsc.svg'
const CronosTestnet =
  'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/icons/network/cronos.png'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.BSC]: Binance,
  [ChainId.BSC_TESTNET]: Binance,
  [ChainId.CRONOS]: Cronos,
  [ChainId.CRONOS_TESTNET]: CronosTestnet,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.BSC]: 'Binance',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.CRONOS]: 'Cronos',
  [ChainId.CRONOS_TESTNET]: 'Cronos Testnet',
}
