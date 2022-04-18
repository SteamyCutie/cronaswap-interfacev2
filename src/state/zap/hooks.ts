import { AppDispatch, AppState } from '../index'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  Percent,
  CRONA_ADDRESS,
  TradeType,
  Trade as V2Trade,
} from '@cronaswap/core-sdk'

import { Field, replaceZapState, selectCurrency, selectLPToken, switchCurrencies, typeInput } from './actions'
import { isAddress, isZero } from '../../functions/validate'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from '../user/hooks'
import { useV2TradeExactIn as useTradeExactIn, useV2TradeExactOut as useTradeExactOut } from '../../hooks/useV2Trades'
import { ParsedQs } from 'qs'
import { ZapState } from './reducer'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../services/web3'
import { useCurrency } from '../../hooks/Tokens'
import { useCurrencyBalances } from '../wallet/hooks'
import useENS from '../../hooks/useENS'
import { useLingui } from '@lingui/react'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import useSwapSlippageTolerance from '../../hooks/useSwapSlippageTollerence'
import usePool from '../../hooks/usePool'
import Zap from 'pages/exchange/zap'
import { FarmPairInfo } from 'app/constants/farmsv1'

export declare class ZapTrade {
  inputAmount: CurrencyAmount<Currency>
  inputCurrency: Currency
  outputLPToken: FarmPairInfo
}
export function useZapState(): AppState['zap'] {
  return useAppSelector((state) => state.zap)
}

export function useZapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onLPTokenSelection: (field: Field, lpToken: FarmPairInfo) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'CRO' : '',
        })
      )
    },
    [dispatch]
  )

  const onLPTokenSelection = useCallback(
    (field: Field, lpToken: FarmPairInfo) => {
      dispatch(
        selectLPToken({
          field,
          lpTokenId: lpToken.lpToken,
          lpToken: lpToken,
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onLPTokenSelection,
    onCurrencySelection,
    onUserInput,
  }
}

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: V2Trade<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  const path = trade.route.path
  return (
    path.some((token) => token.address === checksummedAddress) ||
    (trade instanceof V2Trade
      ? trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
      : false)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedZapInfo(doArcher = false): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: string
  zapTrade: ZapTrade | undefined
  allowedSlippage: Percent
  lpToken: { [field in Field]?: FarmPairInfo }
} {
  const { i18n } = useLingui()

  const { account, chainId, library } = useActiveWeb3React()

  const [singleHopOnly] = useUserSingleHopOnly()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { lpTokenId: outputLPTokenId, lpToken: outputLPToken },
  } = useZapState()

  const inputCurrency = useCurrency(inputCurrencyId)

  // const outputLPToken = usePool(outputLPTokenId)

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [inputCurrency ?? undefined])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, inputCurrency ?? undefined)

  // const outputCurrency1: Currency = useCurrency(outputLPToken?.token0?.id)
  // const outputCurrency2: Currency = useCurrency(outputLPToken?.token1?.id)
  // debugger
  // const bestTrade1ExactIn = useTradeExactIn(
  //   isExactIn ? parsedAmount?.divide(2) : undefined,
  //   outputCurrency1 ?? undefined,
  //   {
  //     maxHops: singleHopOnly ? 1 : undefined,
  //   }
  // )

  // const bestTrade2ExactIn = useTradeExactIn(
  //   isExactIn ? parsedAmount?.divide(2) : undefined,
  //   outputCurrency2 ?? undefined,
  //   {
  //     maxHops: singleHopOnly ? 1 : undefined,
  //   }
  // )

  const zapTrade: ZapTrade = {
    inputCurrency: inputCurrency,
    inputAmount: parsedAmount,
    outputLPToken: outputLPToken,
  }

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
  }

  const lpToken: { [field in Field]?: FarmPairInfo } = {
    [Field.OUTPUT]: outputLPToken ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? i18n._(t`Enter an amount`)
  }

  if (!currencies[Field.INPUT]) {
    inputError = inputError ?? i18n._(t`Select a token`)
  }

  if (!outputLPTokenId) {
    inputError = inputError ?? i18n._(t`Select a LP token`)
  }

  // const allowedSlippage1 = useSwapSlippageTolerance(zapTrade?.trade1)
  // const allowedSlippage2 = useSwapSlippageTolerance(zapTrade?.trade2)
  // const allowedSlippage = allowedSlippage1.greaterThan(allowedSlippage2) ? allowedSlippage2 : allowedSlippage1
  const allowedSlippage = undefined

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], parsedAmount]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = i18n._(t`Insufficient ${amountIn.currency.symbol} balance`)
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    zapTrade: zapTrade ?? undefined,
    allowedSlippage,
    lpToken,
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'CRO') return 'CRO'
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}
export function queryParametersToZapState(parsedQs: ParsedQs, chainId: ChainId = ChainId.ETHEREUM): ZapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  // const eth = chainId === ChainId.CELO ? WNATIVE_ADDRESS[chainId] : 'CRO'
  const eth = 'CRO'
  const sushi = CRONA_ADDRESS[chainId]
  if (inputCurrency === '') {
    inputCurrency = eth
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      lpToken: null,
      lpTokenId: '',
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
  }
}

// updates the zap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | {
      inputCurrencyId: string | undefined
      outputLPTokenId: string | undefined
      outputLPToken: FarmPairInfo | undefined
    }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const parsedQs = useParsedQueryString()
  const [expertMode] = useExpertModeManager()
  const [result, setResult] = useState<
    | {
        inputCurrencyId: string | undefined
        outputLPTokenId: string | undefined
        outputLPToken: FarmPairInfo | undefined
      }
    | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToZapState(parsedQs, chainId)

    dispatch(
      replaceZapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
      })
    )

    setResult({
      inputCurrencyId: parsed[Field.INPUT].currencyId,
      outputLPTokenId: parsed[Field.OUTPUT].lpTokenId,
      outputLPToken: parsed[Field.OUTPUT].lpToken,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}
