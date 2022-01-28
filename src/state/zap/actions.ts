import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('zap/selectCurrency')
export const switchCurrencies = createAction<void>('zap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('zap/typeInput')
export const setRecipient = createAction<{ recipient: string | null }>('zap/setRecipient')
