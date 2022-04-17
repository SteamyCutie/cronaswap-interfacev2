import { ChainId, Currency, CurrencyAmount, NATIVE, WNATIVE } from '@cronaswap/core-sdk'

import { tryParseAmount } from '../functions/parse'
import { useActiveWeb3React } from '../services/web3'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useDiceRollContract, useWETH9Contract } from './useContract'
import { maxAmountSpend } from 'app/functions'
import { ApprovalState, useApproveCallback } from './useApproveCallback'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { result } from 'lodash'
import { splitSignature } from '@ethersproject/bytes'
import { DiceRollOption } from 'app/constants/gamefi'
import { GameBetStatus } from 'app/features/gamefi'

const NOT_APPLICABLE = { error: 'Not Applicable!' }

export function useEIP712BetSignMessageGenerator(
  domainName: string | '',
  domainVersion: string | '',
  chainId: number | undefined,
  verifyingContract: Contract | undefined,
  player: string | undefined,
  amount: BigNumber | undefined,
  choice: DiceRollOption | undefined,
  token: string | '',
  nonce: number | undefined,
  deadline: number | undefined,
  onBeforeSign: () => void,
  onAfterSign: (value) => void,
  onGenerateSign: (value) => void,
  onRejectedSign: () => void
): { signature?: any; onSign?: () => void } {
  const { account, library } = useActiveWeb3React()
  const [signatureData, setSignatureData] = useState(null)
  let diceRollOptionStr = ''
  for (let i = 0; i < 6; i++) {
    diceRollOptionStr += choice[i] ? '1' : '0'
  }
  return {
    onSign: () => {
      const msgParams = JSON.stringify({
        domain: {
          // Give a user friendly name to the specific contract you are signing for.
          name: domainName,
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: domainVersion,
          // Defining the chain aka Rinkeby testnet or Ethereum Main Net
          chainId: chainId,
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: verifyingContract.address,
        },

        // Defining the message signing data content.
        message: {
          player: player,
          amount: amount.toString(),
          choice: diceRollOptionStr,
          token: token,
          nonce: nonce,
          deadline: deadline,
        },
        // Refers to the keys of the *types* object below.
        primaryType: 'PlaceBet',
        types: {
          // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          // Refer to PrimaryType
          PlaceBet: [
            { name: 'player', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'choice', type: 'string' },
            { name: 'token', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
        },
      })

      onBeforeSign()
      library
        .send('eth_signTypedData_v4', [account, msgParams])
        .then(
          (signature) => {
            onAfterSign(signature)
            return splitSignature(signature)
          },
          (reason) => {
            onRejectedSign()
          }
        )
        .then(
          (signature) => {
            setSignatureData(signature)
          },
          (reason) => {}
        )
    },
    signature: signatureData,
  }
}

export function useDiceRollCallback_PlaceBet(
  selectedCurrency: Currency | undefined,
  inputValue: string | undefined,
  totalBetsCount: number | 0,
  diceRollBetStatus: GameBetStatus | undefined
): {
  error?: string | ''
  rewards?: undefined | BigNumber
  claimRewards?: undefined | ((onAfterClaim) => Promise<{ tx: string; error: string }>)
  approvalState?: ApprovalState | undefined
  approveCallback?: () => Promise<void>
  contract?: Contract
  betsCountByPlayer?: number | 0
  minBetAmount?: BigNumber | undefined
  maxBetAmount?: BigNumber | undefined
  multiplier?: number | 0
} {
  const { chainId, account } = useActiveWeb3React()
  const dicerollContract = useDiceRollContract()
  const balance = maxAmountSpend(useCurrencyBalance(account ?? undefined, selectedCurrency))
  const selectedCurrencyAmount = useMemo(
    () => tryParseAmount(inputValue, selectedCurrency),
    [selectedCurrency, inputValue]
  )
  const tokenAddress = selectedCurrency?.wrapped.address
  const [approvalState, approveCallback] = useApproveCallback(selectedCurrencyAmount, dicerollContract?.address)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const addTransaction = useTransactionAdder()

  const [rewards, setrewards] = useState<BigNumber>(undefined)
  const [betsCountByPlayer, setbetsCountByPlayer] = useState<number>(0)
  let callResult = useSingleCallResult(dicerollContract, 'getBetAmountRangeByToken', [
    selectedCurrency?.wrapped.address,
  ])?.result
  const { minBetAmount, maxBetAmount } = useMemo(() => {
    return { minBetAmount: callResult && callResult[0], maxBetAmount: callResult && callResult[1] }
  }, [callResult])

  callResult = useSingleCallResult(dicerollContract, 'getMultiplier', [
    tokenAddress,
    selectedCurrencyAmount?.quotient.toString() ?? '0',
  ])?.result
  const multiplier: number = useMemo(() => {
    return BigNumber.from((callResult && callResult[0]?.toString()) ?? 0).toNumber()
  }, [callResult])

  useEffect(() => {
    async function FetchPlayerInfo() {
      try {
        setbetsCountByPlayer((await dicerollContract.getBetsCountByPlayer(tokenAddress)).toNumber())
        setrewards(await dicerollContract.getRewardsAmountByPlayer(tokenAddress))
      } catch {
        setbetsCountByPlayer(0)
        setrewards(BigNumber.from(0))
      }
    }

    FetchPlayerInfo()
  }, [chainId, account, selectedCurrency, totalBetsCount, diceRollBetStatus])
  return useMemo(() => {
    if (!chainId && dicerollContract) return NOT_APPLICABLE

    const hasInputAmount = Boolean(selectedCurrencyAmount?.greaterThan('0'))
    const sufficientBalance = selectedCurrencyAmount && balance && !balance.lessThan(selectedCurrencyAmount)
    const rangedBalance =
      selectedCurrencyAmount &&
      minBetAmount &&
      ((selectedCurrencyAmount?.greaterThan(minBetAmount?.toString()) &&
        selectedCurrencyAmount?.lessThan(maxBetAmount?.toString())) ||
        selectedCurrencyAmount?.equalTo(minBetAmount?.toString()) ||
        selectedCurrencyAmount?.equalTo(maxBetAmount?.toString()))
    return {
      multiplier,
      minBetAmount,
      maxBetAmount,
      betsCountByPlayer,
      approvalState,
      approveCallback,
      error: sufficientBalance
        ? rangedBalance
          ? undefined
          : `${selectedCurrency?.symbol} Bet Amount Out of Range`
        : hasInputAmount
        ? `Insufficient ${selectedCurrency?.symbol} balance`
        : `Enter ${selectedCurrency?.symbol} amount`,
      rewards: rewards,
      claimRewards: async (onAfterClaim) => {
        try {
          const txReceipt = await dicerollContract.claimRewards(selectedCurrency.wrapped.address)
          await txReceipt.wait()
          addTransaction(txReceipt, {
            summary: `Get Rewards of ${selectedCurrency.symbol}`,
          })
          setrewards(BigNumber.from(0))
          onAfterClaim()
          return { tx: txReceipt, error: undefined }
        } catch (error) {
          onAfterClaim()
          return { tx: undefined, error: error?.message }
        }
      },
      contract: dicerollContract,
    }
  }, [
    dicerollContract,
    chainId,
    account,
    selectedCurrencyAmount,
    balance,
    addTransaction,
    rewards,
    minBetAmount,
    maxBetAmount,
    betsCountByPlayer,
    approvalState,
    diceRollBetStatus,
  ])
}

export function useDiceRollCallback_GameReview(
  selectedCurrency: Currency | undefined,
  totalBetsCount: number | undefined,
  diceRollBetStatus: GameBetStatus | undefined
): {
  error?: string | ''
  betsByToken?: []
  topGamers?: []
  betsByPlayer?: []
} {
  const { chainId, account } = useActiveWeb3React()
  const dicerollContract = useDiceRollContract()

  const tokenAddress = selectedCurrency?.wrapped.address
  const [betsByPlayer, setbetsByPlayer] = useState<[]>([])
  const [betsByToken, setbetsByToken] = useState<[]>([])
  const [topGamers, settopGamers] = useState<[]>([])

  // let callResult = useSingleCallResult(dicerollContract, 'getBetsByIndex', ['100'])?.result
  // const betsByIndex = useMemo(() => {
  //   return (callResult && callResult[0]) ?? []
  // }, [callResult])

  // callResult = useSingleCallResult(dicerollContract, 'getTopGamers', [tokenAddress])?.result
  // const topGamers = useMemo(() => {
  //   return (callResult && callResult[0]) ?? []
  // }, [callResult])

  useEffect(() => {
    async function FetchPlayerInfo() {
      try {
        setbetsByToken(await dicerollContract?.getBetsByToken(tokenAddress, '100'))
        settopGamers(await dicerollContract?.getTopGamers(tokenAddress))
        if (account) {
          setbetsByPlayer(await dicerollContract?.getBetsByPlayer(tokenAddress, '100'))
        } else {
          setbetsByPlayer([])
        }
      } catch {}
    }

    FetchPlayerInfo()
  }, [account, selectedCurrency, totalBetsCount, chainId, diceRollBetStatus])
  return useMemo(() => {
    if (!chainId && dicerollContract) return NOT_APPLICABLE
    return {
      betsByPlayer,
      topGamers,
      betsByToken,
      contract: dicerollContract,
    }
  }, [dicerollContract, chainId, betsByToken, betsByPlayer, topGamers, totalBetsCount, account, diceRollBetStatus])
}

export function useDiceRollCallback_Volume(selectedCurrency: Currency | undefined): {
  error?: string | ''
  contract?: Contract
  totalBetsCount?: number | 0
  totalBetsAmount?: BigNumber | undefined
} {
  const { chainId, account } = useActiveWeb3React()
  const dicerollContract = useDiceRollContract()

  const tokenAddress = selectedCurrency?.wrapped.address

  const totalBetInfo = useSingleCallResult(dicerollContract, 'getBetsAmountAndCountByToken', [tokenAddress])?.result
  const { totalBetsCount, totalBetsAmount } = useMemo(() => {
    return {
      totalBetsCount: BigNumber.from(totalBetInfo?.totalBetsCount.toString() ?? 0).toNumber(),
      totalBetsAmount: BigNumber.from(totalBetInfo?.totalBetsAmount.toString() ?? 0),
    }
  }, [totalBetInfo])

  return useMemo(() => {
    if (!chainId && dicerollContract) return NOT_APPLICABLE

    return {
      totalBetsAmount,
      totalBetsCount,
      contract: dicerollContract,
    }
  }, [dicerollContract, chainId, account, totalBetsAmount, totalBetsCount])
}
