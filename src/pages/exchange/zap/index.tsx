import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { ButtonConfirmed, ButtonError } from '../../../components/Button'
import { ChainId, Currency, CurrencyAmount, NATIVE, Percent, WNATIVE, WNATIVE_ADDRESS } from '@cronaswap/core-sdk'
import React, { useCallback, useMemo, useState } from 'react'
import CurrencyInputPanel from 'app/components/CurrencyInputPanel'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'app/state/swap/hooks'
import { Field as SwapField } from 'app/state/swap/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../../state/burn/hooks'
import { usePairContract, useRouterContract } from '../../../hooks/useContract'

import { AutoColumn } from '../../../components/Column'
import Container from '../../../components/Container'
import { Contract } from '@ethersproject/contracts'
import Dots from '../../../components/Dots'
import DoubleGlowShadow from '../../../components/DoubleGlowShadow'
import { Field } from '../../../state/burn/actions'
import Head from 'next/head'
import Header from '../../../features/trade/Header'
import Web3Connect from '../../../components/Web3Connect'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../services/web3'
import { useCurrency } from '../../../hooks/Tokens'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import { useUserSlippageToleranceWithDefault } from '../../../state/user/hooks'
import { useV2LiquidityTokenPermit } from '../../../hooks/useERC20Permit'
import useWrapCallback, { WrapType } from 'app/hooks/useWrapCallback'
import { maxAmountSpend } from 'app/functions'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export default function Zap() {
  const { i18n } = useLingui()
  const router = useRouter()
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[SwapField.INPUT], currencies[SwapField.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = tokens || [undefined, undefined]
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()

  // burn state
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  // txn values
  const [txHash, setTxHash] = useState<string>('')
  const deadline = useTransactionDeadline()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE)

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // router contract
  const routerContract = useRouterContract()

  // allowance handling
  const { gatherPermitSignature, signatureData } = useV2LiquidityTokenPermit(
    parsedAmounts[Field.LIQUIDITY],
    routerContract?.address
  )

  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], routerContract?.address)

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    if (gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }

  const dependentField: SwapField = independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[SwapField.INPUT])
  const showMaxButton = Boolean(
    maxInputAmount?.greaterThan(0) && !parsedAmounts[SwapField.INPUT]?.equalTo(maxInputAmount)
  )

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(SwapField.INPUT, value)
    },
    [onUserInput]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(SwapField.OUTPUT, value)
    },
    [onUserInput]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(SwapField.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(SwapField.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[SwapField.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[SwapField.OUTPUT])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(SwapField.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  return (
    <Container id="remove-liquidity-page" className="py-4 space-y-4 md:py-12 lg:py-24" maxWidth="2xl">
      <Head>
        <title>Zap | CronaSwap</title>
        <meta key="description" name="description" content="Remove liquidity from the CronaSwap AMM" />
      </Head>

      <DoubleGlowShadow>
        <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
          <Header input={currencyA} output={currencyB} allowedSlippage={allowedSlippage} />
          <div>
            <CurrencyInputPanel
              // priceImpact={priceImpact}
              label={
                independentField === SwapField.OUTPUT && !showWrap
                  ? i18n._(t`Swap From (est.):`)
                  : i18n._(t`Swap From:`)
              }
              value={formattedAmounts[SwapField.INPUT]}
              showMaxButton={showMaxButton}
              currency={currencies[SwapField.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              fiatValue={fiatValueInput ?? undefined}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[SwapField.OUTPUT]}
              showCommonBases={true}
              id="swap-currency-input"
            />
            <AutoColumn gap="md">
              {/* body */}
              <div id="remove-liquidity-output" className="p-[108px] rounded bg-dark-800">
                {/* 1-click convert tokens to LP tokens.<br/> */}
              </div>

              {/* button area */}
              <div style={{ position: 'relative' }}>
                {!account ? (
                  <Web3Connect size="lg" color="blue" className="w-full" />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <ButtonConfirmed
                      onClick={onAttemptToApprove}
                      confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
                      disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <Dots>{i18n._(t`Approving`)}</Dots>
                      ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
                        i18n._(t`Approved`)
                      ) : (
                        i18n._(t`Approve`)
                      )}
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        setShowConfirm(true)
                      }}
                      disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                      error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                    >
                      {error || i18n._(t`Zap`)}
                    </ButtonError>
                  </div>
                )}
              </div>
            </AutoColumn>
          </div>
        </div>
      </DoubleGlowShadow>
    </Container>
  )
}
