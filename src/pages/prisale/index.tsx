import React, { useEffect, useState, useRef } from 'react'
import Container from '../../components/Container'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NetworkGuard from '../../guards/Network'
import { ChainId } from '@cronaswap/core-sdk'
import { Currency, CurrencyAmount, Token } from '@cronaswap/core-sdk'
import Button from 'components/Button'
import Dots from 'components/Dots'
import Loader from 'components/Loader'
import { useActiveWeb3React } from 'services/web3'
import {
  useClaimCallback as useProtocolClaimCallback,
  useUserUnclaimedAmount as useUserUnclaimedProtocolAmount,
} from 'state/claim/protocol/hooks'
import { useModalOpen, useToggleSelfClaimModal } from 'state/application/hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { ApplicationModal } from 'state/application/actions'
import { getBalanceNumber } from 'functions/formatBalance'
import { usePrivateSaleContract } from 'hooks/useContract'
import { usePurchased, useClaimable, useClaimed } from 'hooks/useVestingInfo'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { CheckIcon } from '@heroicons/react/solid'
import ProgressBar from 'app/components/ProgressBar'
import NumericalInput from 'app/components/NumericalInput'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { USDC } from 'app/config/tokens'
import { prisaleToken } from 'app/constants/prisale'
import { tryParseAmount } from 'app/functions'
import { useApproveCallback, ApprovalState } from 'app/hooks'
import { PRIVATESALE_ADDRESS } from 'app/constants/addresses'

export default function Prisale() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const [investValue, setInvestValue] = useState('')
  const usdcBalance = Number(useTokenBalance(account ?? undefined, USDC[chainId])?.toSignificant(8))
  const usdcBalanceBignumber = useTokenBalance(account ?? undefined, USDC[chainId])
  const tokenBalance = Number(useTokenBalance(account ?? undefined, prisaleToken[chainId])?.toSignificant(8))

  const prisaleContract = usePrivateSaleContract()

  const parsedStakeAmount = tryParseAmount(investValue, usdcBalanceBignumber?.currency)
  const [approvalState, approve] = useApproveCallback(parsedStakeAmount, PRIVATESALE_ADDRESS[chainId])

  const isWhitelisted = useRef(false)
  const purchasedToken = useRef(0)
  const claimableToken = useRef(0)
  const minTokensAmount = useRef(0)
  const maxTokensAmount = useRef(0)
  const privateSaleStart = useRef(0)
  const privateSaleEnd = useRef(0)
  const getData = async () => {
    if (!account) return
    const tokenPrice = await prisaleContract.tokenPrice()
    minTokensAmount.current = ((Number(await prisaleContract.minTokensAmount()) / 1e18) * tokenPrice) / 10 ** 6
    maxTokensAmount.current = ((Number(await prisaleContract.maxTokensAmount()) / 1e18) * tokenPrice) / 10 ** 6
    privateSaleStart.current = Number(await prisaleContract.privateSaleStart())
    privateSaleEnd.current = Number(await prisaleContract.privateSaleEnd())
    isWhitelisted.current = await prisaleContract.whitelisted(account)
    purchasedToken.current = Number(await prisaleContract.purchased(account))
    claimableToken.current = Number(await prisaleContract.claimable(account))
  }
  getData()

  const [pendingTx, setPendingTx] = useState(false)

  const handleBuyToken = async () => {
    setPendingTx(true)
    try {
      const args = [USDC[chainId].address, Number(investValue) * 10 ** 6]
      const tx = await prisaleContract.purchaseTokenWithCoin(...args)
      addTransaction(tx, {
        summary: `${i18n._(t`Buy`)} ${prisaleToken[chainId].symbol}`,
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  const handleClaim = async () => {
    setPendingTx(true)
    try {
      const tx = await prisaleContract.claim()
      addTransaction(tx, {
        summary: `${i18n._(t`Claim`)} ${prisaleToken[chainId].symbol}`,
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  return (
    <div className="w-9/12 mt-20">
      <div className="mb-5">
        <div className="flex justify-between h-24 gap-1 md:gap-4">
          <div className="w-1/2 px-4 py-4 my-auto text-left rounded-lg md:px-10 bg-black-russian">
            <div className="text-1x1l">USDC Balance</div>
            <div className="text-2xl font-bold text-white">{usdcBalance ? usdcBalance : 0}</div>
          </div>
          <div className="w-1/2 px-4 py-4 my-auto text-left rounded-lg md:px-10 bg-black-russian">
            <div className="text-1xl">Token Balance</div>
            <div className="text-2xl font-bold">{tokenBalance ? tokenBalance : 0}</div>
          </div>
        </div>
      </div>
      <div className="py-5 rounded-lg px-7 bg-black-russian">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm">Private Sale</div>
            <div className="text-lg text-white">Buy {prisaleToken[chainId].symbol}</div>
          </div>
          <div className="space-y-2">
            {account && isWhitelisted.current ? (
              <div className="flex items-center h-6 p-2 border-[1px] text-carribean-green border-carribean-green rounded-3xl">
                <CheckIcon className="w-5 h-5" />
                Whitelisted
              </div>
            ) : (
              <div className="flex items-center h-6 p-2 border-[1px] text-red border-red rounded-3xl">
                <CheckIcon className="w-5 h-5" />
                Unwhitelisted
              </div>
            )}
          </div>
        </div>

        <div className="my-2 text-sm ">
          {i18n._(t`This private sale have whitelist limit. If you want to participate, You must register in the whitelist first.
          After the sales starts, the first come, first served mechanism will be adopted.`)}
        </div>

        <div className="my-7">
          {new Date().getTime() / 1e3 < privateSaleStart.current ? (
            <div>Private Sale not started</div>
          ) : new Date().getTime() / 1e3 > privateSaleEnd.current ? (
            <div>Private Sale ended</div>
          ) : (
            <ProgressBar
              progress={
                (new Date().getTime() / 1e3 - privateSaleStart.current) /
                (privateSaleEnd.current - privateSaleStart.current)
              }
              className="from-green to-carribean-green"
            />
          )}
        </div>

        <div className="flex items-center gap-3 p-4 mb-6 rounded-lg text-tahiti-gold bg-gradient-to-r from-tahiti-gold/5 to-tahiti-gold/10">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#F5841F" />
          </svg>
          {i18n._(
            t`The investment limit is set at Min ${minTokensAmount.current.toFixed()} USDC To Max ${maxTokensAmount.current.toFixed()} USDC per wallet.`
          )}
        </div>

        <div className="justify-center md:flex md:gap-5">
          <div className="px-5 py-9 border-[1px] border-gray-700 rounded-xl space-y-4 md:w-1/2">
            <div className="flex justify-between gap-1 px-1">
              {i18n._(t`Your investment (USDC)`)}
              <button
                className="text-light-blue"
                onClick={() => {
                  if (usdcBalance > 0) {
                    setInvestValue(usdcBalance?.toFixed(18))
                  }
                }}
              >
                Max
              </button>
            </div>
            <NumericalInput
              className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
              value={investValue}
              onUserInput={setInvestValue}
            />
            <div className="justify-center gap-4 space-y-2 lg:space-y-0 lg:flex ">
              <Button
                color="green"
                size="sm"
                className="h-12 opacity-90"
                disabled={approvalState === ApprovalState.PENDING}
                onClick={approve}
              >
                {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)}</Dots> : i18n._(t`Approve`)}
              </Button>
              {Number(investValue) < 10000 || Number(investValue) > 50000 ? (
                <Button color="gray" size="sm" className="h-12" disabled={true}>
                  Please notice the limit
                </Button>
              ) : approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
                <Button color="gray" size="sm" className="h-12" disabled={true}>
                  Buy ${prisaleToken[chainId].symbol} Now
                </Button>
              ) : (
                <Button color="blue" size="sm" className="h-12" onClick={handleBuyToken}>
                  Buy ${prisaleToken[chainId].symbol} Now
                </Button>
              )}
            </div>
          </div>
          <div className="px-5 py-9 border-[1px] border-gray-700 rounded-xl space-y-4 md:w-1/2">
            <div className="flex justify-between gap-3">
              <div className="rounded-lg border-[1px] border-gray-700 space-y-1 py-5 px-4 w-1/2">
                <div className="text-base text-white">{i18n._(t`Purchased ${prisaleToken[chainId].symbol}`)}</div>
                <div className="text-base">{(purchasedToken.current / 1e18).toFixed()}</div>
              </div>
              <div className="rounded-lg border-[1px] border-gray-700 py-5 space-y-1 px-4 w-1/2">
                <div className="text-base text-white">{i18n._(t`Claimable ${prisaleToken[chainId].symbol}`)}</div>
                <div className="text-base">{claimableToken.current / 1e18}</div>
              </div>
            </div>
            {new Date().getTime() / 1e3 <= privateSaleEnd.current ? (
              <Button color="gray" size="sm" className="h-12 opacity-90" disabled={true}>
                Private Sale is not over
              </Button>
            ) : (
              <Button color="blue" size="sm" className="h-12 opacity-90" onClick={handleClaim}>
                Claim Your {prisaleToken[chainId].symbol}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-11">
          <div className="mb-5 text-base text-white">* Private Sale description</div>
          <div className="pl-2 space-y-3 text-sm text-gray-500">
            <div>1, The Private Sale price: 0.12 USDC/{prisaleToken[chainId].symbol}</div>
            <div>2, The invest amount: Min - $2500, Max - $25,000 per wallet address.</div>
            <div>3, Private Sale time: Nov 8th @ 3pm UTC - Nov 10th @ 3pm UTC, total of 5,400,000 tokens.</div>
            <div>
              4, All tokens will be linearly unlocked within 1 year and can be claimed after unlocking (From the 7th day
              after launched).
            </div>
            <div>5, Participation method: whitelist allowed, the first come, first served purchase method.</div>
            <div className="overflow-x-auto">6, Private Sale contract: 0x309afba23f791B5c38Ab9057D11D6869755fAcaf</div>
          </div>
        </div>
      </div>
    </div>
  )
}
