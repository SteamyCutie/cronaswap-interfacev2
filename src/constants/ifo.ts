import { ChainId, CRONA, Token } from '@cronaswap/core-sdk'
import { Ifo } from './types'
import { BETA, USDC } from './../config/tokens'

// UPCOMING - 0xD1e0Da69F2Ee9B7d3602DB9F41F37beE2d99F176
// LIVE - 0x37B9227d8154870481171C4C910884e82903992f
// FINISH -
const ifos: Ifo[] = [
  {
    id: 'mifo',
    address: {
      [ChainId.CRONOS]: '0x2c741797403b1F486EE28116091Bf86293C90b53',
      [ChainId.BSC_TESTNET]: '0xD1e0Da69F2Ee9B7d3602DB9F41F37beE2d99F176',
    },
    isActive: true,
    name: 'ARCANE',
    poolBasic: {
      saleAmount: '1,350,000',
      raiseAmount: '$202,500',
      cronaToBurn: '$90,000',
      distributionRatio: 0.3,
      raiseToken: CRONA,
    },
    poolUnlimited: {
      saleAmount: '2,650,000',
      raiseAmount: '$397,500',
      cronaToBurn: '$110,000',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },
    // raiseToken: USDC,
    offerToken: {
      [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0x289B8f552c9fD66f9cEA35B193F7ca73ae24A5d5', 18, 'ARC', 'ARCANE'),
      [ChainId.BSC_TESTNET]: new Token(
        ChainId.BSC_TESTNET,
        '0xf2C856AB8Ed6f67Fd7D45Fd017c811347bF01a28',
        18,
        'ARCANE',
        'ARCANE'
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
    twitterUrl: 'https://twitter.com/thearcanefi',
    telegramUrl: 'https://t.me/arcanenftfinancial',
    discordUrl: 'https://discord.gg/ajesZGddzV',
    articleUrl: 'https://arcanenft.financial/',
    description:
      'ARCANE is the premier gaming NFT Token on CRONOS that will allow you to control an infinite supply of Protonium. Gather Protonium and become the most powerful Arcane of all time. ARCANE has one purpose: Unite the cybertornian army to protect the cronos ecosystem.',
    tokenOfferingPrice: 0.15,
    version: 2,
  },
]

export default ifos
