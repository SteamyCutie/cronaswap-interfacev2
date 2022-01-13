// migrate from cronaswapv1
import { ChainId, MASTERCHEF_ADDRESS } from '@cronaswap/core-sdk'
import { AddressMap } from '../constants/types'

export const getAddress = (address: AddressMap): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[ChainId.CRONOS]
}

export const getMasterChefAddress = () => {
  return getAddress(MASTERCHEF_ADDRESS)
}
