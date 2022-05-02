import { Currency, CurrencyAmount } from '@cronaswap/core-sdk'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { FarmPairInfo } from 'app/constants/farmsv1'
import { calculateGasMargin } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useZapContract } from './useContract'

export enum ZapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface ZapCall {
  address: string
  calldata: string
  value: string
}

interface ZapCallEstimate {
  call: ZapCall
}

export interface SuccessfulCall extends ZapCallEstimate {
  call: ZapCall
  gasEstimate: BigNumber
}

interface FailedCall extends ZapCallEstimate {
  call: ZapCall
  error: Error
}

export type EstimatedSZapCall = SuccessfulCall | FailedCall

export function useZapCallArguments() {}

export function zapErrorToUserReadableMessage(error: any): string {
  return ''
}

export function useZapCallback(
  inputCurrency: Currency,
  parsedAmount: CurrencyAmount<Currency>,
  outputLPToken: FarmPairInfo,
  gasPrice: string
): {
  state: ZapCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  const { account, chainId, library } = useActiveWeb3React()
  const zapContract: Contract | null = useZapContract()
  const addTransaction = useTransactionAdder()
  const amount = parsedAmount?.quotient.toString()
  if (!inputCurrency || !amount || !outputLPToken || !account || !chainId || !zapContract) {
    return {
      state: ZapCallbackState.INVALID,
      callback: null,
      error: 'Missing dependencies',
    }
  }
  const args = [inputCurrency?.wrapped?.address, amount, outputLPToken?.lpToken]
  return {
    state: ZapCallbackState.VALID,
    error: null,
    callback: async function onZap(): Promise<string> {
      return zapContract.estimateGas['zapInToken'](...args, {}).then((estimatedGasLimit) => {
        return zapContract
          .zapInToken(
            ...args
            //   , {
            //   value: null,
            //   gasLimit: calculateGasMargin(estimatedGasLimit),
            //   gasPrice,
            // }
          )
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary:
                'ZapIn from ' +
                parsedAmount.toFixed(2) +
                ' ' +
                inputCurrency?.symbol +
                ' to ' +
                outputLPToken?.token0.symbol +
                '-' +
                outputLPToken?.token1.symbol,
            })
            return response.hash
          })
      })
    },
  }
}
