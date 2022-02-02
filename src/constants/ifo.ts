import { Token, ChainId } from '@cronaswap/core-sdk'
import { useActiveWeb3React } from 'services/web3'
import tokens from './tokens'
import { FARMS } from './farms'
import { Ifo } from './types'

const { chainId } = useActiveWeb3React()

export const cronaCroLpToken = new Token(chainId, Object.keys(FARMS[chainId])[0], 18, FARMS[chainId][0].name)
export const usdcUsdtLpToken = new Token(chainId, Object.keys(FARMS[chainId])[10], 18, FARMS[chainId][10].name)

// 0xaB51fC34036676F29a49Ca21Cb2Ec327165A8D9c has cro
// 0x6b247FC028Fc8E9E452a4Efa593847E872d48e32
const ifos: Ifo[] = [
  {
    id: 'cross',
    address: '0x880Fa4785C30Ec27109a39268604140BfAA60b20',
    isActive: true,
    name: 'AvtoCROSS Protocol (CROSS)',
    poolBasic: {
      saleAmount: '750000 CROSS',
      raiseAmount: '$150,000',
      cronaToBurn: '$0',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '1750000 CROSS',
      raiseAmount: '$350,000',
      cronaToBurn: '$0',
      distributionRatio: 0.7,
    },
    currency: usdcUsdtLpToken,
    token: tokens.cross,
    releaseBlockNumber: 812670,
    campaignId: '511160000',
    twitterUrl: 'https://twitter.com/avtoCROSS',
    telegramUrl: 'https://t.me/CronosStableSwap',
    articleUrl: 'https://cronaswap.medium.com/first-ifo-project-cross-da256f09470',
    description:
      'CROSS is an automated market-maker (AMM) coming to you soon on Cronos chain designed for low-slippage trading of stablecoins and other pegged assets. ',
    tokenOfferingPrice: 0.2,
    version: 2,
  },
]

export default ifos
