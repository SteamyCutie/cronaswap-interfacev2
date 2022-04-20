import { ChainId, CRONA, Token } from '@cronaswap/core-sdk'
import { Ifo } from './types'
import { BETA, USDC } from './../config/tokens'
import tokens from './tokens'

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
      [ChainId.BSC]: '0xDF24BE326af4c1fb888f567f41D9a981A4752cf1',
      [ChainId.BSC_TESTNET]: '0xDF24BE326af4c1fb888f567f41D9a981A4752cf1',
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
      [ChainId.BSC]: '0x527201a43f8da24ce9b7c21744a0706942f41fa3',
      [ChainId.BSC_TESTNET]: '0x527201a43f8da24ce9b7c21744a0706942f41fa3',
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
  {
    id: 'froyo',
    address: { [ChainId.BSC_TESTNET]: '0xE0d6c91860a332068bdB59275b0AAC8769e26Ac4' },
    isActive: false,
    name: 'Froyo Games (FROYO)',
    poolBasic: {
      saleAmount: '20,000,000 FROYO',
      raiseAmount: '$1,200,000',
      cronaToBurn: '$0',
      distributionRatio: 0.3,
      raiseToken: USDC,
    },
    poolUnlimited: {
      saleAmount: '46,666,668 FROYO',
      raiseAmount: '$2,800,000',
      cronaToBurn: '$0',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },
    offerToken: {
      [ChainId.BSC_TESTNET]: tokens.froyo,
    },
    releaseTimestamp: 14297000,
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time

    campaignId: '511170000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmRhc4oC73jk4zxU4YkP1kudKHeq6qamgYA1sWoh6XJnks',
    tokenOfferingPrice: 0.06,
    version: 3,
    telegramUrl: 'https://t.me/froyogames',
    twitterUrl: 'https://twitter.com/realfroyogames',
    description: `Froyo Games is a game publisher and decentralized GameFi platform, with a NFT Marketplace that integrates NFTs with their games.\n \n FROYO tokens can be used to buy NFTs and participate in Froyo games`,
  },
  {
    id: 'dpt',
    address: { [ChainId.BSC_TESTNET]: '0x63914805A0864e9557eA3A5cC86cc1BA054ec64b' },
    isActive: false,
    name: 'Diviner Protocol (DPT)',
    poolBasic: {
      saleAmount: '7,200,000 DPT',
      raiseAmount: '$180,000',
      cronaToBurn: '$0',
      raiseToken: USDC,
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '16,800,000 DPT',
      raiseAmount: '$420,000',
      cronaToBurn: '$0',
      raiseToken: USDC,
      distributionRatio: 0.7,
    },
    offerToken: { [ChainId.BSC_TESTNET]: tokens.dpt },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 13491500,
    campaignId: '511160000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmQqpknHvuQwshVP259qFxfQsxiWbQ9SLMebohDeRwRzKg',
    tokenOfferingPrice: 0.025,
    version: 3,
  },
  {
    id: 'santos',
    address: { [ChainId.BSC_TESTNET]: '0x69B5D2Ab0cf532a0E22Fc0dEB0c5135639892468' },
    isActive: false,
    name: 'FC Santos Fan Token (SANTOS)',
    poolBasic: {
      saleAmount: '120,000 SANTOS',
      raiseAmount: '$300,000',
      cronaToBurn: '$0',
      raiseToken: USDC,
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '280,000 SANTOS',
      raiseAmount: '$700,000',
      cronaToBurn: '$0',
      raiseToken: USDC,
      distributionRatio: 0.7,
    },
    offerToken: { [ChainId.BSC_TESTNET]: tokens.santos },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 13097777,
    campaignId: '511150000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmUqRxjwZCWeZWEdgV2vHJ6hex7jMW7i247NKFas73xc8j',
    tokenOfferingPrice: 2.5,
    version: 2,
  },
  {
    id: 'porto',
    address: { [ChainId.BSC_TESTNET]: '0xFDFf29dD0b4DD49Bf5E991A30b8593eaA34B4580' },
    isActive: false,
    name: 'FC Porto Fan Token (PORTO)',
    poolBasic: {
      saleAmount: '250,000 PORTO',
      raiseAmount: '$500,000',
      cronaToBurn: '$0',
      raiseToken: USDC,
      distributionRatio: 0.5,
    },
    poolUnlimited: {
      saleAmount: '250,000 PORTO',
      raiseAmount: '$500,000',
      cronaToBurn: '$0',
      raiseToken: USDC,
      distributionRatio: 0.5,
    },
    offerToken: { [ChainId.BSC_TESTNET]: tokens.porto },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 12687500,
    campaignId: '511140000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmaakXYpydAwCgTuSPe3R2ZNraRtkCbK6iBRqBCCdzqKEG',
    tokenOfferingPrice: 2,
    version: 2,
  },
  {
    id: 'dar',
    address: { [ChainId.BSC_TESTNET]: '0xb6eF1f36220397c434A6B15dc5EA616CFFDF58CE' },
    isActive: false,
    name: 'Mines of Dalarnia (DAR)',
    poolBasic: {
      saleAmount: '6,000,000 DAR',
      raiseAmount: '$450,000',
      cronaToBurn: '$0',
      distributionRatio: 0.5,
      raiseToken: USDC,
    },
    poolUnlimited: {
      saleAmount: '6,000,000 DAR',
      raiseAmount: '$450,000',
      cronaToBurn: '$0',
      distributionRatio: 0.5,
      raiseToken: USDC,
    },
    offerToken: { [ChainId.BSC_TESTNET]: tokens.dar },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 12335455,
    campaignId: '511130000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmeJenHcbY45eQxLRebzvpNk5qSCrj2wM1t4EAMHotFoJL',
    tokenOfferingPrice: 0.075,
    version: 2,
  },
  {
    id: 'dkt',
    address: { [ChainId.BSC_TESTNET]: '0x89ab9852155A794e371095d863aEAa2DF198067C' },
    isActive: false,
    name: 'Duelist King (DKT)',
    poolBasic: {
      saleAmount: '75,000 DKT',
      raiseAmount: '$131,250',
      cronaToBurn: '$65,625',
      distributionRatio: 0.3,
      raiseToken: USDC,
    },
    poolUnlimited: {
      saleAmount: '175,000 DKT',
      raiseAmount: '$306,250',
      cronaToBurn: '$153,125',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },

    offerToken: { [ChainId.BSC_TESTNET]: tokens.dkt },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 12130750,
    campaignId: '511120000',
    articleUrl: 'https://pancakeswap.finance/voting/proposal/QmTRWdW9a65fAkyJy1wrAJRU548fNMAZhRUDrSxzMDLmwk',
    tokenOfferingPrice: 1.75,
    version: 2,
  },
  {
    id: 'kalmar',
    address: { [ChainId.BSC_TESTNET]: '0x1aFB32b76696CdF05593Ca3f3957AEFB23a220FB' },
    isActive: false,
    name: 'Kalmar (KALM)',
    poolBasic: {
      saleAmount: '375,000 KALM',
      raiseAmount: '$750,000',
      cronaToBurn: '$375,000',
      distributionRatio: 0.3,
      raiseToken: USDC,
    },
    poolUnlimited: {
      saleAmount: '875,000 KALM',
      raiseAmount: '$2,500,000',
      cronaToBurn: '$1,250,000',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },

    offerToken: { [ChainId.BSC_TESTNET]: tokens.kalm },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 7707736,
    campaignId: '511110000',
    articleUrl: 'https://pancakeswap.medium.com/kalmar-kalm-ifo-to-be-hosted-on-pancakeswap-4540059753e4',
    tokenOfferingPrice: 2.0,
    version: 2,
  },
  {
    id: 'hotcross',
    address: { [ChainId.BSC_TESTNET]: '0xb664cdbe385656F8c54031c0CB12Cea55b584b63' },
    isActive: false,
    name: 'Hot Cross (HOTCROSS)',
    poolBasic: {
      saleAmount: '15,000,000 HOTCROSS',
      raiseAmount: '$750,000',
      cronaToBurn: '$375,000',
      distributionRatio: 0.3,
      raiseToken: USDC,
    },
    poolUnlimited: {
      saleAmount: '35,000,000 HOTCROSS',
      raiseAmount: '$1,750,000',
      cronaToBurn: '$875,000',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },

    offerToken: { [ChainId.BSC_TESTNET]: tokens.hotcross },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 7477900,
    campaignId: '511100000',
    articleUrl: 'https://pancakeswap.medium.com/hot-cross-hotcross-ifo-to-be-hosted-on-pancakeswap-10e70f1f6841',
    tokenOfferingPrice: 0.05,
    version: 2,
  },
  {
    id: 'horizon',
    address: { [ChainId.BSC_TESTNET]: '0x6137B571f7F1E44839ae10310a08be86D1A4D03B' },
    isActive: false,
    name: 'Horizon Protocol (HZN)',
    poolBasic: {
      saleAmount: '3,000,000 HZN',
      raiseAmount: '$750,000',
      cronaToBurn: '$375,000',
      distributionRatio: 0.3,
      raiseToken: USDC,
    },
    poolUnlimited: {
      saleAmount: '7,000,000 HZN',
      raiseAmount: '$1,750,000',
      cronaToBurn: '$875,000',
      distributionRatio: 0.7,
      raiseToken: USDC,
    },

    offerToken: { [ChainId.BSC_TESTNET]: tokens.hzn },
    claimDelayTime: 10800, //delay 3 hours
    veCronaCheckPoint: 1646813700, //start time
    releaseTimestamp: 6581111,
    campaignId: '511090000',
    articleUrl: 'https://pancakeswap.medium.com/horizon-protocol-hzn-ifo-to-be-hosted-on-pancakeswap-51f79601c9d8',
    tokenOfferingPrice: 0.25,
    version: 2,
  },
]

export default ifos
