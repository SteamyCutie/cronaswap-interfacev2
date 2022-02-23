import { ChainId } from '@cronaswap/core-sdk'

// migrate from sushiswap
export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

type PairInfo = {
  id: number
  pid: number
  token0: TokenInfo
  token1?: TokenInfo
  name?: string
  symbol?: string
  pair?: string
  isCommunity?: boolean
  migrate?: boolean
  isVote?: boolean
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: PairInfo
  }
}

// For MasterChefV1
export const FARMS: AddressMap = {
  [ChainId.CRONOS]: {
    // '0xadbd1231fb360047525bedf962581f3eee7b49fe': {
    //   id: 0, symbol: 'CLP', name: 'CronaSwap LP',
    //   token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
    //   token1: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
    // },

    '0xeD75347fFBe08d5cce4858C70Df4dB4Bbe8532a0': {
      id: 0,
      pid: 1,
      symbol: 'CLP',
      name: 'CRONA-CRO',
      migrate: true,
      token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x0625A68D25d304aed698c806267a4e369e8Eb12a': {
      id: 1,
      pid: 2,
      symbol: 'CLP',
      name: 'USDC-CRO',
      migrate: true,
      token0: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x19Dd1683e8c5F6Cc338C1438f2D25EBb4e0b0b08': {
      id: 2,
      pid: 3,
      symbol: 'CLP',
      name: 'USDT-CRO',
      migrate: false,
      token0: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x8232aA9C3EFf79cd845FcDa109B461849Bf1Be83': {
      id: 3,
      pid: 4,
      symbol: 'CLP',
      name: 'WETH-CRO',
      migrate: false,
      token0: { id: '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xb4684F52867dC0dDe6F931fBf6eA66Ce94666860': {
      id: 4,
      pid: 5,
      symbol: 'CLP',
      name: 'WBTC-CRO',
      migrate: false,
      token0: { id: '0x062e66477faf219f25d27dced647bf57c3107d52', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xDA2FC0fE4B03deFf09Fd8CFb92d14e7ebC1F9690': {
      id: 5,
      pid: 6,
      symbol: 'CLP',
      name: 'DAI-CRO',
      migrate: true,
      token0: { id: '0xf2001b145b43032aaf5ee2884e456ccd805f677d', name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x503d56B2f535784B7f2bcD6581F7e1b46DC0e60c': {
      id: 6,
      pid: 7,
      symbol: 'CLP',
      name: 'BUSD-USDT',
      migrate: true,
      token0: { id: '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8', name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x394080F7c770771B6EE4f4649bC477F0676ceA5C': {
      id: 7,
      pid: 8,
      symbol: 'CLP',
      name: 'MATIC-USDT',
      migrate: true,
      token0: {
        id: '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055',
        name: 'Matic Network',
        symbol: 'MATIC',
        decimals: 18,
      },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x193add22b0a333956C2Cb13F4D574aF129629c5f': {
      id: 8,
      pid: 9,
      symbol: 'CLP',
      name: 'AVAX-USDT',
      migrate: true,
      token0: { id: '0x765277eebeca2e31912c9946eae1021199b39c61', name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0xDee7A79bb414FFB248EF4d4c5560AdC91F547F41': {
      id: 9,
      pid: 10,
      symbol: 'CLP',
      name: 'FTM-USDT',
      migrate: true,
      token0: { id: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C', name: 'Fantom', symbol: 'FTM', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x968fE4C06fdD503E278d89d5dFe29935A111476C': {
      id: 10,
      pid: 11,
      symbol: 'CLP',
      name: 'USDC-USDT',
      migrate: true,
      token0: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0xe8B18116040acf83D6e1f873375adF61103AB45c': {
      id: 11,
      pid: 12,
      symbol: 'CLP',
      name: 'BNB-BUSD',
      migrate: true,
      token0: { id: '0xfa9343c3897324496a05fc75abed6bac29f8a40f', name: 'Binance BNB', symbol: 'BNB', decimals: 18 },
      token1: { id: '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8', name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
    },

    '0x482E0eEb877091cfca439D131321bDE23ddf9bB5': {
      id: 12,
      pid: 13,
      symbol: 'CLP',
      name: 'CRONA-USDC',
      migrate: true,
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronaSwap Token',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x0427F9C304b0028f67A5fD61ffdD613186c1894B': {
      id: 13,
      pid: 14,
      symbol: 'CLP',
      name: 'CRONA-USDT',
      migrate: true,
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronaSwap Token',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x7d978D63b0109fEd6A0FaE1400970E145c86c508': {
      id: 14,
      pid: 15,
      symbol: 'CLP',
      name: 'WIND-CRO',
      migrate: false,
      token0: {
        id: '0x48713151E5AFB7b4CC45f3653c1c59CF81E88D4B',
        name: 'StormSwap Finance',
        symbol: 'WIND',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xaEbaFDbe975DB0bfbF4e95a6493CB93d02cc86aE': {
      id: 15,
      pid: 16,
      symbol: 'CLP',
      name: 'DAI-USDC',
      migrate: true,
      token0: {
        id: '0xf2001b145b43032aaf5ee2884e456ccd805f677d',
        name: 'Dai Stablecoin',
        symbol: 'WIND',
        decimals: 18,
      },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0xdEb28305D5c8d5Ce3B3bc5398Ba81012580a5A11': {
      id: 16,
      pid: 17,
      symbol: 'CLP',
      name: 'CRYSTL-CRO',
      migrate: false,
      token0: {
        id: '0xcbde0e17d14f49e10a10302a32d17ae88a7ecb8b',
        name: 'CRYSTL Finance',
        symbol: 'CRYSTL',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x179d72E76d8078A9Bd07486B9a60F902CCBc7273': {
      id: 17,
      pid: 18,
      symbol: 'CLP',
      name: 'AUTO-CRO',
      migrate: false,
      token0: { id: '0x0dCb0CB0120d355CdE1ce56040be57Add0185BAa', name: 'AUTOv2', symbol: 'AUTO', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x912e17882893F8361E87e81742C764B032dE8d76': {
      id: 18,
      pid: 19,
      symbol: 'CLP',
      name: 'SHIB-CRO',
      migrate: false,
      token0: { id: '0xbed48612bc69fa1cab67052b42a95fb30c1bcfee', name: 'SHIBA INU', symbol: 'SHIB', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x82A7D95759ed08009c0aAfCea6a675DA0601c265': {
      id: 19,
      pid: 20,
      symbol: 'CLP',
      name: 'BIRD-CRO',
      migrate: false,
      token0: {
        id: '0x9A3d8759174f2540985aC83D957c8772293F8646',
        name: 'BlackBird Finance',
        symbol: 'BIRD',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x2A008eF8ec3ef6b03eff10811054e989aAD1CF71': {
      id: 20,
      pid: 21,
      symbol: 'CLP',
      name: 'CADDY-CRO',
      migrate: false,
      token0: {
        id: '0x09ad12552ec45f82bE90B38dFE7b06332A680864',
        name: 'Adamant Token',
        symbol: 'CADDY',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x3295007761C290741B6b363b86dF9ba3467F0754': {
      id: 21,
      pid: 22,
      symbol: 'CLP',
      name: 'LIQ-CRO',
      migrate: false,
      token0: { id: '0xABd380327Fe66724FFDa91A87c772FB8D00bE488', name: 'Liquidus', symbol: 'LIQ', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xea7fc6A39B0d0344e1662E6ABF2FEcD19Bf3D029': {
      id: 22,
      pid: 23,
      symbol: 'CLP',
      name: 'WBTC-USDC',
      migrate: true,
      token0: { id: '0x062e66477faf219f25d27dced647bf57c3107d52', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8 },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x5cc953f278bf6908B2632c65D6a202D6fd1370f9': {
      id: 23,
      pid: 24,
      symbol: 'CLP',
      name: 'WETH-USDC',
      migrate: true,
      token0: { id: '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x285a569EDD6210a0410883d2E29471A6B0c7790d': {
      id: 24,
      pid: 25,
      symbol: 'CLP',
      name: 'WBTC-WETH',
      migrate: true,
      token0: { id: '0x062e66477faf219f25d27dced647bf57c3107d52', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8 },
      token1: { id: '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
    },

    '0x9666681E87D902621e800bF786504c729f4D9A56': {
      id: 25,
      pid: 26,
      symbol: 'CLP',
      name: 'DUO-CRO',
      migrate: false,
      token0: { id: '0x4ff6334aa95aFfC85F09738eEfc866cBEA7DC7c6', name: 'Singular.farm', symbol: 'DUO', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xf68F0982a08C5F6754F716D019F218dDF986BEc2': {
      id: 26,
      pid: 27,
      symbol: 'CLP',
      name: 'BISON-CRO',
      migrate: false,
      token0: {
        id: '0x3405A1bd46B85c5C029483FbECf2F3E611026e45',
        name: 'BiSharesFinance',
        symbol: 'BISON',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x3A0490585Aa889DeD22BCB8C2E6C03a0Cb319E51': {
      id: 27,
      pid: 28,
      symbol: 'CLP',
      name: 'CROSS-CRO',
      migrate: false,
      token0: { id: '0x6ef20cA7E493c52095e892DAB78a7FD0e7e2a279', name: 'AvtoCross', symbol: 'CROSS', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x453D3ffD62fa06E664b1c7b400C5921092b2850e': {
      id: 28,
      pid: 29,
      symbol: 'CLP',
      name: 'AGL-CRO',
      migrate: false,
      token0: { id: '0xa4434afeae0decb9820d906bf01b13291d00651a', name: 'Agile', symbol: 'AGL', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },
  },

  [ChainId.CRONOS_TESTNET]: {
    '0x306A80D1A90320869fC62F676cc3369DF059E6F8': {
      id: 0,
      pid: 1,
      symbol: 'CLP',
      name: 'CRONA-CRO',
      token1: { id: '0x7B6D3ec86493F7930EdA24a33C1A316bfD405188', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token0: { id: '0x873c905681Fb587cc12a29DA5CD3c447bE61F146', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x91b94fd50f764a8a607f1cb59bb3d0c9b240425a': {
      id: 1,
      pid: 2,
      symbol: 'CLP',
      name: 'USDC-CRO',
      token1: { id: '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token0: { id: '0x873c905681Fb587cc12a29DA5CD3c447bE61F146', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xecf2Ef00DBF270154f84Fc580262aE1a2eD31B6D': {
      id: 2,
      pid: 3,
      symbol: 'CLP',
      name: 'USDC-USDT',
      token1: { id: '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token0: { id: '0xE912124f1204208e3EBA49BAbe3Fc1028351808d', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },
  },
}

// For MasterChefV2
export const FARMSV2: AddressMap = {
  [ChainId.CRONOS]: {
    // '0xadbd1231fb360047525bedf962581f3eee7b49fe': {
    //   id: 0, symbol: 'CLP', name: 'CronaSwap LP',
    //   token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
    //   token1: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
    // },

    '0xeD75347fFBe08d5cce4858C70Df4dB4Bbe8532a0': {
      id: 0,
      pid: 0,
      symbol: 'CLP',
      name: 'CRONA-CRO',
      token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x482E0eEb877091cfca439D131321bDE23ddf9bB5': {
      id: 1,
      pid: 1,
      symbol: 'CLP',
      name: 'CRONA-USDC',
      token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x0427F9C304b0028f67A5fD61ffdD613186c1894B': {
      id: 2,
      pid: 2,
      symbol: 'CLP',
      name: 'CRONA-USDT',
      token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x0625A68D25d304aed698c806267a4e369e8Eb12a': {
      id: 3,
      pid: 3,
      symbol: 'CLP',
      name: 'CRO-USDC',
      token0: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x19Dd1683e8c5F6Cc338C1438f2D25EBb4e0b0b08': {
      id: 4,
      pid: 4,
      symbol: 'CLP',
      name: 'USDT-CRO',
      token0: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x8232aA9C3EFf79cd845FcDa109B461849Bf1Be83': {
      id: 5,
      pid: 5,
      symbol: 'CLP',
      name: 'WETH-CRO',
      token0: { id: '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xb4684F52867dC0dDe6F931fBf6eA66Ce94666860': {
      id: 6,
      pid: 6,
      symbol: 'CLP',
      name: 'WBTC-CRO',
      token0: { id: '0x062e66477faf219f25d27dced647bf57c3107d52', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x5cc953f278bf6908B2632c65D6a202D6fd1370f9': {
      id: 7,
      pid: 7,
      symbol: 'CLP',
      name: 'WETH-USDC',
      token0: { id: '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0xea7fc6A39B0d0344e1662E6ABF2FEcD19Bf3D029': {
      id: 8,
      pid: 8,
      symbol: 'CLP',
      name: 'WBTC-USDC',
      token0: { id: '0x062e66477faf219f25d27dced647bf57c3107d52', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8 },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x285a569EDD6210a0410883d2E29471A6B0c7790d': {
      id: 9,
      pid: 9,
      symbol: 'CLP',
      name: 'WBTC-WETH',
      token0: { id: '0x062e66477faf219f25d27dced647bf57c3107d52', name: 'Wrapped BTC', symbol: 'WBTC', decimals: 8 },
      token1: { id: '0xe44fd7fcb2b1581822d0c862b68222998a0c299a', name: 'Wrapped ETH', symbol: 'WETH', decimals: 18 },
    },

    '0xaEbaFDbe975DB0bfbF4e95a6493CB93d02cc86aE': {
      id: 10,
      pid: 10,
      symbol: 'CLP',
      name: 'DAI-USDC',
      token0: {
        id: '0xf2001b145b43032aaf5ee2884e456ccd805f677d',
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    },

    '0x968fE4C06fdD503E278d89d5dFe29935A111476C': {
      id: 11,
      pid: 11,
      symbol: 'CLP',
      name: 'USDC-USDT',
      token0: { id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x503d56B2f535784B7f2bcD6581F7e1b46DC0e60c': {
      id: 12,
      pid: 12,
      symbol: 'CLP',
      name: 'BUSD-USDT',
      token0: { id: '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8', name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0xe8B18116040acf83D6e1f873375adF61103AB45c': {
      id: 13,
      pid: 13,
      symbol: 'CLP',
      name: 'BNB-BUSD',
      token0: { id: '0xfa9343c3897324496a05fc75abed6bac29f8a40f', name: 'Binance BNB', symbol: 'BNB', decimals: 18 },
      token1: { id: '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8', name: 'Binance USD', symbol: 'BUSD', decimals: 18 },
    },

    '0xDee7A79bb414FFB248EF4d4c5560AdC91F547F41': {
      id: 14,
      pid: 14,
      symbol: 'CLP',
      name: 'FTM-USDT',
      token0: { id: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C', name: 'Fantom', symbol: 'FTM', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x193add22b0a333956C2Cb13F4D574aF129629c5f': {
      id: 15,
      pid: 15,
      symbol: 'CLP',
      name: 'AVAX-USDT',
      token0: { id: '0x765277eebeca2e31912c9946eae1021199b39c61', name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x394080F7c770771B6EE4f4649bC477F0676ceA5C': {
      id: 16,
      pid: 16,
      symbol: 'CLP',
      name: 'MATIC-USDT',
      token0: {
        id: '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055',
        name: 'Matic Network',
        symbol: 'MATIC',
        decimals: 18,
      },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x482411d276E2082c9747B48b4D4f6b6E0bdb8d14': {
      id: 17,
      pid: 17,
      symbol: 'CLP',
      name: 'ATOM-USDT',
      token0: { id: '0xB888d8Dd1733d72681b30c00ee76BDE93ae7aa93', name: 'ATOM', symbol: 'ATOM', decimals: 6 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x6ce5A2aE57e784a722f4B9bbBC924511Df0BB4f3': {
      id: 18,
      pid: 18,
      symbol: 'CLP',
      name: 'LUNA-USDT',
      token0: { id: '0x9278C8693e7328bef49804BacbFb63253565dffD', name: 'LUNA', symbol: 'LUNA', decimals: 6 },
      token1: { id: '0x66e428c3f67a68878562e79a0234c1f83c208770', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    '0x2a0A14c93a21A2E359671123D122028e9B7d45bF': {
      id: 19,
      pid: 19,
      symbol: 'CLP',
      name: 'CRONA-DOT',
      token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token1: { id: '0x994047FE66406CbD646cd85B990E11D7F5dB8fC7', name: 'DOT', symbol: 'DOT', decimals: 10 },
    },

    '0xf0359a37abdd3677DCd9de7B844501B695c8F97E': {
      id: 20,
      pid: 20,
      symbol: 'CLP',
      name: 'CROISSANT-CRO',
      isCommunity: true,
      token0: {
        id: '0xa0C3c184493f2Fae7d2f2Bd83F195a1c300FA353',
        name: 'Croissant Games',
        symbol: 'CROISSANT',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xCB63a755E4A99D27362603A12B0813Db469157ac': {
      id: 21,
      pid: 21,
      symbol: 'CLP',
      name: 'CGS-CRO',
      isCommunity: true,
      token0: {
        id: '0x4e57e27e4166275Eb7f4966b42A201d76e481B03',
        name: 'Cougar Token',
        symbol: 'CGS',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x026646B0c48c351b1EF82BB14a96F646350e2279': {
      id: 22,
      pid: 22,
      symbol: 'CLP',
      name: 'CRONA-ADA',
      token0: { id: '0xadbd1231fb360047525bedf962581f3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token1: { id: '0x0e517979C2c1c1522ddB0c73905e0D39b3F990c0', name: 'ADA Token', symbol: 'ADA', decimals: 6 },
    },

    '0xe6278a9425fc3ECc3514cD782598493043B6CDF4': {
      id: 23,
      pid: 23,
      symbol: 'CLP',
      name: 'CRO-BANK',
      isCommunity: true,
      token0: { id: '0x55210C2a69b4c52a9d9289A257D54d35C4a2d2eC', name: 'CroBank', symbol: 'BANK', decimals: 9 },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },
  },

  [ChainId.CRONOS_TESTNET]: {
    '0x306A80D1A90320869fC62F676cc3369DF059E6F8': {
      id: 0,
      pid: 0,
      symbol: 'CLP',
      name: 'CRONA-CRO',
      token1: { id: '0x7B6D3ec86493F7930EdA24a33C1A316bfD405188', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
      token0: { id: '0x873c905681Fb587cc12a29DA5CD3c447bE61F146', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0x91b94fd50f764a8a607f1cb59bb3d0c9b240425a': {
      id: 1,
      pid: 1,
      symbol: 'CLP',
      name: 'USDC-CRO',
      token1: { id: '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token0: { id: '0x873c905681Fb587cc12a29DA5CD3c447bE61F146', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
    },

    '0xecf2Ef00DBF270154f84Fc580262aE1a2eD31B6D': {
      id: 2,
      pid: 2,
      symbol: 'CLP',
      name: 'USDC-USDT',
      token1: { id: '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token0: { id: '0xE912124f1204208e3EBA49BAbe3Fc1028351808d', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },
  },
}
