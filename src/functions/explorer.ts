import { ChainId } from '@cronaswap/core-sdk'

const explorers = {
  etherscan: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  cronos: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/transaction/${data}`
      case 'token':
        return `${link}/address/${data}`
      case 'address':
        return `${link}/address/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },
}
interface ChainObject {
  [chainId: number]: {
    link: string
    builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

const chains: ChainObject = {
  [ChainId.ETHEREUM]: {
    link: 'https://etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.CRONOS]: {
    link: 'https://cronoscan.com',
    builder: explorers.cronos,
  },
  [ChainId.CRONOS_TESTNET]: {
    link: 'https://cronos.crypto.org/explorer/testnet3',
    builder: explorers.cronos,
  },
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const chain = chains[chainId]
  return chain.builder(chain.link, data, type)
}
