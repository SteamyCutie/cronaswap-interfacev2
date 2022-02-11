import { ChainId, Token } from '@cronaswap/core-sdk'
import { Ifo } from './types'
import { BETA, USDC } from './../config/tokens'

// Upcoming 0x906054Ae307053f44767456b7f7e1edaFae5ab61
// LIVE 0x0BF8431c80b3DE93e780ae13E6BB8ffEF78C8b91
// FINISH 0xE7Ac192A39DAE08B0D8936f5C27B908b8C8e6781
const ifos: Ifo[] = [
  {
    id: 'beta',
    address: '0x0BF8431c80b3DE93e780ae13E6BB8ffEF78C8b91',
    isActive: true,
    name: 'Beta Protocol (BETA)',
    poolBasic: {
      saleAmount: '30,000 BETA',
      raiseAmount: '$300,000',
      cronaToBurn: '$90,000',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '70,000 BETA',
      raiseAmount: '$700,000',
      cronaToBurn: '$210,000',
      distributionRatio: 0.7,
    },
    raiseToken: USDC,
    offerToken: {
      [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', 6, 'USDC', 'USD Coin'),
      [ChainId.CRONOS_TESTNET]: new Token(
        ChainId.CRONOS_TESTNET,
        '0xd63EAab556d1177F5C1a149E4aB0aD78fF627E1B',
        18,
        'BETA',
        'IFO BETA MOCK'
      ),
    },
    releaseTimestamp: 1644675300,
    veCronaCheckPoint: 1644675300,
    campaignId: '511160000',
    twitterUrl: 'https://twitter.com/',
    telegramUrl: 'https://twitter.com/',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmQqpknHvuQwshVP259qFxfQsxiWbQ9SLMebohDeRwRzKg',
    description:
      'CronaSwap is the first decentralized exchange platform on the Cronos Chain to offer the lowest transaction fees (0.25%). You can swap CRC-20 tokens easily on the Cronos Chain network that guarantees superior speed and much lower network transaction costs. ',
    tokenOfferingPrice: 10.0,
    version: 2,
  },
]

export default ifos
