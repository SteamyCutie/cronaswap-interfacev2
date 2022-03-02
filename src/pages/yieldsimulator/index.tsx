import useFuse from '../../hooks/useFuse'
import Container from '../../components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'
import NavLink from '../../components/NavLink'

import React, { useState } from 'react'
import Search from '../../components/Search'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useSortableData from '../../hooks/useSortableData'
import useFarmsV2 from '../../features/farms/useFarmsV2'
import { formatNumber, formatNumberScale } from '../../functions'
import { ArrowRightIcon, ChevronDownIcon, PlusIcon, ClockIcon } from '@heroicons/react/outline'
import Dots from '../../components/Dots'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteScroll, usePositions } from '../../features/farms/hooks'
import SimulatorItem from 'app/features/yieldsimulator/SimulatorItem'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import useMasterChef from '../../features/farms/useMasterChef'
import { Chef } from '../../features/farms/enum'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { ExternalLink } from 'react-feather'
import QuestionHelper from 'app/components/QuestionHelper'
import Input from '../../components/Input'
import { classNames } from '../../functions'

const INPUT_CHAR_LIMIT = 18

export default function YieldSimulator(): JSX.Element {
  const { i18n } = useLingui()
  const [pendingTx, setPendingTx] = useState(false)
  const addTransaction = useTransactionAdder()

  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

  const positions = usePositions()
  const query = useFarmsV2()
  const { harvestAll } = useMasterChef(Chef.MASTERCHEF_V2)

  let tokenPrice = 0
  let totalTvlInUSD = 0

  query?.farms.map((farm: any) => {
    tokenPrice = farm.tokenPrice
    totalTvlInUSD = farm.totalTvlInUSD
  })

  const FILTER = {
    all: (farm) => farm.multiplier !== 0,
    inactive: (farm) => farm.multiplier == 0,
  }

  const datas = query?.farms.filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
  })

  // Search Setup
  const options = { keys: ['symbol', 'name', 'lpToken'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: datas && datas.length > 0 ? datas : [],
    options,
  })

  const allStaked = positions.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.pendingCrona / 1e18
  }, 0)

  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)
  // const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)
  const numDisplayed = 3

  const tabStyle = 'rounded-lg p-3'
  const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-blue`
  const inactiveTabStyle = `${tabStyle} bg-dark-700 text-secondary`

  const [inputLocked, setInputLocked] = useState<string>('')
  const handleInputLocked = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setInputLocked(v)
    }
  }
  const [inputDuration, setInputDuration] = useState<string>('')
  const handleInputDuration = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setInputDuration(v)
    }
  }
  const [activeTab, setActiveTab] = useState(90)

  return (
    <Container id="farm-page" className="grid h-full px-2 py-4 max-w-7xl md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Yield Simulator | CronaSwap</title>
        <meta key="description" name="description" content="Farm CronaSwap" />
      </Head>

      <div className="col-span-4 space-y-6 lg:col-span-3">
        {/* Hero */}
        <div className="items-center justify-between w-full px-12 py-6 space-y-2 rounded bg-purple bg-opacity-20">
          <Typography variant="h2" className="mb-2 text-high-emphesis" weight={700}>
            {i18n._(t`Yield Simulator`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(
              t`Changes made in the simulator do not take effect. The simulator helps you understand how your return on investment changes when you adjust your staked and locked amount. Read more about boosting `
            )}
            <a href="https://forms.gle/4MTpS6NquqWUVSZw8" target="_blank" rel="noreferrer">
              <div className="text-sm text-yellow font-Poppins">{i18n._(t`Here`)}</div>
            </a>
          </Typography>
        </div>

        {items && items.length > 0 ? (
          // <InfiniteScroll dataLength={3} next={() => setNumDisplayed(numDisplayed + 5)} hasMore={true} loader={null}>
          <div className="space-y-2">
            {items.slice(0, numDisplayed).map((farm, index) => (
              <SimulatorItem key={index} farm={farm} />
            ))}
          </div>
        ) : (
          // </InfiniteScroll>
          <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
        )}

        {/* CRONA Boost Lock */}
        <div className="rounded-t-lg bg-dark-900">
          <div className="flex items-center p-6 text-2xl rounded-t-lg bg-dark-800 font-Poppins">
            <div>{i18n._(t`CRONA Boost Lock`)}</div>
            <QuestionHelper text="CRONA Boost Lock" />
          </div>
          <div className="flex">
            <div className="w-1/2 p-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50"></div>
                    <div className="flex flex-col">
                      {i18n._(t`Your Locked`)}
                      <div className="text-white">1000.00</div>
                    </div>
                  </div>
                  <PlusIcon className="h-6 px-2" />
                  <div className="-translate-y-3">
                    <Input.Numeric
                      value={inputLocked}
                      onUserInput={handleInputLocked}
                      className={classNames(
                        'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis'
                        // inputError ? ' pl-9 md:pl-12' : ''
                      )}
                      placeholder=" "
                    />

                    {/* input overlay: */}
                    <div className="relative w-full h-0 pointer-events-none bottom-14">
                      <div className={`flex justify-between items-center h-14 rounded px-3 md:px-5`}>
                        <div className="flex space-x-2 ">
                          {/* {inputError && (
                        <Image
                          className="mr-2 max-w-4 md:max-w-5"
                          src="/error-triangle.svg"
                          alt="error"
                          width="20px"
                          height="20px"
                        />
                      )} */}
                          <p
                            className={`text-sm md:text-lg font-bold whitespace-nowrap ${
                              inputLocked ? 'text-high-emphesis' : 'text-secondary'
                            }`}
                          >
                            {`${inputLocked ? inputLocked : '0'} CRONA`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50"></div>
                    <div className="flex flex-col">
                      {i18n._(t`Time Duration`)}
                      <div className="text-white">1000.00</div>
                    </div>
                  </div>
                  <PlusIcon className="h-6 px-2" />
                  <div className="-translate-y-3">
                    <Input.Numeric
                      value={inputDuration}
                      onUserInput={handleInputDuration}
                      className={classNames(
                        'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis'
                        // inputError ? ' pl-9 md:pl-12' : ''
                      )}
                      placeholder=" "
                    />

                    {/* input overlay: */}
                    <div className="relative w-full h-0 pointer-events-none bottom-14">
                      <div className={`flex justify-between items-center h-14 rounded px-3 md:px-5`}>
                        <div className="flex space-x-2 ">
                          {/* {inputError && (
                        <Image
                          className="mr-2 max-w-4 md:max-w-5"
                          src="/error-triangle.svg"
                          alt="error"
                          width="20px"
                          height="20px"
                        />
                      )} */}
                          <p
                            className={`text-sm md:text-lg font-bold whitespace-nowrap ${
                              inputDuration ? 'text-high-emphesis' : 'text-secondary'
                            }`}
                          >
                            {`${inputDuration ? inputDuration : '0'} WEEKS`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
                <button
                  className={activeTab === 7 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(7)
                  }}
                >
                  1 Week
                </button>

                <button
                  className={activeTab === 14 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(14)
                  }}
                >
                  2 Weeks
                </button>

                <button
                  className={activeTab === 30 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(30)
                  }}
                >
                  1 Month
                </button>

                <button
                  className={activeTab === 90 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(90)
                  }}
                >
                  3 Months
                </button>

                <button
                  className={activeTab === 180 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(180)
                  }}
                >
                  6 Months
                </button>

                <button
                  className={activeTab === 365 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(365)
                  }}
                >
                  1 Year
                </button>

                <button
                  className={activeTab === 730 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(730)
                  }}
                >
                  2 Years
                </button>

                {/* <button
                    className={activeTab === 1095 ? activeTabStyle : inactiveTabStyle}
                    onClick={() => {
                      setActiveTab(1095)
                    }}
                  >
                    3 Years
                  </button> */}

                <button
                  className={activeTab === 1460 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(1460)
                  }}
                >
                  4 Years
                </button>
              </div>
            </div>
            <div className="flex w-1/2 gap-4 p-10">
              <ArrowRightIcon className="h-16 mt-10" />
              <div className="space-y-8 font-bold text-white">
                <div className="mt-2 space-y-8">
                  <div className="text-2xl font-Poppins">{i18n._(t`Your share of veCRONA`)}</div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50"></div>
                    <div className="text-2xl">0.000058%</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">3.00x</div>
                  <div className="text-base font-medium">
                    {i18n._(t`Potential max boost: 3.00x
                      You have reached your potential max boost factor. You can stake more tokens while keeping this max boost factor.`)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
