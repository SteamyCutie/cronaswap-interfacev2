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
      [ChainId.CRONOS]: '0xA5F673915F10276999Ab24266bF5E0846344962b',
      [ChainId.BSC_TESTNET]: '0xBad35c158a3955f7aFF8c36960e24E6Bf44E3cFc', //finished 0x5059c8B82BC016BcD81C5d3071570c140fcdC1c0 live-0x947f6899b2DdedD9a03ae62eC92771aD888b1a6F 0x8BC2661d0d483cc0Da04BdbAC001c62E98549CF2
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
        'ARC',
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
  {
    id: 'duet',
    address: {
      [ChainId.CRONOS]: '0xDF24BE326af4c1fb888f567f41D9a981A4752cf1',
    },
    isActive: false,
    name: 'DUET',
    poolBasic: {
      saleAmount: '1,200,000 DUET',
      raiseAmount: '$360,000',
      cronaToBurn: '$0',
      distributionRatio: 0.2,
      raiseToken: CRONA,
    },
    poolUnlimited: {
      saleAmount: '4,800,000 DUET',
      raiseAmount: '$1,440,000',
      cronaToBurn: '$0',
      distributionRatio: 0.8,
      raiseToken: USDC,
    },
    offerToken: {
      [ChainId.CRONOS]: new Token(
        ChainId.CRONOS,
        '0x95EE03e1e2C5c4877f9A298F1C0D6c98698FAB7B',
        18,
        'DUET',
        'Duet Governance Token'
      ),
    },
    releaseTimestamp: 1646922000,
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time

    campaignId: '511190000',
    twitterUrl: 'https://twitter.com/duetprotocol',
    telegramUrl: 'https://t.me/duetprotocol',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmXwoYYd8rkahVbxiGKsTa4rYRRFWPxhRGAHy3hVwK3Q2z',
    description:
      'DUET Protocol is a multi-chain synthetic assets ecosystem, enabling pegged assets from various markets – from individual stocks, to indexes, ETFs, and commodities.',
    tokenOfferingPrice: 0.3,
    version: 2,
  },
  {
    id: 'era',
    address: {
      [ChainId.CRONOS]: '0x527201a43f8da24ce9b7c21744a0706942f41fa3',
    },
    isActive: false,
    name: 'ERA (Game of Truth)',
    poolBasic: {
      saleAmount: '4,000,000 ERA',
      raiseAmount: '$360,000',
      cronaToBurn: '$0',
      distributionRatio: 0.2,
      raiseToken: CRONA,
    },
    poolUnlimited: {
      saleAmount: '16,000,000 ERA',
      raiseAmount: '$1,440,000',
      cronaToBurn: '$0',
      distributionRatio: 0.8,
      raiseToken: USDC,
    },
    offerToken: {
      [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0x6f9F0c4ad9Af7EbD61Ac5A1D4e0F2227F7B0E5f9', 18, 'ERA', 'Era Token'),
    },
    releaseTimestamp: 1646922000,
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time

    campaignId: '511180000',
    twitterUrl: 'https://twitter.com/Era7_official',
    telegramUrl: 'https://t.me/Era7_Official',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmTfN1SKnFidF6XCDcpga7zAf69mFfhb26Zy9b85dYskxW',
    description:
      'Drawing from their experience in traditional games such as Awakening of Dragon, Era7: Game of Truth combines elements of DeFi, NFTs, and Trading Cards into a play-to-earn game steeped in mythology and magic.',
    tokenOfferingPrice: 0.09,
    version: 2,
  },
]

export default ifos
