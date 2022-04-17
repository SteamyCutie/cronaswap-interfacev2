import { Field, replaceZapState, selectCurrency, selectLPToken, switchCurrencies, typeInput } from './actions'

import { createReducer } from '@reduxjs/toolkit'
import { FarmPairInfo } from 'app/constants/farmsv1'

export interface ZapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly lpTokenId: string | undefined
    readonly lpToken: FarmPairInfo | undefined
  }
}

const initialState: ZapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    lpTokenId: '',
    lpToken: null,
  },
}

export default createReducer<ZapState>(initialState, (builder) =>
  builder
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      return {
        ...state,
        [field]: { currencyId: currencyId },
      }
    })
    .addCase(selectLPToken, (state, { payload: { lpTokenId, lpToken, field } }) => {
      return {
        ...state,
        [field]: { lpTokenId: lpTokenId, lpToken: lpToken },
      }
    })
    .addCase(replaceZapState, (state, { payload: { field, typedValue, inputCurrencyId } }) => {
      return {
        ...state,
        [field]: { currencyId: inputCurrencyId },
        typedValue,
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
)
