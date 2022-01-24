import { ChainId } from '@cronaswap/core-sdk'

const Mainnet = 'https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg'
const Cronos = 'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/icons/network/cronos.svg'
const Binance = 'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/icons/network/cronos.svg'
const CronosTestnet =
  'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/icons/network/cronos.svg'

export const NETWORK_ICON = {
  [ChainId.ETHEREUM]: Mainnet,
  [ChainId.BSC]: Binance,
  [ChainId.CRONOS]: Cronos,
  [ChainId.CRONOS_TESTNET]: CronosTestnet,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.BSC]: 'Binance',
  [ChainId.CRONOS]: 'Cronos',
  [ChainId.CRONOS_TESTNET]: 'Cronos Testnet',
}
