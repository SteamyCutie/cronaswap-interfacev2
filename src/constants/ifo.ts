import { Token, ChainId } from '@cronaswap/core-sdk'
import tokesn from 'pages/tokens'
import { FARMS } from './farms'
import { Ifo } from './types'

// export const cronaCroLpToken = process.env.REACT_APP_CHAIN_ID === ChainId.MAINNET.toString()
//   ? new Token(ChainId.MAINNET, farms[1].lpAddresses[ChainId.MAINNET], 18, farms[1].lpSymbol)
//   : new Token(ChainId.TESTNET, farms[1].lpAddresses[ChainId.TESTNET], 18, farms[1].lpSymbol)

// LIVE 0xBf1E0b5fec3b7C1C5B7A9e202bD0016deD47bA61
// SOON 0x3A65009722fB7ae681f39c06BE3D0C83e71FC48e
const ifos: Ifo[] = [
  {
    id: 'beta',
    address: '0xBf1E0b5fec3b7C1C5B7A9e202bD0016deD47bA61',
    isActive: true,
    name: 'Beta Protocol (BETA)',
    poolBasic: {
      saleAmount: '7,200,000 BETA',
      raiseAmount: '$180,000',
      cronaToBurn: '$0',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '16,800,000 BETA',
      raiseAmount: '$420,000',
      cronaToBurn: '$0',
      distributionRatio: 0.7,
    },
    // currency: tokens.crona,
    // token: tokens.beta,
    releaseBlockNumber: 13491500,
    campaignId: '511160000',
    twitterUrl: 'https://twitter.com/',
    telegramUrl: 'https://twitter.com/',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmQqpknHvuQwshVP259qFxfQsxiWbQ9SLMebohDeRwRzKg',
    description:
      'CronaSwap is the first decentralized exchange platform on the Cronos Chain to offer the lowest transaction fees (0.25%). You can swap CRC-20 tokens easily on the Cronos Chain network that guarantees superior speed and much lower network transaction costs. ',
    tokenOfferingPrice: 0.025,
    version: 2,
  },
]

export default ifos
