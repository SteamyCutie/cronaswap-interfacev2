import { ChainId } from '@cronaswap/core-sdk'

export enum PoolCategory {
  'CORE' = 'Core',
  'AUTO' = 'Auto',
  'COMMUNITY' = 'Community',
}

// migrate from sushiswap
export type TokenInfo = {
  id: string
  name: string
  symbol: string
  decimals?: number
}

export type PoolInfo = {
  pid: number
  name?: string
  category?: string
  tokenPerBlock?: string
  stakingToken: TokenInfo
  earningToken?: TokenInfo
  projectLink?: string
  isFinished: boolean
}

type AddressMap = {
  [chainId: number]: {
    [address: string]: PoolInfo
  }
}

export const POOLS: AddressMap = {
  [ChainId.CRONOS]: {
    '0x2BbA6Aae8c0274D3205a75e47FA03204CE5F0b01': {
      pid: 0,
      name: 'CRONA-WCRO',
      tokenPerBlock: '0.05',
      isFinished: false,
      category: PoolCategory.COMMUNITY,
      projectLink: 'https://app.cronaswap.org',
      stakingToken: {
        id: '0xadbd1231fb360047525bedf962581f3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      earningToken: {
        id: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
        name: 'Wrapped CRO',
        symbol: 'WCRO',
        decimals: 18,
      },
    },

    '0x8F48d6b7F18421664D6DFA4891A5204d099B1F1C': {
      pid: 1,
      name: 'CRONA-CROISSANT',
      tokenPerBlock: '1.25',
      isFinished: false,
      category: PoolCategory.COMMUNITY,
      projectLink: 'https://croissant.games/',
      stakingToken: {
        id: '0xadbd1231fb360047525bedf962581f3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      earningToken: {
        id: '0xa0c3c184493f2fae7d2f2bd83f195a1c300fa353',
        name: 'Croissant games',
        symbol: 'CROISSANT',
        decimals: 18,
      },
    },

    '0xc3f38745fD9374836B7D0919758ccE7c89a3Ab19': {
      pid: 2,
      name: 'CRONA-AGL',
      tokenPerBlock: '1.5',
      isFinished: false,
      category: PoolCategory.COMMUNITY,
      projectLink: 'https://www.agilefi.org',
      stakingToken: {
        id: '0xadbd1231fb360047525bedf962581f3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      earningToken: { id: '0xa4434afeae0decb9820d906bf01b13291d00651a', name: 'Agile', symbol: 'AGL', decimals: 18 },
    },

    '0xCae8Ac27c13660F434765f28A471db39EC5c6A67': {
      pid: 3,
      name: 'CRONA-CROSS',
      tokenPerBlock: '0.0575',
      isFinished: true,
      category: PoolCategory.COMMUNITY,
      projectLink: 'https://avtocross.finance',
      stakingToken: {
        id: '0xadbd1231fb360047525bedf962581f3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      earningToken: {
        id: '0x6ef20cA7E493c52095e892DAB78a7FD0e7e2a279',
        name: 'AvtoCross',
        symbol: 'CROSS',
        decimals: 18,
      },
    },
  },

  [ChainId.CRONOS_TESTNET]: {
    '0xc3f38745fD9374836B7D0919758ccE7c89a3Ab19': {
      pid: 0,
      name: 'CRONA-CRO',
      tokenPerBlock: '1.5',
      isFinished: false,
      category: PoolCategory.COMMUNITY,
      projectLink: 'https://www.agilefi.org',
      stakingToken: {
        id: '0xadbd1231fb360047525bedf962581f3eee7b49fe',
        name: 'CronSwap',
        symbol: 'CRONA',
        decimals: 18,
      },
      earningToken: {
        id: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23',
        name: 'WCRO Token',
        symbol: 'CRO',
        decimals: 18,
      },
    },
  },
}
