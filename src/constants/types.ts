import { Token } from '@cronaswap/core-sdk'

// migrate from cronaswapv1
export type AddressMap = { [chainId: number]: string }

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
  projectLink?: string
}

interface FarmConfigBaseProps {
  pid: number
  lpSymbol: string
  lpAddresses: AddressMap
  multiplier?: string
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface SerializedFarmConfig extends FarmConfigBaseProps {
  token: SerializedToken
  quoteToken: SerializedToken
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  token: Token
  quoteToken: Token
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}
