import { ethers } from 'ethers'
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
import BigNumber from 'bignumber.js'
import { useInfiniteScroll } from '../../features/farms/hooks'
import FarmListItem from '../../features/farms/FarmListItem'
import Typography from '../../components/Typography'
import Button from '../../components/Button'
import NumericalInput from 'app/components/NumericalInput'
import { DiscordIcon, MediumIcon, TwitterIcon } from 'app/components/Icon'
import { Disclosure } from '@headlessui/react'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../functions/parse'

import { useTokenBalance } from 'app/state/wallet/hooks'
import { CRONA } from 'app/config/tokens'
import { ZERO } from '@cronaswap/core-sdk'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import ifos from 'app/constants/ifo'
import { OnSaleInfo, DEFAULT_TOKEN_DECIMAL } from 'app/features/ifo/ifoInfo'
import { useTokenContract, useIfoV2Contract } from 'app/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { parseUnits } from '@ethersproject/units'

const activeIfo = ifos.find((ifo) => ifo.isActive)

export default function BasicSale(): JSX.Element {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const userCurrencyBalance = useTokenBalance(account ?? undefined, activeIfo.currency)
  const formattedBalance = userCurrencyBalance ?.toSignificant(8)
  const toggleWalletModal = useWalletModalToggle()
  const balance = userCurrencyBalance
  const walletConnected = !!account
  const [depositValue, setDepositValue] = useState('')
  const parsedAmount = tryParseAmount(depositValue, balance ?.currency)

  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

  const query = useFarms()
  const farms = query ?.farms

  let tokenPrice = 0
  let totalTvlInUSD = 0

  query ?.farms.map((farm: any) => {
    tokenPrice = farm.tokenPrice
    totalTvlInUSD = farm.totalTvlInUSD
  })

  const FILTER = {
    all: (farm) => farm.multiplier !== 0,
    inactive: (farm) => farm.multiplier == 0,
  }

  const datas = query ?.farms.filter((farm) => {
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

  const { saleAmount: basicAmount, distributionRatio: basicRatio } = OnSaleInfo({ ifo: activeIfo, poolId: 'poolBasic' })

  const contractAddress = activeIfo['address']
  const contract = useIfoV2Contract(contractAddress)
  console.log("+++++++", contract)
  const raisingTokenContract = useTokenContract(CRONA[chainId].address)
  const [approvalState, approve] = useApproveCallback(parsedAmount, contractAddress)
  const [pendingTx, setPendingTx] = useState(false)

  // Commit
  const valueWithTokenDecimals = new BigNumber(depositValue).times(DEFAULT_TOKEN_DECIMAL)
  console.log("value", valueWithTokenDecimals)

  const handleCommit = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      try {
        setPendingTx(true)
        const args = [valueWithTokenDecimals.toString(), 0]
        const gasLimit = await contract.estimateGas.depositPool(...args)
        const tx = await contract.depositPool(...args, {
          gasLimit: gasLimit.mul(120).div(100),
        })
        addTransaction(tx, {
          summary: `${i18n._(t`Commit`)} CRONA`,
        })
        setPendingTx(false)
      } catch (error) {
        setPendingTx(false)
      }
    }
  }

  return (
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
            {basicAmount}
          </div>
          <div className="text-sm font-bold leading-5 text-secondary">{basicRatio * 100}% of total sale</div>
        </div>
      </div>

      {/* input */}
      <div className="col-span-2 px-4 text-center md:col-span-1">
        <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
          {i18n._(t`Wallet Balance`)}: {formattedBalance}
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
            onClick={() => {
              if (!userCurrencyBalance.equalTo(ZERO)) {
                setDepositValue(userCurrencyBalance ?.toSignificant(userCurrencyBalance.currency.decimals))
              }
            }}
          >
            {i18n._(t`MAX`)}
          </Button>
        </div>
        {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
          <Button className="w-full" color="blue" onClick={approve}>
            {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)} </Dots> : i18n._(t`Approve`)}
          </Button>
        ) : (
            <Button className="w-full" color="blue" onClick={handleCommit}>
              {pendingTx ? <Dots>{i18n._(t`Commiting`)} </Dots> : i18n._(t`Commit`)}
            </Button>
          )}
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
  )
}
