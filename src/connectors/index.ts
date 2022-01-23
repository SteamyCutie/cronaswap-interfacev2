import { ChainId } from '@cronaswap/core-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '../entities/NetworkConnector'

// import { BscConnector } from '@binance-chain/bsc-connector'
// import { FortmaticConnector } from '../entities/FortmaticConnector'
// import { PortisConnector } from '@web3-react/portis-connector'
// import { TorusConnector } from '@web3-react/torus-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { DeFiWeb3Connector } from 'deficonnect' // crypto.com defi wallet
import { Web3Provider } from '@ethersproject/providers'

const RPC = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.alchemyapi.io/v2/q1gSNoSMEzJms47Qn93f9-9Xg5clkmEC',
  [ChainId.CRONOS]: 'https://rpcv2.cronaswap.org',
  [ChainId.CRONOS_TESTNET]: 'https://devrpc.cronaswap.org',
}

export function getNetwork(defaultChainId, urls = RPC) {
  return new NetworkConnector({
    defaultChainId,
    urls,
  })
}

export const network = new NetworkConnector({
  defaultChainId: 25,
  urls: RPC,
})

let networkLibrary: Web3Provider | undefined

export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

const supportedChainIds = [
  1, // mainnet
  25, //cronos mainnet
  338, //cronos testnet
]

export const injected = new InjectedConnector({
  supportedChainIds,
})

export const cryptowallet = new DeFiWeb3Connector({
  supportedChainIds: [25, 338],
  rpc: {
    25: 'https://evm-cronos.crypto.org/', // cronos mainet
    338: 'https://cronos-testnet-3.crypto.org:8545', // cronos testnet
  },
  pollingInterval: 15000,
})

// mainnet only
// export const walletconnect = new WalletConnectConnector({
//   rpc: RPC,
//   bridge: 'https://bridge.walletconnect.org',
//   qrcode: true,
//   supportedChainIds,
//   // pollingInterval: 15000,
// })

// // mainnet only
// export const fortmatic = new FortmaticConnector({
//   apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY ?? '',
//   chainId: 1,
// })

// // mainnet only
// export const portis = new PortisConnector({
//   dAppId: process.env.NEXT_PUBLIC_PORTIS_ID ?? '',
//   networks: [1],
// })

// // mainnet only
// export const walletlink = new WalletLinkConnector({
//   url: RPC[ChainId.ETHEREUM],
//   appName: 'CronaSwap',
//   appLogoUrl: 'https://raw.githubusercontent.com/cronaswap/default-token-list/main/tokens/assets/cronaswapx200.png',
// })

// // mainnet only
// export const torus = new TorusConnector({
//   chainId: 1,
// })

// // binance only
// export const binance = new BscConnector({ supportedChainIds: [56] })
