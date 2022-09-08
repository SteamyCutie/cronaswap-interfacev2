import React, { useState, useRef } from 'react'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useCronaVaultContract } from 'hooks/useContract'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { formatNumber, getBalanceAmount } from 'functions/formatBalance'
import BatchList from 'app/features/cronanode/BatchList'
import QuestionHelper from 'app/components/QuestionHelper'

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'

export default function CronaNode() {
  const { i18n } = useLingui()
  const addTransaction = useTransactionAdder()

  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
      <Head>
        <title key="title">CronaNode | CronaSwap</title>
        <meta key="description" name="description" content="CronaNode CronaSwap" />
      </Head>
      <div className="w-11/12 m-auto">
        <div className="w-full mt-6 md:flex">
          {/* <div>Incentive pool</div> */}
          <BatchList />
        </div>
      </div>
    </Container>
  )
}
