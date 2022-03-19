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
      [ChainId.CRONOS]: '0xC28a8dc376A64eBc37E189F66CDB12a4CBDC7595',
      [ChainId.BSC_TESTNET]: '0xD1e0Da69F2Ee9B7d3602DB9F41F37beE2d99F176',
    },
    isActive: true,
    name: 'ARCANE',
    poolBasic: {
      saleAmount: '1,200,000',
      raiseAmount: '$180,000',
      cronaToBurn: '$90,000',
      distributionRatio: 0.3,
      raiseToken: CRONA,
    },
    poolUnlimited: {
      saleAmount: '3,800,000',
      raiseAmount: '$420,000',
      cronaToBurn: '$110,000',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },
    // raiseToken: USDC,
    offerToken: {
      [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0x78f0953f2d07eB8B50397415e85b97F3360211c7', 18, 'ARCANE', 'ARCANE'),
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
