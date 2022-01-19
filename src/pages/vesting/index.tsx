import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NetworkGuard from '../../guards/Network'
import { ChainId } from '@cronaswap/core-sdk'

import { PublicSaleVesting } from './components/pubSale'
import { SeedSaleVesting } from './components/seedSale'
import { PrivateSaleAVesting } from './components/privateSaleA'
import { PrivateSaleBVesting } from './components/privateSaleB'

// import Link from 'next/link'
// import { useClaimCallback, useUserUnclaimedAmount } from '../../state/claim/weekly/hooks'
// import { BigNumber } from '@ethersproject/bignumber'
// import ExternalLink from '../../components/ExternalLink'
// import Fraction from '../../entities/Fraction'
// import QuestionHelper from '../../components/QuestionHelper'
// import { formatNumber } from '../../functions/format'
// import { isAddress } from '@ethersproject/address'

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
            <div className="text-lg font-bold text-white">{i18n._(t`Claim CRONA For Airdrop Activity`)}</div>
            <div className="pt-2 text-sm font-bold text-gray-400">
              <ul className="px-6 list-disc ">
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
            <div className="text-lg font-bold text-white">
              {i18n._(t`Claim CRONA For Seed / Private / Public Sale`)}
            </div>
            <div className="pt-2 text-sm font-bold text-gray-400">
              <ul className="px-6 text-white list-disc">
                <li>
                  1% - unlocked at 1st day, 3% - unlocked at 5th day, 6% - unlocked at 10th day, after vesting start.
                </li>
                <li>90% of tokens will be linearly unlocked within 1 year and can be claimed after unlocking.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PublicSaleVesting />
          <SeedSaleVesting />
          <PrivateSaleAVesting />
          <PrivateSaleBVesting />
        </div>
      </Container>
    </>
  )
}

Strategies.Guard = NetworkGuard([ChainId.CRONOS])

export default Strategies
