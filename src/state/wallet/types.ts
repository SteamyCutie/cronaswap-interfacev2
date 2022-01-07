import { CurrencyAmount, Token } from '@cronaswap/core-sdk'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>
