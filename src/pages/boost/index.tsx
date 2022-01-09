import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { BAR_ADDRESS, ZERO } from '@cronaswap/core-sdk'
import React, { useState } from 'react'
import { SUSHI, XSUSHI } from '../../config/tokens'
import Button from '../../components/Button'
import { ChainId } from '@cronaswap/core-sdk'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Head from 'next/head'
import Image from 'next/image'
import Input from '../../components/Input'
import TransactionFailedModal from '../../modals/TransactionFailedModal'
import { request } from 'graphql-request'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../services/web3'
import { useLingui } from '@lingui/react'
import useSushiBar from '../../hooks/useSushiBar'
import { useBar, useBlock, useFactory, useNativePrice, useSushiPrice, useTokens } from '../../services/graph'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { classNames } from '../../functions'
import { aprToApy } from '../../functions/convert/apyApr'

const INPUT_CHAR_LIMIT = 18

const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true
  try {
    const ret = await txFunc()
    if (ret?.error) {
      success = false
    }
  } catch (e) {
    console.error(e)
    success = false
  }
  return success
}

const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
const inactiveTabStyle = `${tabStyle} text-secondary`

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-gradient-to-r from-pink-red to-light-brown hover:opacity-90`
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`

const fetcher = (query) => request('https://api.thegraph.com/subgraphs/name/matthewlilley/bar', query)

export default function Stake() {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const sushiBalance = useTokenBalance(account ?? undefined, SUSHI[ChainId.ETHEREUM])
  const xSushiBalance = useTokenBalance(account ?? undefined, XSUSHI)

  const { enter, leave } = useSushiBar()

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)

  const balance = activeTab === 0 ? sushiBalance : xSushiBalance

  const formattedBalance = balance?.toSignificant(4)

  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  const [approvalState, approve] = useApproveCallback(parsedAmount, BAR_ADDRESS[ChainId.ETHEREUM])

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  const handleClickMax = () => {
    setInput(parsedAmount ? parsedAmount.toSignificant(balance.currency.decimals).substring(0, INPUT_CHAR_LIMIT) : '')
    setUsingBalance(true)
  }

  const insufficientFunds = (balance && balance.equalTo(ZERO)) || parsedAmount?.greaterThan(balance)

  const inputError = insufficientFunds

  const [pendingTx, setPendingTx] = useState(false)

  const buttonDisabled = !input || pendingTx || (parsedAmount && parsedAmount.equalTo(ZERO))

  const handleClickButton = async () => {
    if (buttonDisabled) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      if (activeTab === 0) {
        if (approvalState === ApprovalState.NOT_APPROVED) {
          const success = await sendTx(() => approve())
          if (!success) {
            setPendingTx(false)
            // setModalOpen(true)
            return
          }
        }
        const success = await sendTx(() => enter(parsedAmount))
        if (!success) {
          setPendingTx(false)
          // setModalOpen(true)
          return
        }
      } else if (activeTab === 1) {
        const success = await sendTx(() => leave(parsedAmount))
        if (!success) {
          setPendingTx(false)
          // setModalOpen(true)
          return
        }
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const block1d = useBlock({ daysAgo: 1, chainId: ChainId.ETHEREUM })

  const exchange = useFactory({ chainId: ChainId.ETHEREUM })

  const exchange1d = useFactory({
    chainId: ChainId.ETHEREUM,
    variables: {
      block: block1d,
    },
    shouldFetch: !!block1d,
  })

  const ethPrice = useNativePrice({ chainId: ChainId.ETHEREUM })

  const xSushi = useTokens({
    chainId: ChainId.ETHEREUM,
    variables: { where: { id: XSUSHI.address.toLowerCase() } },
  })?.[0]

  const bar = useBar()

  const [xSushiPrice] = [xSushi?.derivedETH * ethPrice, xSushi?.derivedETH * ethPrice * bar?.totalSupply]

  const APY1d = aprToApy(
    (((exchange?.volumeUSD - exchange1d?.volumeUSD) * 0.0005 * 365.25) / (bar?.totalSupply * xSushiPrice)) * 100 ?? 0
  )

  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="full">
      <Head>
        <title key="title">Boost | CronaSwap</title>
        <meta
          key="description"
          name="description"
          content="Stake SUSHI in return for xSUSHI, an interest bearing and fungible ERC20 token designed to share revenue generated by all SUSHI products."
        />
        <meta key="twitter:url" name="twitter:url" content="https://app.sushi.com/stake" />
        <meta key="twitter:title" name="twitter:title" content="STAKE SUSHI" />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Stake SUSHI in return for xSUSHI, an interest bearing and fungible ERC20 token designed to share revenue generated by all SUSHI products."
        />
        <meta key="twitter:image" name="twitter:image" content="https://app.sushi.com/xsushi-sign.png" />
        <meta key="og:title" property="og:title" content="STAKE SUSHI" />
        <meta key="og:url" property="og:url" content="https://app.sushi.com/stake" />
        <meta key="og:image" property="og:image" content="https://app.sushi.com/xsushi-sign.png" />
        <meta
          key="og:description"
          property="og:description"
          content="Stake SUSHI in return for xSUSHI, an interest bearing and fungible ERC20 token designed to share revenue generated by all SUSHI products."
        />
      </Head>
      <div className="flex flex-col w-full min-h-full">
        <div className="grid grid-cols-12 gap-4 min-h-1/2">
          <div className="hidden lg:block lg:col-span-4 h-full" style={{ maxHeight: '40rem' }}>
            <div className="flex flex-col space-y-4">
              <div className="bg-blue bg-opacity-40 p-8 rounded-lg">
                <div className="flex flex-row items-center justify-between">
                  <h1 className="text-2xl">veCRONA APY</h1>
                  <div className="flex flex-col items-end">
                    <h1 className="text-xl">119.68%</h1>
                    <h2 className="text-sm opacity-50">Average last week</h2>
                  </div>
                </div>
              </div>

              <div className="p-8 pb-64 rounded-lg bg-dark-900">
                <h1 className="text-lg mb-4">What’s CRONA Boost?</h1>
                <p className="text-sm mb-8 text-dm-text-secondary">
                  CRONA Boost is your opportunity to increase the power and rewards of your CRONA. The longer you lock
                  your CRONA the greater your voting power (CRONA Powah) and weekly reward share will be. You can boost
                  up to 4x by locking CRONA for 4 years. Your boosts slowly reduces over your locking period, eventually
                  unlocking your CRONA, however you can always increase your boost to maintain your boosted level. Your
                  boosted CRONA is represented in eCRONA (escrowed CRONA) and will remain in escrow until your unlock
                  date (non-transferable).
                </p>

                <div className="hidden: md:block flex flex-col space-y-2">
                  <div className="p-4 rounded-lg bg-dark-800">
                    <h1 className="text-lg">50.88%</h1>
                    <h2 className="text-sm flex flex-row items-center">
                      % of CRONA locked <span style={{ marginLeft: 4 }}>x</span>
                    </h2>
                  </div>
                  <div className="p-4 rounded-lg bg-dark-800">
                    <h1 className="text-lg">2.54 years</h1>
                    <h2 className="text-sm flex flex-row items-center">
                      Average CRONA lock time <span style={{ marginLeft: 4 }}>x</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 h-full" style={{ minHeight: '40rem' }}>
            <div className="lg:hidden mb-4 space-y-4">
              <div className="bg-light-yellow bg-opacity-40 p-8 rounded-lg">
                <div className="flex flex-row items-center justify-between">
                  <h1 className="text-2xl">veCRONA APY</h1>
                  <div className="flex flex-col items-end">
                    <h1 className="text-xl">119.68%</h1>
                    <h2 className="text-sm opacity-50">Average last week</h2>
                  </div>
                </div>
              </div>
              <div className="p-8 pb-64 rounded-lg bg-dark-900">
                <h1 className="text-lg mb-4">What’s CRONA Boost?</h1>
                <p className="text-sm mb-8 text-dm-text-secondary">
                  CRONA Boost is your opportunity to increase the power and rewards of your CRONA. The longer you lock
                  your CRONA the greater your voting power (CRONA Powah) and weekly reward share will be. You can boost
                  up to 4x by locking CRONA for 4 years. Your boosts slowly reduces over your locking period, eventually
                  unlocking your CRONA, however you can always increase your boost to maintain your boosted level. Your
                  boosted CRONA is represented in eCRONA (escrowed CRONA) and will remain in escrow until your unlock
                  date (non-transferable).
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="p-8 rounded-lg bg-dark-900">
                <div className="mb-4">
                  <div className="flex flex-row item-center justify-between text-lg">
                    <span>Rewarded last week</span>
                    <span>156,626.096 CRONA</span>
                  </div>
                  <div className="flex flex-row item-center justify-between text-lg">
                    <span>Last week</span>
                    <span>$117,469.572</span>
                  </div>
                </div>
                <p className="text-sm text-dm-text-tertiary">
                  Weekly Qi staking rewards include 30% of the repayment fees for all collateral types plus a 25% weekly
                  boost (converted into Qi). Rewards also include 100% of the farming rewards from the deposit fee
                  revenue used to farm Qi-MATIC.
                  <br />
                  <br />
                  Revenues are collected weekly and distributed on the following Wednesday.
                </p>
              </div>

              {/* lock crona */}
              <div className="rounded-lg bg-dark-900">
                <div className="p-8 rounded-t-lg bg-dark-800">
                  <h1 className="text-lg">CRONA Boost Lock</h1>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold text-large md:text-2xl text-high-emphesis">{i18n._(t`Lock CRONA`)}</p>
                    <div className="text-high-emphesis text-xs font-medium md:text-base md:font-normal">
                      Balance: 1,230.0 CRONA
                    </div>
                  </div>

                  <Input.Numeric
                    value={input}
                    onUserInput={handleInput}
                    className={classNames(
                      'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis',
                      inputError ? ' pl-9 md:pl-12' : ''
                    )}
                    placeholder=" "
                  />

                  {/* input overlay: */}
                  <div className="relative w-full h-0 pointer-events-none bottom-20">
                    <div
                      className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${
                        inputError ? ' border border-red' : ''
                      }`}
                    >
                      <div className="flex space-x-2 ">
                        {inputError && (
                          <Image
                            className="mr-2 max-w-4 md:max-w-5"
                            src="/error-triangle.svg"
                            alt="error"
                            width="20px"
                            height="20px"
                          />
                        )}
                        <p
                          className={`text-sm md:text-lg font-bold whitespace-nowrap ${
                            input ? 'text-high-emphesis' : 'text-secondary'
                          }`}
                        >
                          {`${input ? input : '0'} ${activeTab === 0 ? '' : 'x'}SUSHI`}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-secondary md:text-base">
                        <button
                          className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-cyan-blue md:bg-opacity-30 border-secondary md:border-cyan-blue rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-cyan-blue"
                          onClick={handleClickMax}
                        >
                          {i18n._(t`MAX`)}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                    <button className="rounded-lg p-3 bg-dark-700">1 Week</button>
                    <button className="rounded-lg p-3 bg-dark-700">1 Month</button>
                    <button className="rounded-lg p-3 bg-dark-700">3 Months</button>
                    <button className="rounded-lg p-3 bg-dark-700">6 Months</button>
                    <button className="rounded-lg p-3 bg-dark-700">1 Year</button>
                    <button className="rounded-lg p-3 bg-dark-700">3 Years</button>
                  </div>

                  <div className="flex flex-col space-y-2 pb-4 px-4">
                    <div className="flex flex-row justify-between text-lg">
                      <h1>My CRONA Locked</h1> <span>1223.998</span>
                    </div>
                    <div className="flex flex-row justify-between text-lg">
                      <h1>My veCRONA balance</h1> <span>1223.998</span>
                    </div>
                    <div className="flex flex-row justify-between text-lg">
                      <h1>Unlock time</h1> <span>2021-11-23 10:34:23</span>
                    </div>
                    <div className="flex flex-row justify-between text-lg">
                      <h1>Boost multiplier</h1> <span>1.00x</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center mb-6">
          <div className="flex flex-col w-full max-w-xl mt-auto mb-2">
            <div className="flex max-w-lg">
              <div className="self-end mb-3 text-lg font-bold md:text-2xl text-high-emphesis md:mb-7">
                {i18n._(t`Maximize yield by staking SUSHI for xSUSHI`)}
              </div>
            </div>
            <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
              {i18n._(t`For every swap on the exchange on every chain, 0.05% of the swap fees are distributed as SUSHI
                                proportional to your share of the SushiBar. When your SUSHI is staked into the SushiBar, you receive
                                xSUSHI in return for voting rights and a fully composable token that can interact with other protocols.
                                Your xSUSHI is continuously compounding, when you unstake you will receive all the originally deposited
                                SUSHI and any additional from fees.`)}
            </div>
          </div>
          <div className="hidden px-8 ml-6 md:block w-72">
            <Image src="/xsushi-sign.png" alt="xSUSHI sign" width="100%" height="100%" layout="responsive" />
          </div>
        </div> */}
        <div className="flex flex-col justify-center md:flex-row">
          <div className="w-full max-w-xl mx-auto md:mx-0 md:block md:w-72">
            <div className="flex flex-col w-full px-4 pt-6 pb-5 rounded bg-dark-900 md:px-8 md:pt-7 md:pb-9">
              <div className="flex flex-wrap">
                <div className="flex flex-col flex-grow md:mb-14">
                  <p className="mb-3 text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                    {i18n._(t`Balance`)}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Image
                      className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                      src="/images/tokens/xsushi-square.jpg"
                      alt="xSUSHI"
                      width={64}
                      height={64}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold md:text-lg text-high-emphesis">
                        {xSushiBalance ? xSushiBalance.toSignificant(4) : '-'}
                      </p>
                      <p className="text-sm md:text-base text-primary">xSUSHI</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex mb-3 ml-8 flex-nowrap md:ml-0">
                    <p className="text-lg font-bold md:text-2xl md:font-medium text-high-emphesis">
                      {i18n._(t`Unstaked`)}
                    </p>
                    {/* <img className="w-4 ml-2 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} /> */}
                  </div>
                  <div className="flex items-center ml-8 space-x-4 md:ml-0">
                    <Image
                      className="max-w-10 md:max-w-16 -ml-1 mr-1 md:mr-2 -mb-1.5 rounded"
                      src="/images/tokens/sushi-square.jpg"
                      alt="SUSHI"
                      width={64}
                      height={64}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold md:text-lg text-high-emphesis">
                        {sushiBalance ? sushiBalance.toSignificant(4) : '-'}
                      </p>
                      <p className="text-sm md:text-base text-primary">SUSHI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full max-w-xl mx-auto mb-4 md:m-0 md:ml-6 ">
            <div className="mb-4">
              <div className="flex items-center justify-between w-full h-24 max-w-xl p-4 rounded md:pl-5 md:pr-7 bg-light-yellow bg-opacity-40">
                <div className="flex flex-col">
                  <div className="flex items-center justify-center mb-4 flex-nowrap md:mb-2">
                    <p className="text-sm font-bold whitespace-nowrap md:text-lg md:leading-5 text-high-emphesis">
                      {i18n._(t`Staking APR`)}{' '}
                    </p>
                  </div>
                  <div className="flex">
                    <a
                      href={`https://analytics.sushi.com/bar`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`
                        py-1 px-4 md:py-1.5 md:px-7 rounded
                        text-xs md:text-sm font-medium md:font-bold text-dark-900
                        bg-light-yellow hover:bg-opacity-90`}
                    >
                      {i18n._(t`View Stats`)}
                    </a>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="mb-1 text-lg font-bold text-right text-high-emphesis md:text-3xl">
                    {`${APY1d ? APY1d.toFixed(2) + '%' : i18n._(t`Loading...`)}`}
                  </p>
                  <p className="w-32 text-sm text-right text-primary md:w-64 md:text-base">
                    {i18n._(t`Yesterday's APR`)}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
              <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
                <div className="flex w-full rounded h-14 bg-dark-800">
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setActiveTab(0)
                      handleInput('')
                    }}
                  >
                    <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Stake SUSHI`)}</p>
                    </div>
                  </div>
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setActiveTab(1)
                      handleInput('')
                    }}
                  >
                    <div className={activeTab === 1 ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Unstake`)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-6">
                  <p className="font-bold text-large md:text-2xl text-high-emphesis">
                    {activeTab === 0 ? i18n._(t`Stake SUSHI`) : i18n._(t`Unstake`)}
                  </p>
                  <div className="border-gradient-r-pink-red-light-brown-dark-pink-red border-transparent border-solid border rounded-3xl px-4 md:px-3.5 py-1.5 md:py-0.5 text-high-emphesis text-xs font-medium md:text-base md:font-normal">
                    {`1 xSUSHI = ${Number(bar?.ratio ?? 0)?.toFixed(4)} SUSHI`}
                  </div>
                </div>

                <Input.Numeric
                  value={input}
                  onUserInput={handleInput}
                  className={classNames(
                    'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis',
                    inputError ? ' pl-9 md:pl-12' : ''
                  )}
                  placeholder=" "
                />

                {/* input overlay: */}
                <div className="relative w-full h-0 pointer-events-none bottom-14">
                  <div
                    className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${
                      inputError ? ' border border-red' : ''
                    }`}
                  >
                    <div className="flex space-x-2 ">
                      {inputError && (
                        <Image
                          className="mr-2 max-w-4 md:max-w-5"
                          src="/error-triangle.svg"
                          alt="error"
                          width="20px"
                          height="20px"
                        />
                      )}
                      <p
                        className={`text-sm md:text-lg font-bold whitespace-nowrap ${
                          input ? 'text-high-emphesis' : 'text-secondary'
                        }`}
                      >
                        {`${input ? input : '0'} ${activeTab === 0 ? '' : 'x'}SUSHI`}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-secondary md:text-base">
                      <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                        <p>{i18n._(t`Balance`)}:&nbsp;</p>
                        <p className="text-base font-bold">{formattedBalance}</p>
                      </div>
                      <button
                        className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-cyan-blue md:bg-opacity-30 border-secondary md:border-cyan-blue rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-cyan-blue"
                        onClick={handleClickMax}
                      >
                        {i18n._(t`MAX`)}
                      </button>
                    </div>
                  </div>
                </div>
                {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
                activeTab === 0 ? (
                  <Button
                    className={`${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`}
                    disabled={approvalState === ApprovalState.PENDING}
                    onClick={approve}
                  >
                    {approvalState === ApprovalState.PENDING ? (
                      <Dots>{i18n._(t`Approving`)} </Dots>
                    ) : (
                      i18n._(t`Approve`)
                    )}
                  </Button>
                ) : (
                  <button
                    className={
                      buttonDisabled
                        ? buttonStyleDisabled
                        : !walletConnected
                        ? buttonStyleConnectWallet
                        : insufficientFunds
                        ? buttonStyleInsufficientFunds
                        : buttonStyleEnabled
                    }
                    onClick={handleClickButton}
                    disabled={buttonDisabled || inputError}
                  >
                    {!walletConnected
                      ? i18n._(t`Connect Wallet`)
                      : !input
                      ? i18n._(t`Enter Amount`)
                      : insufficientFunds
                      ? i18n._(t`Insufficient Balance`)
                      : activeTab === 0
                      ? i18n._(t`Confirm Staking`)
                      : i18n._(t`Confirm Withdrawal`)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
