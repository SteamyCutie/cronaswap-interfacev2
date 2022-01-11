import { Chef, PairType } from '../../features/onsen/enum'
import { useActiveWeb3React } from '../../services/web3'
import useFuse from '../../hooks/useFuse'
import Container from '../../components/Container'
import Head from 'next/head'
import React, { Fragment } from 'react'
import Search from '../../components/Search'
import { classNames } from '../../functions'
import useFarmRewards from '../../hooks/useFarmRewards'
import { usePositions } from '../../features/onsen/hooks'
import { useRouter } from 'next/router'
import Provider from '../../features/kashi/context'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import DoubleLogo from '../../components/DoubleLogo'
import Button from '../../components/Button'

export default function Yield(): JSX.Element {
  const { chainId } = useActiveWeb3React()

  const router = useRouter()
  const type = router.query.filter === null ? 'all' : (router.query.filter as string)

  const positions = usePositions(chainId)

  const FILTER = {
    all: (farm) => farm.allocPoint !== '0',
    portfolio: (farm) => farm?.amount && !farm.amount.isZero(),
    sushi: (farm) => farm.pair.type === PairType.SWAP && farm.allocPoint !== '0',
    kashi: (farm) => farm.pair.type === PairType.KASHI && farm.allocPoint !== '0',
    '2x': (farm) =>
      (farm.chef === Chef.MASTERCHEF_V2 || farm.chef === Chef.MINICHEF) &&
      farm.rewards.length > 1 &&
      farm.allocPoint !== '0',
  }

  const rewards = useFarmRewards()

  const data = rewards.filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
  })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
  const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
  const inactiveTabStyle = `${tabStyle} text-secondary`

  return (
    <Container id="farm-page" className="grid h-full py-4 px-2 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Farm | CronaSwap</title>
        <meta key="description" name="description" content="Farm CronaSwap" />
      </Head>
      {/* <div className={classNames('sticky top-0 hidden lg:block md:col-span-1')} style={{ maxHeight: '40rem' }}>
        <Menu positionsLength={positions.length} />
      </div> */}

      <div className="space-y-6 col-span-4 lg:col-span-3">
        {/* search bar */}
        <div className="flex flex-row justify-between gap-10">
          {/* select tab */}
          <div className="flex w-full rounded h-14 bg-dark-800">
            <div className="h-full w-6/12 p-0.5">
              <div className={0 === 0 ? activeTabStyle : inactiveTabStyle}>
                <p>Live</p>
              </div>
            </div>
            <div className="h-full w-6/12 p-0.5">
              <div className={1 != 1 ? activeTabStyle : inactiveTabStyle}>
                <p>Finished</p>
              </div>
            </div>
            <div className="h-full w-6/12 p-0.5">
              <div className={2 != 2 ? activeTabStyle : inactiveTabStyle}>
                <p>My Farms</p>
              </div>
            </div>
          </div>

          {/* filter menu */}

          <Search
            search={search}
            term={term}
            inputProps={{
              className:
                'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
            }}
          />
        </div>

        {/* <FarmList farms={result} term={term} /> */}

        {/* FarmListItem */}
        <div className="space-y-4">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={classNames(
                    open && 'rounded-b-none',
                    'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
                  )}
                >
                  <div className="grid grid-cols-6">
                    {/* Token logo */}
                    <div className="flex col-span-2 space-x-4 md:col-span-1">
                      {/* <DoubleLogo currency0={token0} currency1={token1} size={40} /> */}
                      <div className="flex flex-col justify-center">
                        <div className="text-xs md:text-base text-blue">FARMING</div>
                        <div className="font-bold text-xs md:text-base">CRONA-CRO</div>
                      </div>
                    </div>

                    {/* Earned */}
                    <div className="flex flex-col justify-center">
                      <div className="text-xs md:text-base text-secondary">Earned</div>
                      <div className="font-bold text-xs md:text-base">422.88</div>
                    </div>

                    {/* Liquidity */}
                    <div className="hidden lg:block flex-col justify-center ">
                      <div className="text-xs md:text-base text-secondary">Liquidity</div>
                      <div className="font-bold text-xs md:text-base">$177,778,88.00</div>
                    </div>

                    {/* Multiplier */}
                    <div className="hidden lg:block flex-col justify-center">
                      <div className="text-xs md:text-base text-secondary">Multiplier</div>
                      <div className="font-bold text-xs md:text-base">40x</div>
                    </div>

                    {/* APR */}
                    <div className="flex flex-col justify-center">
                      <div className="text-xs md:text-base text-secondary">APR</div>
                      <div className="font-bold text-xs md:text-base">26.78% / 278.68%</div>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`} />
                    </div>
                  </div>
                </Disclosure.Button>

                {/* Farm Detail */}
                <Transition
                  show={open}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Disclosure.Panel className="flex w-full p-4 border-t-0 rounded rounded-t-none bg-dark-800">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
                      {/* deposit */}
                      <div className="flex flex-col justify-center space-y-4 ">
                        <div className="text-xs md:text-base text-secondary">Stake LP Tokens</div>
                        <div className="bg-dark-900 w-200 h-12">4228</div>
                        <div className="flex flex-row justify-between gap-4">
                          <Button color="blue">Approve</Button>
                          <Button color="gray">Stake</Button>
                        </div>
                      </div>

                      {/* withdraw */}
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-xs md:text-base text-secondary">Unstake LP Tokens</div>
                        <div className="bg-dark-900 w-200 h-12">4228</div>
                        <Button color="gray">Unstake</Button>
                      </div>

                      {/* CRONA EARNED */}
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-xs md:text-base text-secondary">CRONA EARNED</div>
                        <div className="bg-dark-900 w-200 h-12">4228</div>
                        <div className="bg-dark-900 w-200 h-12">4228</div>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </Container>
  )
}

Yield.Provider = Provider
