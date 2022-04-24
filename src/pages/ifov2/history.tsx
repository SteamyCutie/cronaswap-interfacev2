import Container from '../../components/Container'
import Head from 'next/head'
import NavLink from '../../components/NavLink'

import React, { useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ArrowRightIcon } from '@heroicons/react/outline'
import Typography from '../../components/Typography'
import { IfoPastCard } from 'app/features/ifov2/IfoPastCard'
import ifos from 'app/constants/ifo'
import { useGetPublicIfoData, useGetWalletIfoData } from 'app/features/ifov2/hooks'
import Button from 'app/components/Button'

export default function History(): JSX.Element {
  const { i18n } = useLingui()

  const inactiveIfo = ifos.filter((ifo) => !ifo.isActive)

  const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
  const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
  const inactiveTabStyle = `${tabStyle} text-secondary`

  const [activeTab, setActiveTab] = useState(1)

  return (
    <Container id="farm-page" className="grid h-full px-2 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>IFO V2 | CronaSwap</title>
        <meta key="description" name="description" content="Farm CronaSwap" />
      </Head>

      <div className="col-span-4 space-y-6 lg:col-span-3">
        {/* Hero */}
        <div className="flex-row items-center justify-between w-full p-8 space-y-2 rounded md:flex bg-dark-900">
          <div className="space-y-2 md:block">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`IFO: Initial Farm Offerings`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Buy new tokens launching on Cronos Chain.`)}
            </Typography>
            <a href="https://forms.gle/4MTpS6NquqWUVSZw8" target="_blank" rel="noreferrer">
              <div className="flex items-center gap-2 mt-2 text-sm font-bold font-Poppins">
                <div className="text-light-blue">{i18n._(t`Apply for IFO`)}</div>
                <ArrowRightIcon height={14} className="" />
              </div>
            </a>
          </div>

          {/* <div className="flex gap-3">
            <Button id="btn-create-new-pool" color="blue" variant="outlined" size="sm">
              <a href="https://forms.gle/4MTpS6NquqWUVSZw8" target="_blank" rel="noreferrer">
                {i18n._(t`Apply for IFO`)}
              </a>
            </Button>
          </div> */}

          {/* tab */}
          <div className="flex m-auto mb-2 rounded item-center md:m-0 md:w-3/12 h-14 bg-dark-800">
            <div className="w-6/12 h-full p-1">
              <NavLink href="/ifov2">
                <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                  <p>Current</p>
                </div>
              </NavLink>
            </div>
            <div className="w-6/12 h-full p-1">
              <NavLink href="/ifov2/history">
                <div className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}>
                  <p>Past</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>

        {/* ifo body */}
        <IfoPastCard inactiveIfo={inactiveIfo} />
      </div>
    </Container>
  )
}
