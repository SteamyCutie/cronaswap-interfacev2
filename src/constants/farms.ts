import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  // CRO-DAI-LP 0xDA2FC0fE4B03deFf09Fd8CFb92d14e7ebC1F9690
  // CRO-USDC-LP 0x0625A68D25d304aed698c806267a4e369e8Eb12a
  // CRO-USDT-LP 0x19Dd1683e8c5F6Cc338C1438f2D25EBb4e0b0b08
  // USDT-USDC-LP 0x968fE4C06fdD503E278d89d5dFe29935A111476C
  // CRO-WBTC-LP 0xb4684F52867dC0dDe6F931fBf6eA66Ce94666860
  // CRO-DILDO-LP 0x6fce2418C3f1812454f79D85b253c16c44cc12Ae
  // SCAM - LP
  // CRO-VVS 0x8bb676746c062979986Ad0ba71D73bef0615F39a

  // CRO-WETH-LP 0x8232aA9C3EFf79cd845FcDa109B461849Bf1Be83
  // USDC-CRONA 0x482E0eEb877091cfca439D131321bDE23ddf9bB5

  // Added now
  // CRO-CRONA-LP 0xeD75347fFBe08d5cce4858C70Df4dB4Bbe8532a0
  // CRO-USDC-LP 0x0625A68D25d304aed698c806267a4e369e8Eb12a

  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   * BUSD-WCRO 0xFAf5DC0B7D514889f88529B2e14b5E4129bE4a94
   */
  {
    pid: 0,
    lpSymbol: 'CRONA',
    lpAddresses: {
      25: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
      338: '0xf7266fBB31D353099837D6bEfa5E7F197a7cfcA0',
    },
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 1,
    lpSymbol: 'CRONA-CRO LP',
    lpAddresses: {
      25: '0xeD75347fFBe08d5cce4858C70Df4dB4Bbe8532a0',
      338: '0x5c34dec9e2f523ceb387030e6c98b045cb51e913',
    },
    token: serializedTokens.crona,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 13,
    lpSymbol: 'CRONA-USDC LP',
    lpAddresses: {
      25: '0x482E0eEb877091cfca439D131321bDE23ddf9bB5',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.crona,
    quoteToken: serializedTokens.usdc,
  },

  {
    pid: 14,
    lpSymbol: 'CRONA-USDT LP',
    lpAddresses: {
      25: '0x0427F9C304b0028f67A5fD61ffdD613186c1894B',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.crona,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 25,
    lpSymbol: 'WBTC-WETH LP',
    lpAddresses: {
      25: '0x285a569EDD6210a0410883d2E29471A6B0c7790d',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.wbtc,
    quoteToken: serializedTokens.weth,
    isCommunity: false,
  },

  {
    pid: 2,
    lpSymbol: 'USDC-CRO LP',
    lpAddresses: {
      25: '0x0625A68D25d304aed698c806267a4e369e8Eb12a',
      338: '0xf6fe38ed67f19ec20541b79de7ac191668bb39c9',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 3,
    lpSymbol: 'USDT-CRO LP',
    lpAddresses: {
      25: '0x19Dd1683e8c5F6Cc338C1438f2D25EBb4e0b0b08',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 11,
    lpSymbol: 'USDC-USDT LP',
    lpAddresses: {
      25: '0x968fE4C06fdD503E278d89d5dFe29935A111476C',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.usdc,
  },
  {
    pid: 7,
    lpSymbol: 'BUSD-USDT LP',
    lpAddresses: {
      25: '0x503d56b2f535784b7f2bcd6581f7e1b46dc0e60c',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 16,
    lpSymbol: 'DAI-USDC LP',
    lpAddresses: {
      25: '0xaEbaFDbe975DB0bfbF4e95a6493CB93d02cc86aE',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.dai,
    quoteToken: serializedTokens.usdc,
  },
  {
    pid: 12,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      25: '0xe8b18116040acf83d6e1f873375adf61103ab45c',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.bnb,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 23,
    lpSymbol: 'WBTC-USDC LP',
    lpAddresses: {
      25: '0xea7fc6A39B0d0344e1662E6ABF2FEcD19Bf3D029',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.wbtc,
    quoteToken: serializedTokens.usdc,
  },
  {
    pid: 24,
    lpSymbol: 'WETH-USDC LP',
    lpAddresses: {
      25: '0x5cc953f278bf6908B2632c65D6a202D6fd1370f9',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.weth,
    quoteToken: serializedTokens.usdc,
  },
  {
    pid: 10,
    lpSymbol: 'FTM-USDT LP',
    lpAddresses: {
      25: '0xdee7a79bb414ffb248ef4d4c5560adc91f547f41',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.ftm,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 4,
    lpSymbol: 'WETH-CRO LP',
    lpAddresses: {
      25: '0x8232aA9C3EFf79cd845FcDa109B461849Bf1Be83',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.weth,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 5,
    lpSymbol: 'WBTC-CRO LP',
    lpAddresses: {
      25: '0xb4684F52867dC0dDe6F931fBf6eA66Ce94666860',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.wbtc,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 6,
    lpSymbol: 'DAI-CRO LP',
    lpAddresses: {
      25: '0xDA2FC0fE4B03deFf09Fd8CFb92d14e7ebC1F9690',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.dai,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 9,
    lpSymbol: 'AVAX-USDT LP',
    lpAddresses: {
      25: '0x193add22b0a333956c2cb13f4d574af129629c5f',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.avax,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 19,
    lpSymbol: 'SHIB-CRO LP',
    lpAddresses: {
      25: '0x912e17882893F8361E87e81742C764B032dE8d76',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.shiba,
    quoteToken: serializedTokens.wcro,
  },
  {
    pid: 8,
    lpSymbol: 'MATIC-USDT LP',
    lpAddresses: {
      25: '0x394080f7c770771b6ee4f4649bc477f0676cea5c',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.matic,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 28,
    lpSymbol: 'CROSS-CRO LP',
    lpAddresses: {
      25: '0x3A0490585Aa889DeD22BCB8C2E6C03a0Cb319E51',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.cross,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 15,
    lpSymbol: 'WIND-CRO LP',
    lpAddresses: {
      25: '0x7d978D63b0109fEd6A0FaE1400970E145c86c508',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.wind,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 17,
    lpSymbol: 'CRYSTL-CRO LP',
    lpAddresses: {
      25: '0xdEb28305D5c8d5Ce3B3bc5398Ba81012580a5A11',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.crystal,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 18,
    lpSymbol: 'AUTO-CRO LP',
    lpAddresses: {
      25: '0x179d72E76d8078A9Bd07486B9a60F902CCBc7273',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.auto,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 20,
    lpSymbol: 'BIRD-CRO LP',
    lpAddresses: {
      25: '0x82A7D95759ed08009c0aAfCea6a675DA0601c265',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.bird,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 21,
    lpSymbol: 'CADDY-CRO LP',
    lpAddresses: {
      25: '0x2A008eF8ec3ef6b03eff10811054e989aAD1CF71',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.caddy,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 22,
    lpSymbol: 'LIQ-CRO LP',
    lpAddresses: {
      25: '0x3295007761c290741b6b363b86df9ba3467f0754',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.liq,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 26,
    lpSymbol: 'DUO-CRO LP',
    lpAddresses: {
      25: '0x9666681E87D902621e800bF786504c729f4D9A56',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.duo,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
  {
    pid: 27,
    lpSymbol: 'BISON-CRO LP',
    lpAddresses: {
      25: '0xf68F0982a08C5F6754F716D019F218dDF986BEc2',
      338: '0x3AD39bFD1714D6F9ED2963b46af770183b93D0e2',
    },
    token: serializedTokens.bison,
    quoteToken: serializedTokens.wcro,
    isCommunity: true,
  },
]

export default farms
