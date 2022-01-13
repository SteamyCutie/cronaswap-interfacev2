import { Currency, CurrencyAmount, Token } from '@cronaswap/core-sdk'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useClaimCallback, useUserUnclaimedAmount } from '../../state/claim/weekly/hooks'
import {
  useClaimCallback as useProtocolClaimCallback,
  useUserUnclaimedAmount as useUserUnclaimedProtocolAmount,
} from '../../state/claim/protocol/hooks'
import { useModalOpen, useToggleSelfClaimModal } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import { BigNumber } from '@ethersproject/bignumber'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import ExternalLink from '../../components/ExternalLink'
import Fraction from '../../entities/Fraction'
import Head from 'next/head'
import Loader from '../../components/Loader'
import QuestionHelper from '../../components/QuestionHelper'
import { formatNumber } from '../../functions/format'
import { isAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../services/web3'
import { useLingui } from '@lingui/react'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import NetworkGuard from '../../guards/Network'
import { ChainId } from '@cronaswap/core-sdk'

const Strategies = () => {
  const { i18n } = useLingui()
  return (
    <>
      <Head>
        <title>Vesting | CronaSwap</title>
        <meta name="description" content="Vesting..." />
      </Head>
      <Container maxWidth="5xl" className="flex flex-col gap-8 px-4 py-8">
        {/* Not need for now, so hidden */}
        {/* <div className="space-y-10 md:block">
          <div className="relative w-full p-4 overflow-hidden rounded bg-dark-600">
            <div className="font-bold text-lg text-white">{i18n._(t`Claim CRONA For Airdrop Activity`)}</div>
            <div className="pt-2 text-sm font-bold text-gray-400">
              <ul className="list-disc px-6 ">
                <li>
                  1% - unlocked at 1st day, 3% - unlocked at 5th day, 6% - unlocked at 10th day, after vesting start.
                </li>
                <li>90% of tokens will be linearly unlocked within 1 year and can be claimed after unlocking.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AirdropVesting />
          <AirdropVesting />
        </div> */}

        <div className="space-y-10 md:block">
          <div className="relative w-full p-4 overflow-hidden rounded bg-cyan-blue">
            <div className="font-bold text-lg text-white">
              {i18n._(t`Claim CRONA For Seed / Private / Public Sale`)}
            </div>
            <div className="pt-2 text-sm font-bold text-gray-400">
              <ul className="list-disc px-6 text-white">
                <li>
                  1% - unlocked at 1st day, 3% - unlocked at 5th day, 6% - unlocked at 10th day, after vesting start.
                </li>
                <li>90% of tokens will be linearly unlocked within 1 year and can be claimed after unlocking.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TokenSaleVesting />
          <TokenSaleVesting />
          <TokenSaleVesting />
          <TokenSaleVesting />
        </div>
      </Container>
    </>
  )
}

const AirdropVesting = () => {
  const { i18n } = useLingui()

  const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account } = useActiveWeb3React()
  const [attempting, setAttempting] = useState<boolean>(false)
  const { claimCallback } = useProtocolClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedProtocolAmount(account)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = false

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        console.log(error)
      })
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

  const [totalLocked, setTotalLocked] = useState<string>()
  useEffect(() => {
    const fetchLockup = async () => {
      if (account) {
        fetch(
          'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/amounts-protocols-10959148-12171394.json'
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log('vesting:', data)
            const userLockedAmount = data[account.toLowerCase()] ? data[account.toLowerCase()] : '0'
            const userLocked = Fraction.from(BigNumber.from(userLockedAmount), BigNumber.from(10).pow(18)).toString()
            setTotalLocked(userLocked)
            // console.log('userLocked:', userLocked)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      return []
    }
    fetchLockup()
  }, [account])

  // remove once treasury signature passed
  const pendingTreasurySignature = false

  return (
    <div className="flex flex-col gap-3 md:max-w-full">
      <div className="relative w-full h-full overflow-hidden rounded bg-dark-900">
        <div className="flex flex-col gap-3 p-4">
          <div className="font-bold text-lg text-white">{i18n._(t`Claimable CRONA from Testnet Airdrop`)}</div>
          <div className="flex flex-col items-baseline">
            <div className="font-bold text-white text-[26px]">1320.0132</div>
            {account ? (
              <div className="text-sm text-secondary">{i18n._(t`Your Claimable CRONAs`)}</div>
            ) : (
              <div className="text-sm text-secondary">{i18n._(t`Your Claimable CRONAs: Connect Wallet`)}</div>
            )}
          </div>
          <div className="flex flex-col pb-4 space-y-2">
            <div className="flex flex-row justify-between text-md">
              <h2>Collect your CRONAs</h2> <span>1223.998</span>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4">
            <Button color="gradient" size="default" className="inline-flex items-center justify-center">
              {i18n._(t`Collect`)}
            </Button>
            <Button color="gray" size="default" className="inline-flex items-center justify-center">
              {i18n._(t`Claim CRONA`)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TokenSaleVesting = () => {
  const { i18n } = useLingui()

  const isOpen = useModalOpen(ApplicationModal.SELF_CLAIM)
  const toggleClaimModal = useToggleSelfClaimModal()

  const { account } = useActiveWeb3React()
  const [attempting, setAttempting] = useState<boolean>(false)
  const { claimCallback } = useProtocolClaimCallback(account)
  const unclaimedAmount: CurrencyAmount<Currency> | undefined = useUserUnclaimedProtocolAmount(account)
  const { claimSubmitted } = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = false

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        console.log(error)
      })
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

  const [totalLocked, setTotalLocked] = useState<string>()
  useEffect(() => {
    const fetchLockup = async () => {
      if (account) {
        fetch(
          'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/amounts-protocols-10959148-12171394.json'
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log('vesting:', data)
            const userLockedAmount = data[account.toLowerCase()] ? data[account.toLowerCase()] : '0'
            const userLocked = Fraction.from(BigNumber.from(userLockedAmount), BigNumber.from(10).pow(18)).toString()
            setTotalLocked(userLocked)
            // console.log('userLocked:', userLocked)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      return []
    }
    fetchLockup()
  }, [account])

  // remove once treasury signature passed
  const pendingTreasurySignature = false

  return (
    <div className="flex flex-col gap-3 md:max-w-full">
      <div className="relative w-full h-full overflow-hidden rounded bg-dark-900">
        <div className="flex flex-col gap-3 p-4">
          <div className="font-bold text-lg text-white">{i18n._(t`Claimable CRONA from Seed Sale`)}</div>
          <div className="flex flex-col items-baseline pb-4">
            <div className="font-bold text-white text-[26px]">1320.0132</div>
            {account ? (
              <div className="text-sm text-secondary">{i18n._(t`Your Claimable CRONAs`)}</div>
            ) : (
              <div className="text-sm text-secondary">{i18n._(t`Your Claimable CRONAs: Connect Wallet`)}</div>
            )}
          </div>
          <div className="flex flex-col pb-4 space-y-2">
            <div className="flex flex-row justify-between text-md">
              <h2>Your Purchased CRONAs</h2> <span>1223.998</span>
            </div>
            <div className="flex flex-row justify-between text-lg">
              <h2>Your UnClaimed CRONAs</h2> <span>1223.998</span>
            </div>
          </div>
          <Button
            color={
              !isAddress(account ?? '') ||
                claimConfirmed ||
                !unclaimedAmount ||
                Number(unclaimedAmount?.toFixed(8)) <= 0 ||
                pendingTreasurySignature
                ? 'gray'
                : 'gradient'
            }
            disabled={
              !isAddress(account ?? '') ||
              claimConfirmed ||
              !unclaimedAmount ||
              Number(unclaimedAmount?.toFixed(8)) <= 0 ||
              pendingTreasurySignature
            }
            size="default"
            onClick={onClaim}
            className="inline-flex items-center justify-center"
          >
            {pendingTreasurySignature ? (
              <Dots>{i18n._(t`Pending Claim`)}</Dots>
            ) : (
              <> {claimConfirmed ? i18n._(t`Claimed`) : i18n._(t`Claim CRONA`)}</>
            )}

            {attempting && (
              <Loader
                stroke="white"
                style={{
                  marginLeft: '10px',
                }}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

Strategies.Guard = NetworkGuard([ChainId.CRONOS])

export default Strategies
