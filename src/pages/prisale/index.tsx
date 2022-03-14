import React, { useEffect, useState } from 'react'
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
import {
  usePublicSaleContract,
  useSeedSaleContract,
  usePrivateSaleAContract,
  usePrivateSaleBContract,
} from 'hooks/useContract'
import { usePurchased, useClaimable, useClaimed } from 'hooks/useVestingInfo'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { CheckIcon } from '@heroicons/react/solid'
import ProgressBar from 'app/components/ProgressBar'
import NumericalInput from 'app/components/NumericalInput'

export default function Prisale() {
  const { i18n } = useLingui()
  const addTransaction = useTransactionAdder()

  const [investValue, setInvestValue] = useState('')
  const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account } = useActiveWeb3React()
  const [attempting, setAttempting] = useState<boolean>(false)
  const { claimCallback } = useProtocolClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedProtocolAmount(account)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = false
  const privateSaleAContract = usePrivateSaleAContract()
  const [pendingTx, setPendingTx] = useState(false)

  const handleClaim = async () => {
    setPendingTx(true)
    try {
      const tx = await privateSaleAContract.claim()
      addTransaction(tx, {
        summary: `${i18n._(t`Claim`)} CRONA`,
      })
    } catch (error) {
      console.error(error)
    }
    setPendingTx(false)
  }

  // once confirmed txn is found, if modal is closed open, mark as not attempting regradless
  useEffect(() => {
    if (claimConfirmed && claimSubmitted && attempting) {
      setAttempting(false)
      if (!isOpen) {
        toggleClaimModal()
      }
    }
  }, [attempting, claimConfirmed, claimSubmitted, isOpen, toggleClaimModal])

  // // remove once treasury signature passed
  const pendingTreasurySignature = false

  // New Adding
  const userPurchased = usePurchased(privateSaleAContract)
  const userClaimable = useClaimable(privateSaleAContract)
  const userClaimed = useClaimed(privateSaleAContract)

  const hasFetchedCronaAmount = userPurchased ? userPurchased.gte(0) : false
  const purchasedCrona = hasFetchedCronaAmount ? getBalanceNumber(userPurchased, 18) : 0
  const claimableCrona = hasFetchedCronaAmount ? getBalanceNumber(userClaimable, 18) : 0
  const unclaimedCrona = hasFetchedCronaAmount ? purchasedCrona - getBalanceNumber(userClaimed) : 0

  return (
    <div className="w-9/12 mt-20">
      <div className="flex mb-5">
        <div className="w-full h-24 gap-4 md:flex">
          <div className="w-1/2 px-10 py-4 my-auto text-left rounded-lg bg-black-russian">
            <div className=" text-1x1l">USDC Balance</div>
            <div className="text-2xl font-bold text-white">4839410.99</div>
          </div>
          <div className="w-1/2 px-10 py-4 my-auto text-left rounded-lg bg-black-russian">
            <div className=" text-1xl">Token Balance</div>
            <div className="text-2xl font-bold">4839410.99</div>
          </div>
        </div>
      </div>
      <div className="py-5 rounded-lg px-7 bg-black-russian">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-sm">Private Sale</div>
            <div className="text-lg text-white">Buy MERTA</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center h-6 p-2 border-[1px] text-carribean-green border-carribean-green rounded-3xl">
              <CheckIcon className="w-5 h-5" />
              Whitelisted
            </div>
            <div className="flex items-center h-6 p-2 border-[1px] text-red border-red rounded-3xl">
              <CheckIcon className="w-5 h-5" />
              Whitelisted
            </div>
          </div>
        </div>

        <div className="my-2 text-sm ">
          {i18n._(t`This private sale have whitelist limit. If you want to participate, You must register in the whitelist first.
          After the sales starts, the first come, first served mechanism will be adopted.`)}
        </div>

        <div className="my-7">
          <ProgressBar progress={0.3} className="from-green to-carribean-green" />
        </div>

        <div className="flex items-center gap-3 p-4 mb-6 rounded-lg text-tahiti-gold bg-gradient-to-r from-tahiti-gold/5 to-tahiti-gold/10">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#F5841F" />
          </svg>
          {i18n._(t`The investment limit is set at Min 2500 USDC To Max 25000 USDC per wallet.`)}
        </div>

        <div className="justify-center md:flex md:gap-5">
          <div className="px-5 py-9 border-[1px] border-gray-700 rounded-xl space-y-3 w-1/2">
            <div className="flex justify-between px-1 ">
              {i18n._(t`Your investment (USDC)`)}
              <button className="text-light-blue">Max</button>
            </div>
            <NumericalInput
              className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
              value={investValue}
              onUserInput={setInvestValue}
            />
            <div className="flex justify-center gap-4">
              <Button color="green" size="sm" className="h-12 opacity-90">
                Approve
              </Button>
              <Button color="blue" size="sm" className="h-12">
                Buy $METRA Now
              </Button>
            </div>
          </div>
          <div className="px-5 py-9 border-[1px] border-gray-700 rounded-xl space-y-3 w-1/2">
            <div className="flex justify-between gap-3">
              <div className="rounded-lg border-[1px] border-gray-700 py-6 px-4 w-1/2">
                <div className="text-base text-white">{i18n._(t`Purchased METRAs`)}</div>
                <div className="text-sm ">492,252,311</div>
              </div>
              <div className="rounded-lg border-[1px] border-gray-700 py-6 px-4 w-1/2">
                <div className="text-base text-white">{i18n._(t`Claimable METRAs`)}</div>
                <div className="text-sm ">492,252,311</div>
              </div>
            </div>
            <Button color="blue" size="sm" className="h-12 opacity-90">
              Claim Your METRA
            </Button>
          </div>
        </div>

        <div className="mt-11">
          <div className="mb-5 text-base text-white">* Private Sale description</div>
          <div className="pl-2 space-y-3 text-sm text-gray-500">
            <div>1, The Private Sale price: 0.12 USDC/MERTA</div>
            <div>2, The invest amount: Min - $2500, Max - $25,000 per wallet address.</div>
            <div>3, Private Sale time: Nov 8th @ 3pm UTC - Nov 10th @ 3pm UTC, total of 5,400,000 tokens.</div>
            <div>
              4, All tokens will be linearly unlocked within 1 year and can be claimed after unlocking (From the 7th day
              after launched).
            </div>
            <div>5, Participation method: whitelist allowed, the first come, first served purchase method.</div>
            <div>6, Private Sale contract: 0x309afba23f791B5c38Ab9057D11D6869755fAcaf</div>
          </div>
        </div>
      </div>
    </div>
  )
}
