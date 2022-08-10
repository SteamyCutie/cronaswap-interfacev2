import React, { useState, useRef } from 'react'
import Container from '../../components/Container'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChevronRightIcon, ExclamationIcon } from '@heroicons/react/solid'
import Typography from '../../components/Typography'
import Alert from 'app/components/Alert'
import Image from 'app/components/Image'

import GronaControl from 'app/features/grona/GronaControl'
import GronaUtility from 'app/features/grona/GronaUtility'
import GronaFlow from 'app/features/grona/GronaFlow'

export default function Grona() {
  const { i18n } = useLingui();

  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
      <Head>
        <title key="title">GRONA | CronaSwap</title>
        <meta key="description" name="description" content="Golden CRONA" />
      </Head>

      <div className="col-span-4 space-y-6 lg:col-span-3">
        {/* Hero */}
        <div
          className="flex-row items-center justify-between w-full p-8 space-y-2 bg-no-repeat md:p-16 rounded-2xl md:flex bg-dark-900/80"
          style={{ backgroundImage: "url('/images/grona/grona.png')", backgroundPosition: '95%' }}
        >
          <div className="gap-8 md:block">
            <Typography className="text-[24px] text-high-emphasis md:text-[40px]" weight={700}>
              {i18n._(t`Golden CRONA`)}
            </Typography>
            <a href="" target="_blank" rel="noreferrer">
              <div className="flex items-center gap-2 mt-2 text-lg font-medium text-blue md:mt-4">
                <div className="">{i18n._(t`Learn more`)}</div>
                <ChevronRightIcon height={14} className="" />
              </div>
            </a>
          </div>
        </div>
        {/* <div className="flex items-center justify-between gap-2 p-2 px-4 md:p-4 md:px-6 md:gap-6 bg-yellow/30 rounded-2xl">
          <ExclamationIcon className="w-1/3 md:w-auto" height={64} />
          <div className="flex-row">
            <div className="text-base font-extrabold text-center uppercase md:text-xl">Warning</div>
            <div className="text-sm text-center md:text-sm">
              Converting GRONA involves paying a 28% burn fee and a 2% reflect fee for a total cost of 30%. This means
              that for every 1 CRONA you trade in, you will receive 0.7 GRONA
            </div>
          </div>
          <ExclamationIcon className="w-1/3 md:w-auto" height={64} />
        </div> */}

        <div className='bg-dark-900/80 p-4 md:p-6 rounded-2xl'>
          <Alert
            title={i18n._(t`Golden CRONA mechanism`)}
            message={i18n._(t`Converting GRONA involves paying a 28% burn fee and a 2% reflect fee for a total cost of 30%. This means that for every 1 CRONA you trade in, you will receive 0.7 GRONA.`)}
            type="warning"
            dismissable={false}
            className="!rounded-xl"
          />
          <GronaControl />
        </div>
        {/* <GronaUtility /> */}
        <div className='bg-dark-900/80 p-4 md:p-6 rounded-2xl'>
          <GronaFlow />
        </div>
      </div>
    </Container>
  )
}
