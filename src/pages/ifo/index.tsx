import useFuse from '../../hooks/useFuse'
import Container from '../../components/Container'
import Head from 'next/head'
import Image from 'next/image'

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
import NumericalInput from 'app/components/NumericalInput'
import { DiscordIcon, MediumIcon, TwitterIcon } from 'app/components/Icon'
import { Disclosure } from '@headlessui/react'

export default function Ifo(): JSX.Element {
  const { i18n } = useLingui()

  const [depositValue, setDepositValue] = useState('')

  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

  const query = useFarms()
  const farms = query?.farms

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

  const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
  const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
  const inactiveTabStyle = `${tabStyle} text-secondary`

  const [activeTab, setActiveTab] = useState(0)
  const [sortOption, setSortOption] = useState('Hot')

  const faqs = [
    {
      question: 'What’s the difference between a Basic Sale and Unlimited Sale?',
      answer:
        'In the Basic Sale, every user can commit a maximum of about 200 USD worth of CRONA-CRO LP Tokens. We calculate the maximum LP amount about 30 minutes before each IFO. The Basic Sale has no participation fee. In the Unlimited Sale, there’s no limit to the amount of CRONA-CRO LP Tokens you can commit. However, there’s a fee for participation: see below.',
    },
    {
      question: 'Which sale should I commit to? Can I do both?',
      answer:
        'You can choose one or both at the same time! If you’re only committing a small amount, we recommend the Basic Sale first.',
    },
    {
      question: 'How much is the participation fee?',
      answer:
        'There’s only a participation fee for the Unlimited Sale. There’s no fee for the Basic Sale. The fee will start at 1%. The 1% participation fee decreases in cliffs, based on the percentage of overflow from the “Unlimited” portion of the sale.',
    },

    {
      question: 'What is Overflow Sale Model?',
      answer:
        'Both sales (Basic Sale and Unlimited Sale) will be conducted using the Overflow Sale Model. For Basic Sale, in order to ensure Basic Sale participants have meaningful IFO allocation in the event of oversubscription, we will implement the Max Overflow mechanism. The Basic Sale pool will stop accepting further deposit commitment once the overflow reaches 5x / 500% of the amount to raise. Please note that the final allocation you receive will still be subject to the total amount raised in this sale method. However, you will not be battling any whales.For Unlimited Sale, users are able to allocate as much or as little as they want to the IFO, their final allocation will be based on the amount of funds they put in as a percentage of all funds provided by other users at the time the IFO sale ends. Users will then receive back any leftover funds when claiming their tokens after the sale.In essence, the more a user commits, the more allocation they may receive based on their percent commitment over the total committed amount. Any unspent amount is returned to users.',
    },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

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
          </div>

          <div className="flex gap-3">
            <Button id="btn-create-new-pool" color="blue" variant="outlined" size="sm">
              <a href="https://forms.gle/Y9mpAJGVisxU3JyG8" target="_blank" rel="noreferrer">
                {i18n._(t`Apply for IFO`)}
              </a>
            </Button>
          </div>
        </div>

        {/* ifo body */}
        <div className="flex flex-row justify-between gap-4">
          <div className="w-full rounded bg-dark-900">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Base sale */}
              <div className="space-y-6 rounded-lg md:mt-4 md:mb-4 md:ml-4 bg-dark-800">
                <div className="flex flex-row justify-between p-6 rounded-t item-center bg-dark-600">
                  <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
                    Base Sale
                    <QuestionHelper text="Every person can only commit a limited amount, but may expect a higher return per token committed." />
                  </div>
                  <div className="bg-gray-700 text-pink h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
                    Finished
                  </div>
                </div>
                <div className="flex gap-3 px-4">
                  <div className="relative min-w-[48px] h-[48px] shadow-md rounded-full bg-pink"></div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
                      750000 CROSS
                    </div>
                    <div className="text-sm font-bold leading-5 text-secondary">30% of total sale</div>
                  </div>
                </div>

                {/* input */}
                <div className="col-span-2 px-4 text-center md:col-span-1">
                  <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                    {i18n._(t`Wallet Balance`)}: 182.99
                  </div>

                  <div className="relative flex items-center w-full mb-4">
                    <NumericalInput
                      className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                      value={depositValue}
                      onUserInput={setDepositValue}
                    />
                    <Button
                      variant="outlined"
                      color="blue"
                      size="xs"
                      className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                    >
                      {i18n._(t`MAX`)}
                    </Button>
                  </div>
                  <Button className="w-full" color="blue">
                    {i18n._(t`Commit`)}
                  </Button>
                </div>

                {/* info */}
                <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Your committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">$91.09</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Total committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">~$261,951 (173.32%)</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Funds to raise:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">$150,000</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Price per CROSS:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">$0.2</div>
                  </div>
                </div>
              </div>

              {/* Unlimited Sale */}
              <div className="space-y-6 rounded-lg md:mt-4 md:mb-4 bg-dark-800">
                <div className="flex flex-row justify-between p-6 rounded-t item-center bg-dark-600">
                  <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
                    Unlimited Sale
                    <QuestionHelper text="Every person can only commit a limited amount, but may expect a higher return per token committed." />
                  </div>
                  <div className="bg-gray-700 text-pink h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
                    Finished
                  </div>
                </div>
                <div className="flex gap-3 px-4">
                  <div className="relative min-w-[48px] h-[48px] shadow-md rounded-full bg-pink"></div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
                      750000 CROSS
                    </div>
                    <div className="text-sm font-bold leading-5 text-secondary">30% of total sale</div>
                  </div>
                </div>

                {/* input */}
                <div className="col-span-2 px-4 text-center md:col-span-1">
                  <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                    {i18n._(t`Wallet Balance`)}: 182.99
                  </div>

                  <div className="relative flex items-center w-full mb-4">
                    <NumericalInput
                      className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                      value={depositValue}
                      onUserInput={setDepositValue}
                    />
                    <Button
                      variant="outlined"
                      color="blue"
                      size="xs"
                      className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                    >
                      {i18n._(t`MAX`)}
                    </Button>
                  </div>
                  <Button className="w-full" color="blue">
                    {i18n._(t`Commit`)}
                  </Button>
                </div>

                {/* info */}
                <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Your committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">$91.09</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Additional fee:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">1%</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Total committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">~$261,951 (173.32%)</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Funds to raise:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">$150,000</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Price per CROSS:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">$0.2</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Price per CROSS with fee:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">~$0.21</div>
                  </div>
                </div>
              </div>

              {/* Introduction */}
              <div className="relative flex flex-col justify-between px-4 pt-8 space-y-8 rounded-r bg-dark-800">
                <div className="pt-12">
                  <div className="absolute inset-0 opacity-50 filter saturate-0 ">
                    <Image src="/images/ifo/ifo-bg.png" className="object-cover w-full" layout="fill" />
                  </div>
                  <div className="mx-auto">
                    <Image src="/images/ifo/crona.png" alt="CronaSwap" width="285px" height="55px" />
                  </div>
                  <div className="flex gap-1 mx-auto mt-10 text-high-emphesis">
                    <div className="flex items-baseline gap-1">
                      <div className="text-[32px] leading-4 font-medium">00D</div>
                      <div className="text-[32px] leading-[1.2] font-medium text-mono text-secondary">:</div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-[32px] leading-4 font-medium text-mono">00H</div>
                      <div className="text-[32px] leading-[1.2] font-medium text-mono text-secondary">:</div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-[32px] leading-4 font-medium text-mono">00M</div>
                      <div className="text-[32px] leading-[1.2] font-medium text-mono text-secondary">:</div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-[32px] leading-[1.2] font-medium text-mono">00S</div>
                    </div>
                  </div>
                </div>

                <div className="pb-16 space-y-2">
                  <div className="text-xl font-bold">Introduction</div>
                  <div className="text-[14px] text-high-emphesis">
                    CronaSwap is the first decentralized exchange platform on the Cronos Chain to offer the lowest
                    transaction fees (0.25%). You can swap CRC-20 tokens easily on the Cronos Chain network that
                    guarantees superior speed and much lower network transaction costs.
                  </div>
                  <div className="flex items-center gap-4 pb-4">
                    <a href="https://twitter.com/cronaswap" target="_blank" rel="noreferrer">
                      <TwitterIcon width={16} className="text-low-emphesis" />
                    </a>
                    <a href="https://twitter.com/cronaswap" target="_blank" rel="noreferrer">
                      <TwitterIcon width={16} className="text-low-emphesis" />
                    </a>
                    <a href="https://twitter.com/cronaswap" target="_blank" rel="noreferrer">
                      <TwitterIcon width={16} className="text-low-emphesis" />
                    </a>
                    <a href="https://cronaswap.medium.com/" target="_blank" rel="noreferrer">
                      <MediumIcon width={16} className="text-low-emphesis" />
                    </a>
                    <a href="https://discord.com/invite/YXxega5vJG" target="_blank" rel="noreferrer">
                      <DiscordIcon width={16} className="text-low-emphesis" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* faq */}
        <div className="px-4 py-6 mx-auto rounded sm:py-8 sm:px-6 lg:px-8 bg-dark-900">
          {/* step */}
          <h2 className="mb-8 text-3xl font-extrabold text-center text-high-emphesis sm:text-4xl">How to take part</h2>
          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3 auto-cols-max">
            <div className="p-4 rounded-lg bg-dark-800">
              <h1 className="text-lg">1. Get CRONA-CRO LP</h1>
              <h2 className="flex flex-row items-center text-sm">
                Stake CRONA and CRO in the liquidity pool to get LP tokens. You’ll spend them to buy IFO sale tokens
              </h2>
              <Button className="mt-2" size="sm" color="gradient">
                Get CRONA-CRO
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-dark-800">
              <h1 className="text-lg">2. Commit LP Tokens</h1>
              <h2 className="flex flex-row items-center text-sm">
                When the IFO sales are live, you can “commit” your LP tokens to buy the tokens being sold. We recommend
                committing to the Basic Sale first, but you can do both if you like.
              </h2>
            </div>
            <div className="p-4 rounded-lg bg-dark-800">
              <h1 className="text-lg">3. Claim Your Tokens</h1>
              <h2 className="flex flex-row items-center text-sm">
                After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent CRONA LP
                tokens will be returned to your wallet.
              </h2>
            </div>
          </div>

          <div className="mx-auto divide-y-2 divide-dark-800">
            <h2 className="text-3xl font-extrabold text-center text-high-emphesis sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <dl className="mt-6 space-y-6 divide-y-2 divide-dark-800">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-600">
                          <span className="font-medium text-white">{faq.question}</span>
                          <span className="flex items-center ml-6 h-7">
                            <ChevronDownIcon
                              className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="pr-12 mt-2">
                        <p className="text-base text-gray-400">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Container>
  )
}
