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
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:opacity-90`
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
        <meta key="description" name="description" content="Boost CronaSwap" />
      </Head>
      <div className="flex flex-col items-center justify-start flex-grow w-full h-full">
        <div className="px-4 py-4 md:py-8 lg:py-12 max-w-7xl w-full">
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
                    your CRONA the greater your voting power (CRONA Powah) and weekly reward share will be. You can
                    boost up to 4x by locking CRONA for 4 years. Your boosts slowly reduces over your locking period,
                    eventually unlocking your CRONA, however you can always increase your boost to maintain your boosted
                    level. Your boosted CRONA is represented in eCRONA (escrowed CRONA) and will remain in escrow until
                    your unlock date (non-transferable).
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
                    your CRONA the greater your voting power (CRONA Powah) and weekly reward share will be. You can
                    boost up to 4x by locking CRONA for 4 years. Your boosts slowly reduces over your locking period,
                    eventually unlocking your CRONA, however you can always increase your boost to maintain your boosted
                    level. Your boosted CRONA is represented in eCRONA (escrowed CRONA) and will remain in escrow until
                    your unlock date (non-transferable).
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
                    Weekly Qi staking rewards include 30% of the repayment fees for all collateral types plus a 25%
                    weekly boost (converted into Qi). Rewards also include 100% of the farming rewards from the deposit
                    fee revenue used to farm Qi-MATIC.
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
                  <div className="p-8">
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
                            {`${input ? input : '0'} ${activeTab === 0 ? '' : 'x'}CRONA`}
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

                    <div className="grid grid-cols-3 gap-4 md:grid-cols-6 mt-8">
                      <button className="rounded-lg p-3 bg-dark-700">1 Week</button>
                      <button className="rounded-lg p-3 bg-dark-700">1 Month</button>
                      <button className="rounded-lg p-3 bg-dark-700">3 Months</button>
                      <button className="rounded-lg p-3 bg-dark-700">6 Months</button>
                      <button className="rounded-lg p-3 bg-dark-700">1 Year</button>
                      <button className="rounded-lg p-3 bg-dark-700">3 Years</button>
                    </div>

                    <div className="flex flex-col pb-4 px-4 mt-8 space-y-3">
                      <div className="flex flex-row justify-between text-lg">
                        <h1>My CRONA Locked</h1> <span>1223.998</span>
                      </div>
                      <div className="flex flex-row justify-between text-lg">
                        <h1>My veCRONA balance</h1> <span>1223.998</span>
                      </div>
                      <div className="flex flex-row justify-between text-lg">
                        <h1>Unlock time</h1> <span>Dec 30 2021 21:14:02</span>
                      </div>
                      <div className="flex flex-row justify-between text-lg">
                        <h1>Boost multiplier</h1> <span>1.00x</span>
                      </div>
                    </div>

                    {approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
                      <Button
                        className={`${buttonStyle} text-high-emphesis bg-pink-red hover:bg-opacity-90`}
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
                          : i18n._(t`Confirm Lock`)}
                      </button>
                    )}
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
