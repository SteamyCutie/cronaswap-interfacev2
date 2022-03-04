import useFuse from '../../hooks/useFuse'
import Container from '../../components/Container'
import Head from 'next/head'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useSortableData from '../../hooks/useSortableData'
import useFarmsV2 from '../../features/farms/useFarmsV2'
import { formatNumber } from '../../functions'
import { ArrowRightIcon, PlusIcon, ClockIcon } from '@heroicons/react/outline'
import Dots from '../../components/Dots'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteScroll, usePositions } from '../../features/farms/hooks'
import SimulatorItem from 'app/features/yieldsimulator/SimulatorItem'
import Typography from '../../components/Typography'
import useMasterChef from '../../features/farms/useMasterChef'
import { Chef } from '../../features/farms/enum'
import { useTransactionAdder } from '../../state/transactions/hooks'
import QuestionHelper from 'app/components/QuestionHelper'
import Input from '../../components/Input'
import { useLockedBalance } from 'app/features/boost/hook'
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

  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)

  const tabStyle = 'rounded-lg p-3'
  const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-blue`
  const inactiveTabStyle = `${tabStyle} bg-dark-700 text-secondary`

  const { lockAmount, lockEnd, veCronaSupply } = useLockedBalance()
  const remainingTime =
    Number(lockEnd) > Date.now() / 1000 ? Math.floor((Number(lockEnd) - Date.now() / 1000) / 86400 / 7) : 0
  const totalVeCrona = Number(veCronaSupply) / 1e18

  const [inputLocked, setInputLocked] = useState<string>('')
  const [lockedAmount, setLockedAmount] = useState(Number(lockAmount) / 1e18)
  const [timeDuration, setTimeDuration] = useState(remainingTime)
  const handleInputLocked = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setInputLocked(v)
      setLockedAmount(Number(lockAmount) / 1e18 + Number(v))
    }
  }
  const [inputDuration, setInputDuration] = useState<string>('')
  const handleInputDuration = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setInputDuration(v)
      setActiveTab(0)
      setTimeDuration(remainingTime + Number(v))
    }
  }
  const [activeTab, setActiveTab] = useState(0)
  useEffect(() => {
    setTimeDuration(remainingTime + activeTab)
    activeTab > 0 && setInputDuration(activeTab.toString())
  }, [activeTab])

  const calcVeCrona = (locked: number) => {
    return locked ? (locked * timeDuration) / 208 : 0
  }

  const lockedveCrona = calcVeCrona(Number(lockedAmount))
  const [boostFactor, setBoostFactor] = useState(1)
  const handleBoost = (value) => {
    setBoostFactor(value)
  }

  return (
    <Container id="farm-page" className="grid h-full px-2 py-4 max-w-7xl md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Yield Simulator | CronaSwap</title>
        <meta key="description" name="description" content="Farm CronaSwap" />
      </Head>

      <div className="w-full col-span-4 space-y-6 lg:col-span-3">
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

        <div className="overflow-y-auto max-h-72">
          {items && items.length > 0 ? (
            <InfiniteScroll
              dataLength={numDisplayed}
              next={() => setNumDisplayed(numDisplayed + 5)}
              hasMore={true}
              loader={null}
            >
              <div className="space-y-1">
                {items.slice(0, numDisplayed).map((farm, index) => (
                  <SimulatorItem key={index} farm={farm} veCrona={lockedveCrona} handleBoost={handleBoost} />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
          )}
        </div>

        {/* CRONA Boost Lock */}
        <div className="rounded-t-lg bg-dark-900">
          <div className="flex items-center p-6 text-2xl rounded-t-lg bg-dark-800 font-Poppins">
            <div>{i18n._(t`CRONA Boost Lock`)}</div>
            <QuestionHelper text="CRONA Boost Lock" />
          </div>
          <div className="md:flex">
            <div className="p-6 md:w-1/2">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50"></div>
                    <div className="flex flex-col">
                      {i18n._(t`Your Locked`)}
                      <div className="text-white">{formatNumber(lockAmount?.toFixed(18))}</div>
                    </div>
                  </div>
                  <PlusIcon className="h-6 px-2" />
                  <div className="-translate-y-3">
                    <Input.Numeric
                      value={inputLocked}
                      onUserInput={handleInputLocked}
                      className={classNames(
                        'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis'
                      )}
                      placeholder=" "
                    />

                    {/* input overlay: */}
                    <div className="relative w-full h-0 pointer-events-none bottom-14">
                      <div className={`flex justify-between items-center h-14 rounded px-3 md:px-5`}>
                        <div className="flex space-x-2 ">
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
                      <div className="text-white">{remainingTime} WEEKS</div>
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
              <div className="grid grid-cols-2 gap-4 mt-8 text-sm lg:text-base md:grid-cols-4">
                <button
                  className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(1)
                  }}
                >
                  1 Week
                </button>

                <button
                  className={activeTab === 2 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(2)
                  }}
                >
                  2 Weeks
                </button>

                <button
                  className={activeTab === 4 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(4)
                  }}
                >
                  1 Month
                </button>

                <button
                  className={activeTab === 12 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(12)
                  }}
                >
                  3 Months
                </button>

                <button
                  className={activeTab === 25 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(25)
                  }}
                >
                  6 Months
                </button>

                <button
                  className={activeTab === 52 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(52)
                  }}
                >
                  1 Year
                </button>

                <button
                  className={activeTab === 104 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(104)
                  }}
                >
                  2 Years
                </button>

                <button
                  className={activeTab === 208 ? activeTabStyle : inactiveTabStyle}
                  onClick={() => {
                    setActiveTab(208)
                  }}
                >
                  4 Years
                </button>
              </div>
            </div>
            <ArrowRightIcon className="h-12 mx-auto rotate-90 md:mt-20 md:rotate-0" />
            <div className="flex gap-4 p-10 md:w-1/2">
              <div className="space-y-8 font-bold text-white">
                <div className="mt-2 space-y-8">
                  {lockedveCrona <= totalVeCrona ? (
                    <>
                      <div className="text-2xl font-Poppins">{i18n._(t`Your share of veCRONA`)}</div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-50"></div>
                        <div className="text-2xl">{`${((lockedveCrona * 100) / totalVeCrona).toFixed(6)} %`}</div>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 text-2xl lg:text-3xl text-red">
                      {i18n._(t`Locked veCrona exceeds veCronaSupply`)}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">{boostFactor?.toFixed(2)}x</div>
                  <div className="text-base font-medium">
                    <div>{i18n._(t`Potential max boost: 2.5x`)}</div>
                    <div>
                      {i18n._(
                        t`You have reached your potential max boost factor. You can stake more tokens while keeping this max boost factor.`
                      )}
                    </div>
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
