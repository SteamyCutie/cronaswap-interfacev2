import useFuse from '../../hooks/useFuse'
import Container from '../../components/Container'
import Head from 'next/head'
import React from 'react'
import Search from '../../components/Search'
import { classNames } from '../../functions'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, ExternalLinkIcon, LockClosedIcon, CalculatorIcon } from '@heroicons/react/solid'

import Button from '../../components/Button'

export default function Yield(): JSX.Element {
  const data = null

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

  // values for static FarmList
  const balances = 58.007773274
  const staked = 58.007773274
  const cronaEarned = 634537.99824

  return (
    <Container id="farm-page" className="grid h-full px-2 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Farm | CronaSwap</title>
        <meta key="description" name="description" content="Farm CronaSwap" />
      </Head>
      {/* <div className={classNames('sticky top-0 hidden lg:block md:col-span-1')} style={{ maxHeight: '40rem' }}>
        <Menu positionsLength={positions.length} />
      </div> */}

      <div className="col-span-4 space-y-6 lg:col-span-3">
        {/* search bar */}
        <div className="md:flex flex-row justify-between">
          {/* select tab */}
          <div className="m-auto mb-2 flex md:m-0 md:w-4/12 rounded h-14 bg-dark-800">
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

          <div className="flex md:w-5/12 gap-10">
            {/* sort select menu*/}
            <div className="w-1/3 h-14">
              <div className="relative inline-block w-full h-full group">
                <button className="inline-flex items-center justify-between w-full h-full px-4 py-2 font-semibold text-gray-700 bg-gray-300 rounded">
                  <span className="mr-1">Hot</span>
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </button>
                <ul className="hidden pt-1 text-gray-700 group-hover:block">
                  <li className="">
                    <a className="block px-4 py-2 whitespace-no-wrap bg-gray-200 hover:bg-gray-400" href="#">
                      APR
                    </a>
                  </li>
                  <li className="">
                    <a className="block px-4 py-2 whitespace-no-wrap bg-gray-200 hover:bg-gray-400" href="#">
                      Multiplier
                    </a>
                  </li>
                  <li className="">
                    <a className="block px-4 py-2 whitespace-no-wrap bg-gray-200 hover:bg-gray-400" href="#">
                      Earned
                    </a>
                  </li>
                  <li className="">
                    <a className="block px-4 py-2 whitespace-no-wrap bg-gray-200 hover:bg-gray-400" href="#">
                      Liquidity
                    </a>
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
                  'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-pink-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
              }}
            />
          </div>
        </div>

        {/* <FarmList farms={result} term={term} /> */}

        {/* FarmListItem */}
        <div>
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
                        <div className="text-xs font-bold md:text-base">CRONA-CRO</div>
                      </div>
                    </div>

                    {/* Earned */}
                    <div className="flex flex-col justify-center">
                      <div className="text-xs md:text-base text-secondary">Earned</div>
                      <div className="text-xs font-bold md:text-base">422.88</div>
                    </div>

                    {/* Liquidity */}
                    <div className="flex-col justify-center hidden lg:block ">
                      <div className="text-xs md:text-base text-secondary">Liquidity</div>
                      <div className="text-xs font-bold md:text-base">$177,778,88.00</div>
                    </div>

                    {/* Multiplier */}
                    <div className="flex-col justify-center hidden lg:block">
                      <div className="text-xs md:text-base text-secondary">Multiplier</div>
                      <div className="text-xs font-bold md:text-base">40x</div>
                    </div>

                    {/* APR */}
                    <div className="flex flex-col justify-center">
                      <div className="text-xs md:text-base text-secondary">APR</div>
                      <div className="md:flex">
                        <div className="text-xs font-bold md:text-base">26.78% / </div>
                        <div className="flex items-center">
                          <LockClosedIcon className="h-4" />
                          <div className="text-xs font-bold md:text-base">278.68%</div>
                          <CalculatorIcon className="h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
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
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      {/* Stake */}
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-xs md:text-base text-secondary">Stake LP Tokens</div>
                        <div className="flex justify-between gap-4 text-sm rounded-lg bg-dark-900">
                          <div className="flex flex-col w-1/2 px-3 py-3 align-middle gap-y-4">
                            <div>Stake</div>
                            <div className="w-screen text-base">12.8878</div>
                          </div>
                          <div className="flex flex-col w-1/2 px-2 py-3 text-sm align-middle gap-y-4">
                            <div>Balances: {staked}</div>
                            <div className="flex items-center gap-1">
                              <Button size="xs" className="border-2 border-gray">
                                Max
                              </Button>
                              <div>CRONA-CRO LP</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between gap-4">
                          <Button color="blue" className="w-1/2 text-lg">
                            Approve
                          </Button>
                          <Button color="gray" className="w-1/2 text-lg">
                            Stake
                          </Button>
                        </div>
                      </div>

                      {/* Unstake */}
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-xs md:text-base text-secondary">Unstake LP Tokens</div>
                        <div className="flex justify-between gap-4 text-sm rounded-lg bg-dark-900">
                          <div className="flex flex-col w-1/2 px-3 py-3 align-middle gap-y-4">
                            <div>Unstake</div>
                            <div className="text-base">12.8878</div>
                          </div>
                          <div className="flex flex-col w-1/2 px-2 py-3 text-sm align-middle gap-y-4">
                            <div>Staked: {balances}</div>
                            <div className="flex items-center gap-1">
                              <Button size="xs" className="border-2 border-gray">
                                Max
                              </Button>
                              <div>CRONA-CRO LP</div>
                            </div>
                          </div>
                        </div>
                        <Button color="blue" className="w-full text-lg">
                          Unstake
                        </Button>
                      </div>

                      {/* CRONA EARNED */}
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="text-xs md:text-base text-secondary">CRONA Earned</div>
                        <div className="flex flex-col justify-between gap-4 text-sm rounded-lg bg-dark-900">
                          <div className="flex mt-4">
                            <div className="flex flex-col w-2/3 px-3 align-middle gap-y-2">
                              <div className="text-lg">{cronaEarned}</div>
                              <div className="text-sm">~154.76 USD</div>
                              <div className="text-sm">Locked CRONA boost earning</div>
                            </div>
                            <div className="flex flex-col w-1/3 px-2 align-middle gap-y-1">
                              <Button color="gray" size="xs" className="text-lg border-2 h-1/2 border-gray">
                                Harvest
                              </Button>
                              <Button color="gray" size="xs" className="text-lg border-2 h-1/2 border-gray">
                                Boost
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between px-5 pt-1 pb-3 text-base">
                            <div className="flex items-center gap-1">
                              <a
                                href="https://cronos.crypto.org/explorer/address/0xadbd1231fb360047525BEdF962581F3eee7b49fe/contracts"
                                rel="noreferrer"
                                target="_blank"
                              >
                                View Contract
                              </a>
                              <ExternalLinkIcon className="h-5" />
                            </div>
                            <div className="flex items-center gap-1">
                              <a href="" target="_blank">
                                Get CRONA-CRO LP
                              </a>
                              <ExternalLinkIcon className="h-5" />
                            </div>
                          </div>
                        </div>
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
