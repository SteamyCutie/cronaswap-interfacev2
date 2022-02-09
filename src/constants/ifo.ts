import { Token, ChainId } from '@cronaswap/core-sdk'
import tokens from 'pages/tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { FARMS } from './farms'
import { Ifo } from './types'
import { CRONA, USDC } from './../config/tokens';

// export const cronaCroLpToken = process.env.REACT_APP_CHAIN_ID === ChainId.MAINNET.toString()
//   ? new Token(ChainId.MAINNET, farms[1].lpAddresses[ChainId.MAINNET], 18, farms[1].lpSymbol)
//   : new Token(ChainId.TESTNET, farms[1].lpAddresses[ChainId.TESTNET], 18, farms[1].lpSymbol)


// Mainnet
// export const usdcUsdtLpToken = new Token(chainId, Object.keys(FARMS[chainId])[10], 18, Object.values(FARMS[chainId])[10].name)
// Testnet
// export const usdcUsdtLpToken = {
//   [ChainId.CRONOS]: new Token(ChainId.CRONOS, Object.keys(FARMS[ChainId.CRONOS])[10], 18, Object.values(FARMS[ChainId.CRONOS])[10].name),
//   [ChainId.CRONOS_TESTNET]: new Token(ChainId.CRONOS_TESTNET, Object.keys(FARMS[ChainId.CRONOS_TESTNET])[2], 18, Object.values(FARMS[ChainId.CRONOS_TESTNET])[2].name)
// }

// LIVE 0xd63EAab556d1177F5C1a149E4aB0aD78fF627E1B
// SOON 0x3A65009722fB7ae681f39c06BE3D0C83e71FC48e
const ifos: Ifo[] = [
  {
    id: 'beta',
    address: '0xd63EAab556d1177F5C1a149E4aB0aD78fF627E1B',
    isActive: true,
    name: 'Beta Protocol (BETA)',
    poolBasic: {
      saleAmount: '30,000 BETA',
      raiseAmount: '$30,0000',
      cronaToBurn: '$0',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '70,000 BETA',
      raiseAmount: '$700,000',
      cronaToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: USDC[ChainId.CRONOS_TESTNET],
    // token: tokens.cross,
    releaseBlockNumber: 13491500,
    campaignId: '511160000',
    twitterUrl: 'https://twitter.com/',
    telegramUrl: 'https://twitter.com/',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmQqpknHvuQwshVP259qFxfQsxiWbQ9SLMebohDeRwRzKg',
    description:
      'CronaSwap is the first decentralized exchange platform on the Cronos Chain to offer the lowest transaction fees (0.25%). You can swap CRC-20 tokens easily on the Cronos Chain network that guarantees superior speed and much lower network transaction costs. ',
    tokenOfferingPrice: 0.025,
    version: 2,
  }
]

export default ifos
