import { ChainId, CRONA, Token } from '@cronaswap/core-sdk'
import { Ifo } from './types'
import { BETA, USDC } from './../config/tokens'

// Upcoming 0x906054Ae307053f44767456b7f7e1edaFae5ab61
// LIVE 0x0BF8431c80b3DE93e780ae13E6BB8ffEF78C8b91
// FINISH 0xE7Ac192A39DAE08B0D8936f5C27B908b8C8e6781
const ifos: Ifo[] = [
  // {
  //   id: 'kron',
  //   address: {
  //     [ChainId.CRONOS]: '0x75be9f539eaEA62B356EaCc080991286E7ed08f2', //MAINNET KRON
  //     [ChainId.CRONOS_TESTNET]: '0x6C9f36Bb1FE41906788Dff53a552f203F4a2bb07',
  //   },
  //   isActive: false,
  //   name: 'Krypton Protocol',
  //   poolBasic: {
  //     saleAmount: '30,000',
  //     raiseAmount: '$300,000',
  //     cronaToBurn: '$90,000',
  //     distributionRatio: 0.3,
  //   },
  //   poolUnlimited: {
  //     saleAmount: '70,000',
  //     raiseAmount: '$700,000',
  //     cronaToBurn: '$210,000',
  //     distributionRatio: 0.7,
  //   },
  //   raiseToken: USDC,
  //   offerToken: {
  //     [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0x1771949CCe723e5707639134baE661A868e38198', 9, 'KRON', 'Krypton'),
  //     [ChainId.CRONOS_TESTNET]: new Token(
  //       ChainId.CRONOS_TESTNET,
  //       '0xa139ecb5a81B783048c0aECf3d738a7861Ee09af',
  //       9,
  //       'BETA9',
  //       'IFO BETA MOCK'
  //     ),
  //   },
  //   // MAINNET
  //   releaseTimestamp: 1644760800,
  //   claimDelayTime: 10800, //delay 3 hours 1644760800
  //   veCronaCheckPoint: 1644674400, //start time

  //   // TESTNET
  //   // releaseTimestamp: 1644667500,
  //   // claimDelayTime: 900, //delay 3 hours 1644760800
  //   // veCronaCheckPoint: 1644665700, //start time

  //   campaignId: '511160000',
  //   twitterUrl: 'https://twitter.com/KryptonProt',
  //   telegramUrl: 'https://t.me/KryptonProtocol',
  //   discordUrl: 'https://discord.gg/7cQyTcBbqf',
  //   articleUrl: 'https://kryptonprotocol.gitbook.io/krypton-protocol',
  //   description:
  //     "Krypton Protocol is a decentralized reserve currency platform on Cronos. Unlike DAI or USDT, which are pegged to the value of the U.S. dollar, KRON's reserves are crypto assets held by the Krypton Protocol Treasury.",
  //   tokenOfferingPrice: 10.0,
  //   version: 2,
  // },
  {
    id: 'mifo',
    address: {
      [ChainId.BSC_TESTNET]: '0xe10a7D5941d4a16BBCCC5aDAc62168B9c4FC0988',
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
    tokenOfferingPrice: 10.0,
    version: 2,
  },
]

export default ifos
