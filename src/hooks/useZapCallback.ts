import { BigNumber } from '@ethersproject/bignumber'

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

export function useZapCallback() {}
