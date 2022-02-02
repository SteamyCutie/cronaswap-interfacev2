import { ChainId, Token } from '@cronaswap/core-sdk'
import { SerializedToken } from 'app/state/user/actions'

const { CRONOS, CRONOS_TESTNET } = ChainId
interface TokenList {
  [symbol: string]: Token
}

interface SerializedTokenList {
  [symbol: string]: SerializedToken
}

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    projectLink: token.projectLink,
  }
}

export const mainnetTokens = {
  cro: new Token(CRONOS, '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23', 18, 'CRO', 'CRO', 'https://www.crypto.org/'),
  wcro: new Token(
    CRONOS,
    '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
    18,
    'WCRO',
    'Wrapped CRO',
    'https://www.crypto.org/'
  ),
  crona: new Token(
    CRONOS,
    '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
    18,
    'CRONA',
    'CronaSwap Token',
    'https://cronaswap.org/'
  ),
  syrup: new Token(
    CRONOS,
    '0x25f0965F285F03d6F6B3B21c8EC3367412Fd0ef6',
    18,
    'xCRONA',
    'xCRONA Token',
    'https://cronaswap.org/'
  ),

  dai: new Token(
    CRONOS,
    '0xf2001b145b43032aaf5ee2884e456ccd805f677d',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://makerdao.com/'
  ),
  usdc: new Token(
    CRONOS,
    '0xc21223249ca28397b4b6541dffaecc539bff0c59',
    6,
    'USDC',
    'USD Coin',
    'https://www.centre.io/usdc'
  ),
  usdt: new Token(CRONOS, '0x66e428c3f67a68878562e79a0234c1f83c208770', 6, 'USDT', 'Tether USD', 'https://tether.to'),
  wbtc: new Token(
    CRONOS,
    '0x062e66477faf219f25d27dced647bf57c3107d52',
    8,
    'WBTC',
    'Wrapped BTC',
    'https://www.wbtc.network/'
  ),
  weth: new Token(CRONOS, '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', 18, 'WETH', 'Wrapped ETH', 'https://weth.io/'),

  matic: new Token(CRONOS, '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055', 18, 'Matic', 'Matic', 'https://weth.io/'),
  avax: new Token(CRONOS, '0x765277eebeca2e31912c9946eae1021199b39c61', 18, 'AVAX', 'AVAX', 'https://weth.io/'),
  ftm: new Token(CRONOS, '0xB44a9B6905aF7c801311e8F4E76932ee959c663C', 18, 'FTM', 'Fantom', 'https://weth.io/'),
  busd: new Token(CRONOS, '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8', 18, 'BUSD', 'Binance USD', 'https://weth.io/'),
  bnb: new Token(
    CRONOS,
    '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
    18,
    'BNB',
    'Binance BNB',
    'https://binance.com/'
  ),

  wind: new Token(
    CRONOS,
    '0x48713151E5AFB7b4CC45f3653c1c59CF81E88D4B',
    18,
    'WIND',
    'StormSwap Finance',
    'https://stormswap.finance'
  ),
  crystal: new Token(
    CRONOS,
    '0xcbde0e17d14f49e10a10302a32d17ae88a7ecb8b',
    18,
    'CRYSTL',
    'CRYSTL Finance',
    'https://cronos.crystl.finance'
  ),
  auto: new Token(
    CRONOS,
    '0x0dCb0CB0120d355CdE1ce56040be57Add0185BAa',
    18,
    'AUTO',
    'AUTOv2',
    'https://autofarmc.network/'
  ),
  shiba: new Token(
    CRONOS,
    '0xbed48612bc69fa1cab67052b42a95fb30c1bcfee',
    18,
    'SHIB',
    'SHIBA INU',
    'https://shibatoken.com/'
  ),
  bird: new Token(
    CRONOS,
    '0x9A3d8759174f2540985aC83D957c8772293F8646',
    18,
    'BIRD',
    'BlackBird Finance Token',
    'https://blackBird.finance/'
  ),
  caddy: new Token(
    CRONOS,
    '0x09ad12552ec45f82bE90B38dFE7b06332A680864',
    18,
    'CADDY',
    'Adamant Token',
    'http://adamant.finance'
  ),
  liq: new Token(
    CRONOS,
    '0xABd380327Fe66724FFDa91A87c772FB8D00bE488',
    18,
    'LIQ',
    'Liquidus',
    'http://Liquidus.finance'
  ),
  duo: new Token(
    CRONOS,
    '0x4ff6334aa95aFfC85F09738eEfc866cBEA7DC7c6',
    18,
    'DUO',
    'Singular.farm',
    'http://singular.farm'
  ),
  bison: new Token(
    CRONOS,
    '0x3405A1bd46B85c5C029483FbECf2F3E611026e45',
    18,
    'BISON',
    'BiSharesFinance',
    'https://bishares.finance/'
  ),
  cross: new Token(
    CRONOS,
    '0x6ef20cA7E493c52095e892DAB78a7FD0e7e2a279',
    18,
    'CROSS',
    'AvtoCross',
    'https://avtocross.finance/'
  ),

  mifo: new Token(
    CRONOS,
    '0x78f0953f2d07eB8B50397415e85b97F3360211c7',
    18,
    'CROSS',
    'MIFO Mock',
    'https://cronaswap.org/'
  ),

  safemoon: new Token(
    CRONOS,
    '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3',
    9,
    'SAFEMOON',
    'Safemoon Token',
    'https://safemoon.net/'
  ),
  bondly: new Token(
    CRONOS,
    '0x96058f8C3e16576D9BD68766f3836d9A33158f89',
    18,
    'BONDLY',
    'Bondly Token',
    'https://www.bondly.finance/'
  ),
}

export const testnetTokens = {
  wcro: new Token(
    CRONOS_TESTNET,
    '0x873c905681Fb587cc12a29DA5CD3c447bE61F146',
    18,
    'WCRO',
    'Wrapped CRO',
    'https://www.crypto.org/'
  ),
  crona: new Token(
    CRONOS_TESTNET,
    '0x7Ac4564724c99e129F79dC000CA594B4631acA81',
    18,
    'CRONA',
    'CronaSwap Token',
    'https://cronaswap.org/'
  ),
  syrup: new Token(
    CRONOS_TESTNET,
    '0x8b00A242Fd8CAb55F5FD2D9b89C78c94dC4654D7',
    18,
    'xCRONA',
    'xCRONA Token',
    'https://cronaswap.finance/'
  ),
  usdc: new Token(
    CRONOS_TESTNET,
    '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8',
    6,
    'USDC',
    'USD Coin',
    'https://www.circle.com'
  ),
  dai: new Token(
    CRONOS,
    '0x4DB5AF30EB1760Ec9C375bC60D36A0C80DCc8551',
    18,
    'DAI',
    'Dai Stablecoin',
    'https://makerdao.com/'
  ),
  beta: new Token(
    CRONOS_TESTNET,
    '0xd63EAab556d1177F5C1a149E4aB0aD78fF627E1B',
    18,
    'BETA',
    'BETA Token (BTT)',
    'https://www.crypto.org/'
  ),
}

const tokens = (): TokenList => {
  const chainId = process.env.REACT_APP_CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.CRONOS_TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    }, {})
  }

  return mainnetTokens
}

export const serializeTokens = (): SerializedTokenList => {
  const unserializedTokens = tokens()
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {})

  return serializedTokens
}

export default tokens()
