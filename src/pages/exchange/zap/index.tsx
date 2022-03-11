import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { ButtonConfirmed, ButtonError } from '../../../components/Button'
import {
  ChainId,
  Currency,
  CurrencyAmount,
  JSBI,
  NATIVE,
  Percent,
  WNATIVE,
  WNATIVE_ADDRESS,
  Trade as V2Trade,
  Token,
  TradeType,
} from '@cronaswap/core-sdk'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CurrencyInputPanel from 'app/components/CurrencyInputPanel'
import { useDefaultsFromURLSearch, useDerivedZapInfo, useZapActionHandlers, useZapState } from 'app/state/zap/hooks'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'app/state/swap/hooks'
import { Field as ZapField } from 'app/state/zap/actions'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from '../../../state/burn/hooks'
import { usePairContract, useRouterContract, useZapContract } from '../../../hooks/useContract'

import Column, { AutoColumn } from '../../../components/Column'
import Container from '../../../components/Container'
import { Contract } from '@ethersproject/contracts'
import DoubleGlowShadow from '../../../components/DoubleGlowShadow'
import Head from 'next/head'
import Header from '../../../features/trade/Header'
import Web3Connect from '../../../components/Web3Connect'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../../services/web3'
import { useLingui } from '@lingui/react'
import { useRouter } from 'next/router'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import {
  useExpertModeManager,
  useUserSingleHopOnly,
  useUserSlippageToleranceWithDefault,
} from '../../../state/user/hooks'
import { maxAmountSpend, warningSeverity } from 'app/functions'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import { AutoRow, RowBetween } from 'app/components/Row'
import { Zap as ZapIcon } from 'react-feather'
import LPTokenSelectPanel from 'app/components/LPTokenSelectPanel'
import Button from 'app/components/Button/index.new'
import { BottomGrouping, ZapCallbackError } from 'app/features/zap/styleds'
import { useIsZapUnsupported } from 'app/hooks/useIsZapUnsupported'
import { useToggleSettingsMenu } from 'app/state/application/hooks'
import Loader from 'app/components/Loader'
import ProgressSteps from '../../../components/ProgressSteps'
import { useZapCallback } from 'app/hooks/useZapCallback'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import ConfirmZapModal from 'app/features/zap/ConfirmZapModal'
import { useAllTokens, useZapInTokens } from 'app/hooks/Tokens'

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export default function Zap() {
  const { i18n } = useLingui()

  const { independentField, typedValue, recipient } = useZapState()

  // for expert mode
  const [isExpertMode, setExpertMode] = useExpertModeManager()
  const toggleSettings = useToggleSettingsMenu()

  const {
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: zapInputError,
    lpToken,
    zapTrade,
  } = useDerivedZapInfo()

  const [currencyA, currencyB] = [currencies[ZapField.INPUT], undefined]
  const { account, chainId, library } = useActiveWeb3React()

  const inputCurrencyAddress = currencies[ZapField.INPUT]?.wrapped.address
  const outputLPTokenAddress = lpToken[ZapField.OUTPUT]?.lpToken
  // burn state
  const isValid = true
  const deadline = useTransactionDeadline()
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE)

  const zapContract: Contract | null = useZapContract()

  // allowance handling
  const [approvalState, approveCallback] = useApproveCallback(parsedAmount, zapContract?.address)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  const dependentField: ZapField = independentField === ZapField.INPUT ? ZapField.OUTPUT : ZapField.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: '',
  }

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[ZapField.INPUT])
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmount?.equalTo(maxInputAmount))

  const { onSwitchTokens, onCurrencySelection, onLPTokenSelection, onUserInput, onChangeRecipient } =
    useZapActionHandlers()

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(ZapField.INPUT, value)
    },
    [onUserInput]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(ZapField.OUTPUT, value)
    },
    [onUserInput]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(ZapField.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(ZapField.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const handleLPTokenSelect = useCallback(
    (lpToken) => onLPTokenSelection(ZapField.OUTPUT, lpToken),
    [onLPTokenSelection]
  )

  const fiatValueInput = useUSDCValue(parsedAmount)

  // modal and loading
  const [{ showConfirm, zapErrorMessage, attemptingTxn, txHash }, setZapState] = useState<{
    showConfirm: boolean
    attemptingTxn: boolean
    zapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    attemptingTxn: false,
    zapErrorMessage: undefined,
    txHash: undefined,
  })

  const handleAcceptChanges = useCallback(() => {
    setZapState({
      zapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    })
  }, [attemptingTxn, showConfirm, zapErrorMessage, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(ZapField.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )
  const handleConfirmDismiss = useCallback(() => {
    setZapState({
      showConfirm: false,
      attemptingTxn,
      zapErrorMessage,
      txHash,
    })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(ZapField.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, zapErrorMessage, txHash])

  const addTransaction = useTransactionAdder()
  const handleZap = async function () {
    setZapState({
      attemptingTxn: true,
      showConfirm,
      zapErrorMessage: undefined,
      txHash: undefined,
    })
    const amount = parsedAmount.quotient.toString()

    // await approveCallback()
    try {
      const tx = await zapContract.zapInToken(inputCurrencyAddress, amount, outputLPTokenAddress)
      setZapState({
        attemptingTxn: false,
        showConfirm, // showConfirm,
        zapErrorMessage: undefined,
        txHash: tx.hash,
      })
      return addTransaction(tx, {
        summary:
          'ZapIn from ' +
          typedValue +
          ' ' +
          currencies[ZapField.INPUT]?.symbol +
          ' to ' +
          lpToken[ZapField.OUTPUT]?.token0.symbol +
          '-' +
          lpToken[ZapField.OUTPUT]?.token1.symbol,
      })
    } catch (error) {
      setZapState({
        attemptingTxn: false,
        showConfirm,
        zapErrorMessage: 'No transaction submitted!',
        txHash: '',
      })
    }
  }

  const zapIsUnsupported = useIsZapUnsupported(currencies?.INPUT, lpToken?.OUTPUT)

  const userHasSpecifiedInputOutput = Boolean(
    currencies[ZapField.INPUT] && lpToken[ZapField.OUTPUT] && parsedAmount?.greaterThan(JSBI.BigInt(0))
  )

  const [singleHopOnly] = useUserSingleHopOnly()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !zapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED))

  // the callback to execute the zap
  const { callback: zapCallback, error: zapCallbackError } = useZapCallback(allowedSlippage, recipient)

  const zapInTokens = useZapInTokens()
  const zapInCurrencyList = Object.keys(zapInTokens).flat()

  return (
    <Container id="remove-liquidity-page" className="py-4 space-y-4 md:py-12 lg:py-24" maxWidth="2xl">
      <Head>
        <title>Zap | CronaSwap</title>
        <meta key="description" name="description" content="Remove liquidity from the CronaSwap AMM" />
      </Head>

      <DoubleGlowShadow>
        <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
          <Header input={currencyA} output={currencyB} allowedSlippage={allowedSlippage} />
          <ConfirmZapModal
            trade={zapTrade}
            isOpen={showConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleZap}
            zapErrorMessage={zapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <div>
            <CurrencyInputPanel
              label={i18n._(t`Zap From:`)}
              value={formattedAmounts[ZapField.INPUT]}
              showMaxButton={showMaxButton}
              currency={currencies[ZapField.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              fiatValue={fiatValueInput ?? undefined}
              onCurrencySelect={handleInputSelect}
              otherCurrency={null}
              showCommonBases={false}
              id="zap-currency-input"
              currencyList={zapInCurrencyList}
            />
            <AutoColumn justify="space-between" className="py-2.5">
              <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                <button className="z-10 -mt-6 -mb-6 rounded-full cursor-default bg-dark-900 p-3px">
                  <div className="p-3 rounded-full bg-dark-800">
                    <ZapIcon size="32" />
                  </div>
                </button>
              </AutoRow>
            </AutoColumn>
            <LPTokenSelectPanel
              label={i18n._(t`Zap To (estimate not available):`)}
              showMaxButton={false}
              hideBalance={true}
              currency={currencies[ZapField.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[ZapField.INPUT]}
              showCommonBases={true}
              id="zap-currency-output"
              onLPTokenSelect={handleLPTokenSelect}
              lpToken={lpToken[ZapField.OUTPUT]}
            />
            <AutoColumn className="md py-2.5" gap={'md'}>
              {/* body */}
              <div id="remove-liquidity-output" className="p-1 rounded bg-dark-800">
                1-click convert tokens to LP tokens.
                <br />
              </div>
            </AutoColumn>
            <BottomGrouping>
              {zapIsUnsupported ? (
                <Button color="red" size="lg" disabled>
                  {i18n._(t`Unsupported Asset`)}
                </Button>
              ) : !account ? (
                <Web3Connect size="lg" color="blue" className="w-full" />
              ) : // !userHasSpecifiedInputOutput ? (
              //   <div style={{ textAlign: 'center' }}>
              //     <div className="mb-1">{i18n._(t`Insufficient liquidity for this trade`)}</div>
              //     {singleHopOnly && <div className="mb-1">{i18n._(t`Try enabling multi-hop trades`)}</div>}
              //   </div>
              // ) :
              showApproveFlow ? (
                <div>
                  {approvalState !== ApprovalState.APPROVED && (
                    <ButtonConfirmed
                      onClick={handleApprove}
                      disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                      size="lg"
                    >
                      {approvalState === ApprovalState.PENDING ? (
                        <div className="flex items-center justify-center h-full space-x-2">
                          <div>Approving</div>
                          <Loader stroke="white" />
                        </div>
                      ) : (
                        i18n._(t`Approve ${currencies[ZapField.INPUT]?.symbol}`)
                      )}
                    </ButtonConfirmed>
                  )}
                  {approvalState === ApprovalState.APPROVED && (
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleZap()
                        } else {
                          setZapState({
                            attemptingTxn: false,
                            zapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          })
                        }
                      }}
                      id="zap-button"
                      disabled={
                        !isValid ||
                        (zapInputError ? true : false) ||
                        approvalState !== ApprovalState.APPROVED /*|| !!zapCallbackError*/
                      }
                    >
                      {zapInputError ? zapInputError : i18n._(t`Zap`)}
                    </ButtonError>
                  )}
                </div>
              ) : (
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleZap()
                    } else {
                      setZapState({
                        attemptingTxn: false,
                        zapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="zap-button"
                  disabled={
                    !isValid ||
                    (zapInputError ? true : false) ||
                    approvalState !== ApprovalState.APPROVED /*|| !!zapCallbackError*/
                  }
                >
                  {zapInputError ? zapInputError : i18n._(t`Zap`)}
                </ButtonError>
              )}
              {showApproveFlow && (
                <Column style={{ marginTop: '1rem' }}>
                  <ProgressSteps steps={[approvalState === ApprovalState.APPROVED]} />
                </Column>
              )}
              {isExpertMode && zapErrorMessage ? <ZapCallbackError error={zapErrorMessage} /> : null}
            </BottomGrouping>
          </div>
        </div>
      </DoubleGlowShadow>
    </Container>
  )
}
