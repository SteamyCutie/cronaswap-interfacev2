import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { MASTERCHEF_ADDRESS, BAR_ADDRESS, ZERO } from '@cronaswap/core-sdk'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { CRONA, XCRONA } from '../../config/tokens'
import BigNumber from 'bignumber.js'
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
import useCronaBar from '../../hooks/useCronaBar'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useLingui } from '@lingui/react'
import { useTokenBalance } from '../../state/wallet/hooks'
import { classNames } from '../../functions'
import { aprToApy } from '../../functions/convert/apyApr'
import { useBar, useBlock, useFactory, useNativePrice, useSushiPrice, useTokens } from '../../services/graph'
import { useDashboardContract } from 'hooks/useContract'
import { getBalanceNumber, getBalanceAmount } from 'functions/formatBalance'

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
  const cronaBalance = useTokenBalance(account ?? undefined, CRONA[ChainId.CRONOS])
  const xCronaBalance = useTokenBalance(account ?? undefined, XCRONA)
  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const { enterStaking, leaveStaking } = useCronaBar()

  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)

  const balance = activeTab === 0 ? cronaBalance : xCronaBalance

  const formattedBalance = balance?.toSignificant(4)

  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  const [approvalState, approve] = useApproveCallback(parsedAmount, MASTERCHEF_ADDRESS[ChainId.CRONOS])

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
    //todo
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
        const success = await sendTx(() => enterStaking(parsedAmount))
        if (!success) {
          setPendingTx(false)
          // setModalOpen(true)
          return
        }
      } else if (activeTab === 1) {
        const success = await sendTx(() => leaveStaking(parsedAmount))
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

  const dashboardContract = useDashboardContract();
  const [manualAPY, setManualAPY] = useState(0);
  // const [autoAPY, setAutoAPY] = useState(0);

  const getManualAPY = async () => {
    const apyofManual = await dashboardContract.apyOfPool(0)
    const apyManual = getBalanceAmount(apyofManual._hex, 18)
    setManualAPY(apyManual.toNumber() * 100)
  }
  getManualAPY()

  const aprToApy = (apr: number, compoundFrequency = 1, days = 365, performanceFee = 0) => {
    const daysAsDecimalOfYear = days / 365
    const aprAsDecimal = apr / 100
    const timesCompounded = 365 * compoundFrequency
    let apyAsDecimal = (apr / 100) * daysAsDecimalOfYear
    if (timesCompounded > 0) {
      apyAsDecimal = (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - 1
    }
    if (performanceFee) {
      const performanceFeeAsDecimal = performanceFee / 100
      const takenAsPerformanceFee = apyAsDecimal * performanceFeeAsDecimal
      apyAsDecimal -= takenAsPerformanceFee
    }
    return apyAsDecimal * 100
  }


  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="full">
      <Head>
        <title key="title">Stake | CronaSwap</title>
        <meta
          key="description"
          name="description"
          content="Stake CRONA in return for xCRONA, an interest bearing and fungible ERC20 token designed to share revenue generated by all CRONA products."
        />
        <meta key="twitter:url" name="twitter:url" content="https://app.sushi.com/stake" />
        <meta key="twitter:title" name="twitter:title" content="STAKE CRONA" />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="Stake CRONA in return for xCRONA, an interest bearing and fungible ERC20 token designed to share revenue generated by all CRONA products."
        />
        <meta key="twitter:image" name="twitter:image" content="https://app.sushi.com/xsushi-sign.png" />
        <meta key="og:title" property="og:title" content="STAKE CRONA" />
        <meta key="og:url" property="og:url" content="https://app.sushi.com/stake" />
        <meta key="og:image" property="og:image" content="https://app.sushi.com/xsushi-sign.png" />
        <meta
          key="og:description"
          property="og:description"
          content="Stake CRONA in return for xCRONA, an interest bearing and fungible ERC20 token designed to share revenue generated by all CRONA products."
        />
      </Head>
      <div className="flex flex-col w-full min-h-full">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col w-full max-w-xl mt-auto mb-2">
            <div className="flex max-w-lg">
              <div className="self-end mb-3 text-lg font-bold md:text-2xl text-high-emphesis md:mb-7">
                {i18n._(t`Maximize yield by staking CRONA for xCRONA`)}
              </div>
            </div>
            <div className="max-w-lg pr-3 mb-2 text-sm leading-5 text-gray-500 md:text-base md:mb-4 md:pr-0">
              {i18n._(t`For every swap on the exchange on every chain, 0.05% of the swap fees are distributed as CRONA
                                proportional to your share of the CronaBar. When your CRONA is staked into the CronaBar, you receive
                                xCRONA in return for voting rights and a fully composable token that can interact with other protocols.
                                Your xCRONA is continuously compounding, when you unstake you will receive all the originally deposited
                                CRONA and any additional from fees.`)}
            </div>
          </div>
          <div className="hidden px-8 ml-6 md:block w-72">
            <Image src="/xsushi-sign.png" alt="xCRONA sign" width="100%" height="100%" layout="responsive" />
          </div>
        </div>
        <div className="flex flex-col justify-center mb-5 md:flex-row">
          {/* Manual Staking */}
          <div className="flex flex-col w-full max-w-xl mx-auto mb-4 md:m-0">
            <div className="mb-4">
              <div className="flex items-center justify-between w-full h-24 max-w-xl p-4 rounded md:pl-5 md:pr-7 bg-light-yellow bg-opacity-40">
                <div className="flex flex-col">
                  <div className="flex items-center justify-center mb-4 flex-nowrap md:mb-2">
                    <p className="text-base font-bold text-center whitespace-nowrap md:text-lg md:leading-5 text-high-emphesis">
                      {i18n._(t`Manual Staking APR`)}{' '}
                    </p>
                    {/* <img className="ml-3 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} /> */}
                  </div>
                  {/* <div className="flex">
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
                  </div> */}
                </div>
                <div className="flex flex-col">
                  <p className="mb-1 text-lg font-bold text-right text-high-emphesis md:text-3xl">
                    {`${manualAPY ? manualAPY.toFixed(2) + '%' : i18n._(t`Loading...`)}`}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
              <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
                {/* select method */}
                <div className="flex w-full rounded h-14 bg-dark-800">
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setActiveTab(0)
                      handleInput('')
                    }}
                  >
                    <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Stake CRONA`)}</p>
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
                    {activeTab === 0 ? i18n._(t`Stake CRONA`) : i18n._(t`Unstake`)}
                  </p>
                  {/* Hidden now */}
                  {/* <div className="border-gradient-r-pink-red-light-brown-dark-pink-red border-transparent border-solid border rounded-3xl px-4 md:px-3.5 py-1.5 md:py-0.5 text-high-emphesis text-xs font-medium md:text-base md:font-normal">
                    {`1 xCRONA = 1 CRONA`}
                  </div> */}
                </div>

                {/* CRONA Amount Input */}
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
                    className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${inputError ? ' border border-red' : ''
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
                        className={`text-sm md:text-lg font-bold whitespace-nowrap ${input ? 'text-high-emphesis' : 'text-secondary'
                          }`}
                      >
                        {`${input ? input : '0'} ${activeTab === 0 ? '' : 'x'}CRONA`}
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

                {/* Confirm Button */}
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
          <div className="w-full max-w-xl mx-auto my-auto md:mx-0 md:ml-6 md:block md:w-72">
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
                      alt="xCRONA"
                      width={64}
                      height={64}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold md:text-lg text-high-emphesis">
                        {xCronaBalance ? xCronaBalance.toSignificant(4) : '-'}
                      </p>
                      <p className="text-sm md:text-base text-primary">xCRONA</p>
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
                      alt="CRONA"
                      width={64}
                      height={64}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold md:text-lg text-high-emphesis">
                        {cronaBalance ? cronaBalance.toSignificant(4) : '-'}
                      </p>
                      <p className="text-sm md:text-base text-primary">CRONA</p>
                    </div>
                  </div>
                </div>

                {/* <div className="flex flex-col w-full mb-4 mt-7 md:mb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 flex-nowrap">
                      <p className="text-base font-bold md:text-lg text-high-emphesis">Weighted APR</p>
                      <img className="w-4 ml-2 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} />
                    </div>
                    <div className="flex flex-1 md:flex-initial">
                      <p className="ml-5 text-base text-primary md:ml-0">{`${weightedApr}%`}</p>
                    </div>
                  </div>
                  {account && (
                    <a
                      href={`https://analytics.sushi.com/users/${account}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`
                                flex flex-grow justify-center items-center
                                h-14 mt-6 rounded
                                bg-dark-700 text-high-emphesis
                                focus:outline-none focus:ring hover:bg-opacity-80
                                text-sm font-bold cursor-pointer
                            `}
                    >
                      {i18n._(t`Your CronaBar Stats`)}
                    </a>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center mb-5 md:flex-row">
          {/* Auto Compound Staking */}
          <div className="flex flex-col w-full max-w-xl mx-auto mb-4 md:m-0">
            <div className="mb-4">
              <div className="flex items-center justify-between w-full h-24 max-w-xl p-4 rounded md:pl-5 md:pr-7 bg-light-yellow bg-opacity-40">
                <div className="flex flex-col">
                  <div className="flex items-center justify-center mb-4 flex-nowrap md:mb-2">
                    <p className="text-sm font-bold whitespace-nowrap md:text-lg md:leading-5 text-high-emphesis">
                      {i18n._(t`Auto Compound Staking APR`)}{' '}
                    </p>
                    {/* <img className="ml-3 cursor-pointer" src={MoreInfoSymbol} alt={'more info'} /> */}
                  </div>
                  {/* <div className="flex">
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
                  </div> */}
                </div>
                <div className="flex flex-col">
                  <p className="mb-1 text-lg font-bold text-right text-high-emphesis md:text-3xl">
                    {`${aprToApy(manualAPY) ? aprToApy(manualAPY).toFixed(2) + '%' : i18n._(t`Loading...`)}`}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
              <div className="w-full max-w-xl px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-4 md:px-8">
                {/* select method */}
                <div className="flex w-full rounded h-14 bg-dark-800">
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setActiveTab(0)
                      handleInput('')
                    }}
                  >
                    <div className={activeTab === 0 ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Stake CRONA`)}</p>
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
                    {activeTab === 0 ? i18n._(t`Stake CRONA`) : i18n._(t`Unstake`)}
                  </p>
                  {/* Hidden now */}
                  {/* <div className="border-gradient-r-pink-red-light-brown-dark-pink-red border-transparent border-solid border rounded-3xl px-4 md:px-3.5 py-1.5 md:py-0.5 text-high-emphesis text-xs font-medium md:text-base md:font-normal">
                    {`1 xCRONA = 1 CRONA`}
                  </div> */}
                </div>

                {/* CRONA Amount Input */}
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
                    className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${inputError ? ' border border-red' : ''
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
                        className={`text-sm md:text-lg font-bold whitespace-nowrap ${input ? 'text-high-emphesis' : 'text-secondary'
                          }`}
                      >
                        {`${input ? input : '0'} ${activeTab === 0 ? '' : 'x'}CRONA`}
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

                {/* Confirm Button */}
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
          <div className="w-full max-w-xl mx-auto my-auto md:mx-0 md:ml-6 md:block md:w-72"></div>
        </div>
      </div>
    </Container>
  )
}
