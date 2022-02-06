import { ChainId } from '@cronaswap/core-sdk'
import { NETWORK_ICON, NETWORK_LABEL } from '../config/networks'

export type Chain = {
  id: ChainId
  name?: string
  icon?: string
}

export const DEFAULT_CHAIN_FROM: Chain = {
  id: ChainId.BSC,
  icon: NETWORK_ICON[ChainId.BSC],
  name: NETWORK_LABEL[ChainId.BSC],
}

export const DEFAULT_CHAIN_TO: Chain = {
  id: ChainId.CRONOS,
  icon: NETWORK_ICON[ChainId.CRONOS],
  name: NETWORK_LABEL[ChainId.CRONOS],
}
