import { ChainId, Token } from '@cronaswap/core-sdk'
import { Ifo } from './types'
import { BETA, USDC } from './../config/tokens'

// Upcoming 0x906054Ae307053f44767456b7f7e1edaFae5ab61
// LIVE 0x0BF8431c80b3DE93e780ae13E6BB8ffEF78C8b91
// FINISH 0xE7Ac192A39DAE08B0D8936f5C27B908b8C8e6781
const ifos: Ifo[] = [
  {
    id: 'kron',
    address: {
      [ChainId.CRONOS]: '0x09AdEDA0496eDe941B3bE4B81E124202D5E8aB08', //MAINNET KRON
      [ChainId.CRONOS_TESTNET]: '0x0BF8431c80b3DE93e780ae13E6BB8ffEF78C8b91',
    },
    isActive: true,
    name: 'Krypton Protocol',
    poolBasic: {
      saleAmount: '30,000',
      raiseAmount: '$300,000',
      cronaToBurn: '$90,000',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '70,000',
      raiseAmount: '$700,000',
      cronaToBurn: '$210,000',
      distributionRatio: 0.7,
    },
    raiseToken: USDC,
    offerToken: {
      [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0x1771949CCe723e5707639134baE661A868e38198', 9, 'KRON', 'Krypton'),
      [ChainId.CRONOS_TESTNET]: new Token(
        ChainId.CRONOS_TESTNET,
        '0xd63EAab556d1177F5C1a149E4aB0aD78fF627E1B',
        18,
        'BETA',
        'IFO BETA MOCK'
      ),
    },
    releaseTimestamp: 1644588900,
    claimDelayTime: 7200, //delay 2 hour 1644760800
    veCronaCheckPoint: 1644588900,
    campaignId: '511160000',
    twitterUrl: 'https://twitter.com/KryptonProt',
    telegramUrl: 'https://t.me/KryptonProtocol',
    discordUrl: 'https://discord.gg/7cQyTcBbqf',
    articleUrl: 'https://kryptonprotocol.gitbook.io/krypton-protocol',
    description:
      "Krypton Protocol is a decentralized reserve currency platform on Cronos. Unlike DAI or USDT, which are pegged to the value of the U.S. dollar, KRON's reserves are crypto assets held by the Krypton Protocol Treasury.",
    tokenOfferingPrice: 10.0,
    version: 2,
  },
]

export default ifos
