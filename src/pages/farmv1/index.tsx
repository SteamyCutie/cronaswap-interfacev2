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
import useFarms from '../../features/farms/useFarms'
import { formatNumberScale } from '../../functions'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import QuestionHelper from '../../components/QuestionHelper'
import Dots from '../../components/Dots'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteScroll } from '../../features/farms/hooks'
import FarmListItem from '../../features/farms/FarmListItem'
import Typography from '../../components/Typography'
import Button from '../../components/Button'

export default function Yield(): JSX.Element {
  const { i18n } = useLingui()

  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

  const query = useFarms()
  const farms = query?.farms

  let tokenPrice = 0
  let totalTvlInUSD = 0

  query?.farms.map((farm: any) => {
    tokenPrice = farm?.tokenPrice
    totalTvlInUSD = farm?.totalTvlInUSD
  })

  const FILTER = {
    all: (farm) => farm.multiplier < 10000,
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

  const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
  const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
  const inactiveTabStyle = `${tabStyle} text-secondary`

  const [activeTab, setActiveTab] = useState(0)
  const [sortOption, setSortOption] = useState('Hot')

  return (
    <Container id="farm-page" className="grid h-full px-2 py-4 max-w-6xl md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Farms V1 | CronaSwap</title>
        <meta key="description" name="description" content="Farm CronaSwap" />
      </Head>

      <div className="col-span-4 space-y-6 lg:col-span-3">
        {/* Hero */}
        <div className="flex-row items-center justify-between w-full px-8 py-6 space-y-2 rounded md:flex bg-opaque-blue">
          <div className="space-y-2 md:block">
            <Typography variant="h2" className="text-high-emphesis" weight={700}>
              {i18n._(t`Farming V1`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Stake liquidity pool tokens to earn rewards in CronaSwap.`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Farms V1 - TVL:`)} {formatNumberScale(totalTvlInUSD, true)}
            </Typography>
            <Typography variant="base" weight={700}>
              {i18n._(t`Q1: How to migrate from Farmv1 to Farmv2?`)}
            </Typography>
            <Typography color="text-blue" variant="base" weight={700}>
              {i18n._(t`A1: Unstake from FarmV1. Then stake into FarmV2 (Before stake need to Approve).`)}
            </Typography>
            <Typography variant="base" weight={700}>
              {i18n._(t`Q2: When will the FarmV1 reward emissions end?`)}
            </Typography>
            <Typography color="text-pink" variant="base" weight={700}>
              {i18n._(t`A2: Farm V1 reward emission has been end at 2pm UTC on Feb 19.`)}
            </Typography>
          </div>

          <div className="flex gap-3">
            <Button id="btn-create-new-pool" color="gradient" variant="outlined" size="sm">
              <a href="https://forms.gle/4MTpS6NquqWUVSZw8" target="_blank" rel="noreferrer">
                {i18n._(t`Apply for Farm Listing`)}
              </a>
            </Button>
          </div>
        </div>

        {/* search bar */}
        <div className="flex-row justify-between md:flex">
          {/* select tab */}
          <div className="flex m-auto mb-2 rounded md:m-0 md:w-3/12 h-14 bg-dark-800">
            <div className="w-6/12 h-full p-1" onClick={() => setActiveTab(0)}>
              <NavLink href="/farmv1?filter=all">
                <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                  <p>All Farms</p>
                </div>
              </NavLink>
            </div>
            <div className="w-6/12 h-full p-1" onClick={() => setActiveTab(1)}>
              <NavLink href="/farmv1?filter=inactive">
                <div className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}>
                  <p>Inactive Farms</p>
                </div>
              </NavLink>
            </div>
            {/* <div className="w-6/12 h-full p-1">
              <div className={2 != 2 ? activeTabStyle : inactiveTabStyle}>
                <p>My Farms</p>
              </div>
            </div> */}
          </div>

          <div className="flex gap-2 md:w-5/12">
            {/* sort select menu*/}
            <div className="w-1/3 h-14">
              <div className="relative inline-block w-full h-full group">
                <button className="inline-flex items-center justify-between w-full h-full px-4 py-2 font-semibold rounded bg-dark-800">
                  <span className="mr-1">{sortOption}</span>
                  <ChevronDownIcon width={12} height={12} />
                </button>
                <ul className="hidden pt-1 group-hover:block">
                  <li
                    className={sortOption === 'Hot' ? 'hidden' : 'w-full'}
                    onClick={() => {
                      requestSort('hot', 'desc')
                      setSortOption('Hot')
                    }}
                  >
                    <a className="block px-4 py-2 whitespace-no-wrap bg-dark-800 hover:bg-gray-900" href="#">
                      Hot
                    </a>
                    {sortConfig && sortConfig.key === 'hot'}
                  </li>
                  <li
                    className={sortOption === 'APR' ? 'hidden' : 'w-full'}
                    onClick={() => {
                      requestSort('apr', 'desc')
                      setSortOption('APR')
                    }}
                  >
                    <a className="block px-4 py-2 whitespace-no-wrap bg-dark-800 hover:bg-gray-900" href="#">
                      APR
                    </a>
                    {sortConfig && sortConfig.key === 'apr'}
                  </li>
                  <li
                    className={sortOption === 'Multiplier' ? 'hidden' : 'w-full'}
                    onClick={() => {
                      requestSort('multiplier', 'desc')
                      setSortOption('Multiplier')
                    }}
                  >
                    <a className="block px-4 py-2 whitespace-no-wrap bg-dark-800 hover:bg-gray-900" href="#">
                      Multiplier
                    </a>
                    {sortConfig && sortConfig.key === 'multiplier'}
                  </li>
                  <li
                    className={sortOption === 'Liquidity' ? 'hidden' : 'w-full'}
                    onClick={() => {
                      requestSort('tvl', 'desc')
                      setSortOption('Liquidity')
                    }}
                  >
                    <a className="block px-4 py-2 whitespace-no-wrap bg-dark-800 hover:bg-gray-900" href="#">
                      Liquidity
                    </a>
                    {sortConfig && sortConfig.key === 'liquidity'}
                  </li>
                </ul>
              </div>
            </div>

            {/* filter menu */}
            <Search
              search={search}
              term={term}
              inputProps={{
                className:
                  'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-red-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
              }}
            />
          </div>
        </div>
        {items && items.length > 0 ? (
          <InfiniteScroll
            dataLength={numDisplayed}
            next={() => setNumDisplayed(numDisplayed + 5)}
            hasMore={true}
            loader={null}
          >
            <div className="space-y-2">
              {items.slice(0, numDisplayed).map((farm, index) => (
                <FarmListItem key={index} farm={farm} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
        )}
      </div>
    </Container>
  )
}
