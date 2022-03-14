import { ChainId, CRONA, Token } from '@cronaswap/core-sdk'
import { Ifo } from './types'
import { BETA, USDC } from './../config/tokens'

// UPCOMING -
// LIVE - 0x37B9227d8154870481171C4C910884e82903992f
// FINISH -
const ifos: Ifo[] = [
  {
    id: 'mifo',
    address: {
      [ChainId.BSC_TESTNET]: '0x37B9227d8154870481171C4C910884e82903992f',
    },
    isActive: true,
    name: 'MIFO',
    poolBasic: {
      saleAmount: '30,000',
      raiseAmount: '$300,000',
      cronaToBurn: '$90,000',
      distributionRatio: 0.3,
      raiseToken: CRONA,
    },
    poolUnlimited: {
      saleAmount: '70,000',
      raiseAmount: '$700,000',
      cronaToBurn: '$210,000',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },
    // raiseToken: USDC,
    offerToken: {
      [ChainId.BSC_TESTNET]: new Token(
        ChainId.BSC_TESTNET,
        '0xf2C856AB8Ed6f67Fd7D45Fd017c811347bF01a28',
        18,
        'MIFO',
        'Mifo'
      ),
    },
    releaseTimestamp: 1646922000,
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time

    // TESTNET
    // releaseTimestamp: 1644667500,
    // claimDelayTime: 900, //delay 3 hours 1644760800
    // veCronaCheckPoint: 1644665700, //start time

    campaignId: '511160000',
    twitterUrl: 'https://twitter.com/KryptonProt',
    telegramUrl: 'https://t.me/KryptonProtocol',
    discordUrl: 'https://discord.gg/7cQyTcBbqf',
    articleUrl: 'https://kryptonprotocol.gitbook.io/krypton-protocol',
    description:
      "MIFO is a decentralized reserve currency platform on Cronos. Unlike DAI or USDT, which are pegged to the value of the U.S. dollar, MIFO's reserves are crypto assets held by the MIFO Treasury.",
    tokenOfferingPrice: 0.2,
    version: 2,
  },
]

export default ifos
