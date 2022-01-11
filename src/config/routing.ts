import { CRONA, ETHEREUM, CRONOS } from './tokens'

// a list of tokens by chain
import { ChainId, Token, WNATIVE } from '@cronaswap/core-sdk'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM]],
  [ChainId.CRONOS]: [WNATIVE[ChainId.CRONOS]],
  [ChainId.CRONOS_TESTNET]: [WNATIVE[ChainId.CRONOS_TESTNET]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,

  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    CRONA[ChainId.ETHEREUM],
  ],
  [ChainId.CRONOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.CRONOS],
    CRONOS.DAI,
    CRONOS.USDC,
    CRONOS.USDT,
    CRONOS.WBTC,
    CRONOS.WETH,
    CRONA[ChainId.CRONOS],
  ],
}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {
    // ...MIRROR_ADDITIONAL_BASES,
    // '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETH2X_FLI],
    // [FEI.address]: [DPI],
    // [FRAX.address]: [FXS],
    // [FXS.address]: [FRAX],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {
  // [ChainId.ETHEREUM]: { [AMPL.address]: [DAI, WNATIVE[ChainId.ETHEREUM]] },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
    CRONA[ChainId.ETHEREUM],
  ],
  [ChainId.CRONOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.CRONOS],
    CRONOS.USDC,
    CRONOS.WBTC,
    CRONOS.DAI,
    CRONOS.WETH,
    CRONOS.USDT,
    CRONA[ChainId.CRONOS],
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.ETHEREUM]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.ETHEREUM],
    ETHEREUM.DAI,
    ETHEREUM.USDC,
    ETHEREUM.USDT,
    ETHEREUM.WBTC,
  ],
  [ChainId.CRONOS]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.CRONOS],
    CRONOS.USDC,
    CRONOS.WBTC,
    CRONOS.DAI,
    CRONOS.WETH,
    CRONOS.USDT,
  ],
}

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][]
} = {
  [ChainId.ETHEREUM]: [
    [CRONA[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM]],
    [ETHEREUM.USDC, ETHEREUM.USDT],
    [ETHEREUM.DAI, ETHEREUM.USDT],
  ],
  [ChainId.CRONOS]: [
    [CRONA[ChainId.CRONOS], WNATIVE[ChainId.CRONOS]],
    [CRONOS.USDC, CRONOS.USDT],
    [CRONOS.DAI, CRONOS.USDT],
  ],
}
