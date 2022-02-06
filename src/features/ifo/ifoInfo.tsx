import { BIG_TEN } from 'app/functions/bigNumber'

export const OnSaleInfo = ({ ifo, poolId }) => {
  return ifo[poolId]
}

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
