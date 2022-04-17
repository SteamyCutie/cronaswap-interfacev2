import { ChainId } from '@cronaswap/core-sdk'
import { AddressMap } from './farmsv1'

// For MasterChefV2
export const FARMSV2: AddressMap = {
  [ChainId.CRONOS]: {
    // '0xadbd1231fb360047525BEdF962581F3eee7b49fe': {
    //   id: 0, symbol: 'CLP', name: 'CronaSwap LP',
    //   token0: { id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
    //   token1: { id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe', name: 'CronSwap', symbol: 'CRONA', decimals: 18 },
    // },

    '0xeD75347fFBe08d5cce4858C70Df4dB4Bbe8532a0': {
      id: 0,
      pid: 0,
      symbol: 'CLP',
      name: 'CRONA-CRO',
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isVote: true,
      isZap: true,
    },

    '0x482E0eEb877091cfca439D131321bDE23ddf9bB5': {
      id: 1,
      pid: 1,
      symbol: 'CLP',
      name: 'CRONA-USDC',
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      isVote: true,
      isZap: true,
    },

    '0x0427F9C304b0028f67A5fD61ffdD613186c1894B': {
      id: 2,
      pid: 2,
      symbol: 'CLP',
      name: 'CRONA-USDT',
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: true,
    },

    '0x0625A68D25d304aed698c806267a4e369e8Eb12a': {
      id: 3,
      pid: 3,
      symbol: 'CLP',
      name: 'CRO-USDC',
      token0: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      token1: {
        id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      isVote: true,
      isZap: true,
    },

    '0x19Dd1683e8c5F6Cc338C1438f2D25EBb4e0b0b08': {
      id: 4,
      pid: 4,
      symbol: 'CLP',
      name: 'USDT-CRO',
      token0: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isVote: false,
      isZap: false,
    },

    '0x8232aA9C3EFf79cd845FcDa109B461849Bf1Be83': {
      id: 5,
      pid: 5,
      symbol: 'CLP',
      name: 'WETH-CRO',
      token0: {
        id: '0xe44Fd7fCb2b1581822D0c862B68222998a0c299a',
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isVote: false,
      isZap: false,
    },

    '0xb4684F52867dC0dDe6F931fBf6eA66Ce94666860': {
      id: 6,
      pid: 6,
      symbol: 'CLP',
      name: 'WBTC-CRO',
      token0: {
        id: '0x062e66477faf219f25d27dced647bf57c3107d52',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isVote: false,
      isZap: false,
    },

    '0x5cc953f278bf6908B2632c65D6a202D6fd1370f9': {
      id: 7,
      pid: 7,
      symbol: 'CLP',
      name: 'WETH-USDC',
      token0: {
        id: '0xe44Fd7fCb2b1581822D0c862B68222998a0c299a',
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
      token1: {
        id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      isVote: true,
      isZap: true,
    },

    '0xea7fc6A39B0d0344e1662E6ABF2FEcD19Bf3D029': {
      id: 8,
      pid: 8,
      symbol: 'CLP',
      name: 'WBTC-USDC',
      token0: {
        id: '0x062e66477faf219f25d27dced647bf57c3107d52',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      token1: {
        id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      isZap: true,
    },

    '0x285a569EDD6210a0410883d2E29471A6B0c7790d': {
      id: 9,
      pid: 9,
      symbol: 'CLP',
      name: 'WBTC-WETH',
      token0: {
        id: '0x062e66477faf219f25d27dced647bf57c3107d52',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
      },
      token1: {
        id: '0xe44Fd7fCb2b1581822D0c862B68222998a0c299a',
        name: 'Wrapped ETH',
        symbol: 'WETH',
        decimals: 18,
      },
      isZap: true,
    },

    '0xaEbaFDbe975DB0bfbF4e95a6493CB93d02cc86aE': {
      id: 10,
      pid: 10,
      symbol: 'CLP',
      name: 'DAI-USDC',
      token0: {
        id: '0xF2001B145b43032AAF5Ee2884e456CCd805F677D',
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      token1: {
        id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0x968fE4C06fdD503E278d89d5dFe29935A111476C': {
      id: 11,
      pid: 11,
      symbol: 'CLP',
      name: 'USDC-USDT',
      token0: {
        id: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: false,
      isZap: true,
    },

    '0x503d56B2f535784B7f2bcD6581F7e1b46DC0e60c': {
      id: 12,
      pid: 12,
      symbol: 'CLP',
      name: 'BUSD-USDT',
      token0: {
        id: '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8',
        name: 'Binance USD',
        symbol: 'BUSD',
        decimals: 18,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0xe8B18116040acf83D6e1f873375adF61103AB45c': {
      id: 13,
      pid: 13,
      symbol: 'CLP',
      name: 'BNB-BUSD',
      token0: {
        id: '0xfA9343C3897324496A05fC75abeD6bAC29f8A40f',
        name: 'Binance BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      token1: {
        id: '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8',
        name: 'Binance USD',
        symbol: 'BUSD',
        decimals: 18,
      },
      isVote: true,
      isZap: false,
    },

    '0xDee7A79bb414FFB248EF4d4c5560AdC91F547F41': {
      id: 14,
      pid: 14,
      symbol: 'CLP',
      name: 'multiFTM-USDT',
      token0: {
        id: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
        name: 'Fantom',
        symbol: 'multiFTM',
        decimals: 18,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0x193add22b0a333956C2Cb13F4D574aF129629c5f': {
      id: 15,
      pid: 15,
      symbol: 'CLP',
      name: 'AVAX-USDT',
      token0: {
        id: '0x765277EebeCA2e31912C9946eAe1021199B39C61',
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0x394080F7c770771B6EE4f4649bC477F0676ceA5C': {
      id: 16,
      pid: 16,
      symbol: 'CLP',
      name: 'multiMATIC-USDT',
      token0: {
        id: '0xc9BAA8cfdDe8E328787E29b4B078abf2DaDc2055',
        name: 'Matic Network',
        symbol: 'multiMATIC',
        decimals: 18,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0x482411d276E2082c9747B48b4D4f6b6E0bdb8d14': {
      id: 17,
      pid: 17,
      symbol: 'CLP',
      name: 'ATOM-USDT',
      token0: {
        id: '0xB888d8Dd1733d72681b30c00ee76BDE93ae7aa93',
        name: 'ATOM',
        symbol: 'ATOM',
        decimals: 6,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0x6ce5A2aE57e784a722f4B9bbBC924511Df0BB4f3': {
      id: 18,
      pid: 18,
      symbol: 'CLP',
      name: 'LUNA-USDT',
      token0: {
        id: '0x9278C8693e7328bef49804BacbFb63253565dffD',
        name: 'LUNA',
        symbol: 'LUNA',
        decimals: 6,
      },
      token1: {
        id: '0x66e428c3f67a68878562e79A0234c1F83c208770',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isVote: true,
      isZap: false,
    },

    '0x2a0A14c93a21A2E359671123D122028e9B7d45bF': {
      id: 19,
      pid: 19,
      symbol: 'CLP',
      name: 'CRONA-DOT',
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0x994047FE66406CbD646cd85B990E11D7F5dB8fC7',
        name: 'DOT',
        symbol: 'DOT',
        decimals: 10,
      },
      isVote: true,
      isZap: false,
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
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
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
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0x026646B0c48c351b1EF82BB14a96F646350e2279': {
      id: 22,
      pid: 22,
      symbol: 'CLP',
      name: 'CRONA-ADA',
      token0: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0x0e517979C2c1c1522ddB0c73905e0D39b3F990c0',
        name: 'ADA Token',
        symbol: 'ADA',
        decimals: 6,
      },
      isZap: false,
    },

    '0xe6278a9425fc3ECc3514cD782598493043B6CDF4': {
      id: 23,
      pid: 23,
      symbol: 'CLP',
      name: 'CRO-BANK',
      isCommunity: true,
      token0: {
        id: '0x55210C2a69b4c52a9d9289A257D54d35C4a2d2eC',
        name: 'CroBank',
        symbol: 'BANK',
        decimals: 9,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0x179d72E76d8078A9Bd07486B9a60F902CCBc7273': {
      id: 24,
      pid: 24,
      symbol: 'CLP',
      name: 'AUTO-CRO',
      isCommunity: true,
      token0: {
        id: '0x0dCb0CB0120d355CdE1ce56040be57Add0185BAa',
        name: 'AUTOv2',
        symbol: 'AUTO',
        decimals: 18,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0x3A0490585Aa889DeD22BCB8C2E6C03a0Cb319E51': {
      id: 25,
      pid: 25,
      symbol: 'CLP',
      name: 'CROSS-CRO',
      isCommunity: true,
      token0: {
        id: '0x6ef20cA7E493c52095e892DAB78a7FD0e7e2a279',
        name: 'AvtoCross',
        symbol: 'CROSS',
        decimals: 18,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0xAC23a7dE083719c0E11D5c2EFBCC99Db5C73BB48': {
      id: 26,
      pid: 26,
      symbol: 'CLP',
      name: 'CROBLANC-CRO',
      isCommunity: true,
      token0: {
        id: '0xD3ceCBE5639D05Aed446Da11F08D495CA6bF359F',
        name: 'Croblanc Token',
        symbol: 'CROBLANC',
        decimals: 18,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0x7E5581DB727C4Aa1873ef338E0d7Be3195da28A1': {
      id: 27,
      pid: 27,
      symbol: 'CLP',
      name: 'SPHERE-CRO',
      isCommunity: true,
      token0: {
        id: '0xc9FDE867a14376829Ab759F4C4871F67e2d3E441',
        name: 'SPHERE Token',
        symbol: 'SPHERE',
        decimals: 18,
      },
      token1: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0xd712862C859A904Ce16A7BAbdfFdbCAf10946ebe': {
      id: 28,
      pid: 28,
      symbol: 'CLP',
      name: 'ARC-CRONA',
      isCommunity: true,
      token0: {
        id: '0x289B8f552c9fD66f9cEA35B193F7ca73ae24A5d5',
        name: 'Arcane',
        symbol: 'ARC',
        decimals: 18,
      },
      token1: {
        id: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      isVote: false,
      isZap: false,
    },

    '0xdEb28305D5c8d5Ce3B3bc5398Ba81012580a5A11': {
      id: 29,
      pid: 29,
      symbol: 'CLP',
      name: 'CRYSTL-CRO',
      isCommunity: true,
      token0: {
        id: '0xcbde0e17d14f49e10a10302a32d17ae88a7ecb8b',
        name: 'CRYSTL Finance',
        symbol: 'CRYSTL',
        decimals: 18,
      },
      token1: { id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23', name: 'WCRO Token', symbol: 'CRO', decimals: 18 },
      isVote: false,
      isZap: false,
    },
  },

  [ChainId.CRONOS_TESTNET]: {
    '0x306A80D1A90320869fC62F676cc3369DF059E6F8': {
      id: 0,
      pid: 0,
      symbol: 'CLP',
      name: 'CRONA-CRO',
      token0: {
        id: '0x7B6D3ec86493F7930EdA24a33C1A316bfD405188',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0x873c905681Fb587cc12a29DA5CD3c447bE61F146',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: true,
    },

    '0x91b94fd50f764a8a607f1cb59bb3d0c9b240425a': {
      id: 1,
      pid: 1,
      symbol: 'CLP',
      name: 'USDC-CRO',
      token0: {
        id: '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0x873c905681Fb587cc12a29DA5CD3c447bE61F146',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
      isZap: false,
    },

    '0xecf2Ef00DBF270154f84Fc580262aE1a2eD31B6D': {
      id: 2,
      pid: 2,
      symbol: 'CLP',
      name: 'USDC-USDT',
      token0: {
        id: '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0xE912124f1204208e3EBA49BAbe3Fc1028351808d',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      },
      isZap: true,
    },
  },

  [ChainId.BSC_TESTNET]: {
    '0x4f6a629d9ae18E92edCe8226233c9E5e85d365d1': {
      id: 0,
      pid: 0,
      symbol: 'CLP',
      name: 'CRONA-BNB',
      token0: {
        id: '0x50FbdED2063577995389fd5fa0eB349cCbc7cA67',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      token1: {
        id: '0xD3c2fb1A20bE1e8BcBA44594d677f37f3A193ED5',
        name: 'WBNB Token',
        symbol: 'BNB',
        decimals: 18,
      },
      isVote: true,
      isZap: false,
    },

    '0x00C5cfBDFC8c84a42C2162A3089b5BC65E2FF72E': {
      id: 1,
      pid: 1,
      symbol: 'CLP',
      name: 'USDC-BNB',
      token0: {
        id: '0x63cE1066c7cA0a028Db94031794bFfe40ceE8b0A',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      token1: {
        id: '0xD3c2fb1A20bE1e8BcBA44594d677f37f3A193ED5',
        name: 'WBNB Token',
        symbol: 'BNB',
        decimals: 18,
      },
      isVote: true,
      isZap: false,
    },

    '0x921629c3F034845F4d09779E547b278C431eF104': {
      id: 2,
      pid: 2,
      symbol: 'CLP',
      name: 'USDC-USDT',
      isVote: true,
      isZap: true,
      token0: { id: '0x63cE1066c7cA0a028Db94031794bFfe40ceE8b0A', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
      token1: { id: '0xf9586C796087b3c6F39ffd85cB0129f0745143d3', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    },

    // '0x5163a0c952dc0e4090d8566912399a6af1edaf7f': {
    //   id: 2,
    //   pid: 3,
    //   symbol: 'CLP',
    //   name: 'USDC-USDT',
    //   isVote: true,
    //   isZap: true,
    //   token0: { id: '0x63cE1066c7cA0a028Db94031794bFfe40ceE8b0A', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    //   token1: { id: '0xf9586C796087b3c6F39ffd85cB0129f0745143d3', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    // },
  },
}
