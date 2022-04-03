import { CRONA_ADDRESS, Currency, CurrencyAmount, NATIVE, WNATIVE, WNATIVE_ADDRESS } from '@cronaswap/core-sdk'
import useFarmsV2 from 'app/features/farms/useFarmsV2'
import { formatCurrencyAmount, maxAmountSpend } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import useWrapCallback from 'app/hooks/useWrapCallback'
import TransactionConfirmationModal, { TransactionErrorContent } from 'app/modals/TransactionConfirmationModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useDefaultsFromURLSearch } from 'app/state/swap/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useState } from 'react'
import Button from '../Button'
import Input from '../Input'
import Web3Connect from '../Web3Connect'

const SwapCroToWCro = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const [inputValue, setinputValue] = useState('0.0')
  const handleInputValue = (value: string) => {
    setinputValue(value)
  }

  const NativeToken: Currency = NATIVE[chainId]
  const WNativeToken: Currency = WNATIVE[chainId]
  const currency: Currency = NativeToken
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(selectedCurrencyBalance)
  const handleMax = () => {
    setinputValue(maxInputAmount.toExact())
  }

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(NativeToken, WNativeToken, inputValue)

  const [{ showConfirm, wrapErrorMessage, attemptingTxn, txHash }, setWrapState] = useState<{
    showConfirm: boolean
    attemptingTxn: boolean
    wrapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    attemptingTxn: false,
    wrapErrorMessage: undefined,
    txHash: undefined,
  })

  const addTransaction = useTransactionAdder()
  const handleErrorDismiss = () => {
    setWrapState({
      attemptingTxn: false,
      showConfirm: false,
      wrapErrorMessage: undefined,
      txHash: undefined,
    })
  }
  const handleWrap = async function () {
    setWrapState({
      attemptingTxn: true,
      showConfirm: true,
      wrapErrorMessage: undefined,
      txHash: undefined,
    })

    const { tx, error } = await onWrap()
    if (Boolean(error)) {
      setWrapState({
        attemptingTxn: false,
        showConfirm: true,
        wrapErrorMessage: error,
        txHash: '',
      })
    } else {
      setWrapState({
        attemptingTxn: false,
        showConfirm: false, // showConfirm,
        wrapErrorMessage: undefined,
        txHash: tx,
      })
    }
  }
  return (
    <div className="w-[532px] h-[429px] bg-[#1C1B38] rounded relative">
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={() => {}}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() =>
          wrapErrorMessage && (
            <TransactionErrorContent
              onDismiss={() => {
                handleErrorDismiss()
              }}
              message={wrapErrorMessage}
            />
          )
        }
        pendingText={'Wrapping ' + inputValue + ' ' + NativeToken?.symbol}
        currencyToAdd={undefined}
      />
      <div className="mt-10 ml-10">
        <h4 className="text-white font-bold text-[36px] leading-[44.65px]">Swap {NativeToken?.symbol}</h4>
        <p className="mt-2 text-[14px] leading-[16px] font-normal">
          Swap your {NativeToken?.symbol} to {WNativeToken?.symbol} for free
        </p>
      </div>
      <div className="flex flex-col mx-10 mt-10">
        <div className="flex flex-row justify-between">
          <p className="mt-2 text-[14px] leading-[16px] font-normal">Wallet Balance</p>
          <div className="flex flex-row text-[14px] leading-[24px] font-bold gap-1">
            <p className="text-[#2172E5]">{formatCurrencyAmount(selectedCurrencyBalance, 4)}</p>
            <p>{NativeToken?.symbol}</p>
          </div>
        </div>
        <div className="border mt-2 border-[#2172E5] bg-[#0D0C2B] rounded h-[60px] flex flex-row items-center pl-6">
          <Input.Numeric
            id="token-amount-input"
            value={inputValue}
            onUserInput={(val) => {
              handleInputValue(val)
            }}
          />
          <button
            className="bg-[#2172E51A] w-[73px] text-[#2172E5] h-full font-semibold text-[16px] leading-[16px] rounded-r"
            onClick={() => {
              handleMax()
            }}
          >
            MAX
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-between mx-10 mt-6">
        <p className="mt-2 text-[14px] leading-[16px] font-normal">You get:</p>
        <div className="flex flex-row text-[14px] leading-[24px] font-bold gap-1">
          <p className="text-[#2172E5]">{inputValue}</p>
          <p>{WNativeToken?.symbol}</p>
        </div>
      </div>
      <div className="items-stretch w-[452px] h-[60px] mx-10 mt-10">
        {!account ? (
          <Web3Connect color="blue" className="w-full h-full text-base text-white" />
        ) : Boolean(wrapInputError) ? (
          <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
            {wrapInputError}
          </button>
        ) : (
          <Button
            color="blue"
            size="lg"
            onClick={() => {
              handleWrap()
            }}
          >
            Swap
          </Button>
        )}
      </div>
    </div>
  )
}

export default SwapCroToWCro
