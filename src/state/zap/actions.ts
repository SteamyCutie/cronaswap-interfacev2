import { createAction } from '@reduxjs/toolkit'
import { FarmPairInfo } from 'app/constants/farmsv1'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('zap/selectCurrency')
export const selectLPToken = createAction<{
  field: Field
  lpTokenId: string
  lpToken: FarmPairInfo
}>('zap/selectLPToken')
export const replaceZapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
}>('swap/replaceZapState')
export const switchCurrencies = createAction<void>('zap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('zap/typeInput')
