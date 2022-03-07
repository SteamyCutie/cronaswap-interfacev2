import React, { useState } from 'react'
import { useLingui } from '@lingui/react'
import { NATIVE, ZERO } from '@cronaswap/core-sdk'
import Head from 'next/head'
import Image from 'next/image'
import { t } from '@lingui/macro'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { CRONA, XCRONA } from '../../config/tokens'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Input from '../../components/Input'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../services/web3'
import { useTokenBalance } from '../../state/wallet/hooks'
import { classNames, formatBalance, formatNumber, formatPercent } from '../../functions'
import { VOTING_ESCROW_ADDRESS } from '../../constants/addresses'
import { useWalletModalToggle } from '../../state/application/hooks'
import useVotingEscrow from 'app/features/boost/useVotingEscrow'
import { format, addDays, getUnixTime } from 'date-fns'
import { useLockedBalance } from 'app/features/boost/hook'
import QuestionHelper from 'app/components/QuestionHelper'
import { useTokenInfo } from 'app/features/farms/hooks'
import { useCronaContract } from 'app/hooks/useContract'
import { getAPY } from 'app/features/staking/useStaking'
import { CalculatorIcon } from '@heroicons/react/solid'
import ROICalculatorModal from 'app/components/ROICalculatorModal'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import VotingItems, { SelectItem } from 'app/features/boost/VotingItems'
import { FARMSV2 } from 'app/constants/farmsv2'

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

const tabStyle = 'rounded-lg p-3'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-blue`
const inactiveTabStyle = `${tabStyle} bg-dark-700 text-secondary`

const buttonStyle =
  'flex justify-center items-center w-full h-12 rounded font-bold md:font-medium md:text-lg text-sm focus:outline-none focus:ring bg-blue'

export default function Boostv2() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const balance = useTokenBalance(account ?? undefined, CRONA[chainId])

  const cronaInfo = useTokenInfo(useCronaContract())

  const { rewards, harvestRewards, lockAmount, lockEnd, veCrona, cronaSupply, veCronaSupply } = useLockedBalance()

  const { manualAPY, autoAPY } = getAPY()

  const {
    claimRewards,
    claimHarvestRewards,
    createLockWithMc,
    increaseAmountWithMc,
    increaseUnlockTimeWithMc,
    withdrawWithMc,
  } = useVotingEscrow()

  const WEEK = 7 * 86400

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const [activeTab, setActiveTab] = useState(90)
  const [input, setInput] = useState('')
  const [usingBalance, setUsingBalance] = useState(false)

  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  const [approvalState, approve] = useApproveCallback(parsedAmount, VOTING_ESCROW_ADDRESS[chainId])

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  const insufficientFunds = (balance && balance.equalTo(ZERO)) || parsedAmount?.greaterThan(balance)
  const inputError = insufficientFunds

  const newLockTime = Math.floor(getUnixTime(addDays(Date.now(), activeTab)) / WEEK) * WEEK
  const [pendingTx, setPendingTx] = useState(false)
  const buttonDisabled = !input || pendingTx || (parsedAmount && parsedAmount.equalTo(ZERO))
  const lockTimeBtnDisabled = pendingTx || newLockTime <= Number(lockEnd)

  // console.log(newLockTime / WEEK, Math.floor(newLockTime / WEEK) * WEEK, Number(lockEnd))

  const handleCreateLock = async () => {
    if (buttonDisabled) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      if (approvalState === ApprovalState.NOT_APPROVED) {
        const success = await sendTx(() => approve())
        if (!success) {
          setPendingTx(false)
          return
        }
      }

      // const success = await sendTx(() => createLockWithMc(parsedAmount, getUnixTime(addDays(Date.now(), activeTab))))
      const success = await sendTx(() => createLockWithMc(parsedAmount, newLockTime))

      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const handleIncreaseAmount = async () => {
    if (buttonDisabled) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      const success = await sendTx(() => increaseAmountWithMc(parsedAmount))

      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  // handleIncreaseUnlockTime
  const handleIncreaseUnlockTime = async () => {
    if (lockTimeBtnDisabled) return

    // (_unlockTime / WEEK) * WEEK

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      const success = await sendTx(() => increaseUnlockTimeWithMc(newLockTime))

      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const handleWithdrawWith = async () => {
    if (getUnixTime(Date.now()) <= lockEnd) return

    // (_unlockTime / WEEK) * WEEK

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      const success = await sendTx(() => withdrawWithMc())

      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  // claim rewards
  const handleClaimRewards = async (ctype: String) => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      const success = await sendTx(() => (ctype === 'claim' ? claimRewards() : claimHarvestRewards()))

      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const [showCalc, setShowCalc] = useState(false)

  const allFarms = Object.keys(FARMSV2[chainId]).map((key) => {
    return { ...FARMSV2[chainId][key], lpToken: key, isBoost: false }
  })

  const voteFarms = allFarms.filter((item) => item.isVote == true)
  const [boostedFarms, setBoostedFarms] = useState([])
  const handleBoost = (item) => {
    // item.isBoost = false
    console.log('******before', item.isBoost)
    item.isBoost = item.isBoost ? false : true
    console.log('******after', item)
    if (item.isBoost == true) {
      setBoostedFarms((old) => [...old, item])
    } else {
      setBoostedFarms(boostedFarms.filter((item) => item.isBoost == true))
    }
  }

  console.log('boosted+++++', boostedFarms)
  const [percent, setPercent] = useState('')
  const [newWeighting, setNewWeighting] = useState<number>(0)
  const handlePercentage = (value) => {
    setPercent(value)
    setNewWeighting(newWeighting + Number(percent))
  }

  const VoteInputItem = ({ token0, token1, percentage }) => {
    const [voteValue, setVoteValue] = useState('')
    const handleChange = (event) => {
      percentage(event.target.value)
      setVoteValue(event.target.value)
    }

    return (
      <div className="flex items-center h-12 p-1 border-2 rounded-md w-36 lg:w-44 border-dark-650">
        <div className="flex items-center gap-2">
          {token0 && token1 && <CurrencyLogoArray currencies={[token0, token1]} dense size={20} />}
          <div>%</div>
        </div>
        <input
          type={'number'}
          value={voteValue}
          placeholder={`${token0.symbol}-${token1.symbol} LP`}
          className="w-full px-1 text-sm bg-transparent "
          onChange={handleChange}
        />
      </div>
    )
  }

  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="full">
      <Head>
        <title key="title">Boostv2 | CronaSwap</title>
        <meta key="description" name="description" content="Boost CronaSwap" />
      </Head>
      <div className="flex flex-col items-center justify-start flex-grow w-full h-full">
        <div className="items-center w-full max-w-5xl px-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 auto-cols-max">
              <div className="p-4 rounded-lg bg-dark-800">
                <div className="flex items-center hover:cursor-pointer" onClick={() => setShowCalc(true)}>
                  <h1 className="text-lg">{`${autoAPY ? autoAPY.toFixed(2) + '%' : i18n._(t`Loading...`)}`}</h1>
                  <CalculatorIcon className="w-5 h-5" />
                </div>
                <ROICalculatorModal
                  isfarm={false}
                  isOpen={showCalc}
                  onDismiss={() => setShowCalc(false)}
                  showBoost={false}
                  showCompound={false}
                  Lpbalance={Number((lockAmount / 1e18).toFixed(2))}
                  name={'CRONA'}
                  apr={manualAPY}
                />
                <h2 className="flex flex-row items-center text-sm">
                  veCRONA APY <QuestionHelper text="The reward apy of lock CRONA." />
                </h2>
              </div>
              <div className="p-4 rounded-lg bg-dark-800">
                <h1 className="text-lg">
                  {formatPercent(
                    formatNumber(
                      Number(formatBalance(cronaSupply ? cronaSupply : 1)) /
                        Number(cronaInfo.circulatingSupply ? cronaInfo.circulatingSupply : 1)
                    )
                  )}
                </h1>
                <h2 className="flex flex-row items-center text-sm">
                  % of CRONA locked
                  <QuestionHelper text="Percentage of circulating CRONA locked in veCRONA earning protocol revenue." />
                </h2>
              </div>
              <div className="p-4 rounded-lg bg-dark-800">
                <h1 className="text-lg">{formatNumber((Number(veCronaSupply) / Number(cronaSupply)) * 4)} years</h1>
                <h2 className="flex flex-row items-center text-sm">
                  Average CRONA lock time <QuestionHelper text="Average CRONA lock time in veCRONA." />
                </h2>
              </div>
              {/* <div className="p-4 rounded-lg bg-dark-800">
                <h3>Auto CRONA Bounty</h3>
                <div className="flex"></div>
                <h1 className="text-lg">{formatNumber((Number(veCronaSupply) / Number(cronaSupply)) * 4)} years</h1>
                <h2 className="flex flex-row items-center text-sm">
                  Average CRONA lock time <QuestionHelper text="Average CRONA lock time in veCRONA." />
                </h2>
              </div> */}
            </div>

            <div className="gap-4 md:flex">
              {/* lock crona */}
              <div className="rounded-lg md:w-1/2 bg-dark-900">
                <div className="p-8 rounded-t-lg bg-dark-800">
                  <h1 className="text-2xl font-bold">CRONA Boost Lock</h1>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-base md:text-lg text-high-emphesis">{i18n._(t`Your CRONA Balance`)}</p>
                    <div className="text-base font-medium text-high-emphesis md:text-lg md:font-normal">
                      {balance?.toSignificant(12)} CRONA
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
                          {`${input ? input : '0'} CRONA`}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-secondary md:text-base">
                        <button
                          className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-cyan-blue md:bg-opacity-30 border-secondary md:border-cyan-blue rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-cyan-blue"
                          onClick={() => {
                            if (!balance.equalTo(ZERO)) {
                              setInput(balance?.toSignificant(balance.currency.decimals))
                            }
                          }}
                        >
                          {i18n._(t`MAX`)}
                        </button>
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

                  <div className="flex flex-col pb-4 mt-6 space-y-2">
                    <div className="flex flex-row items-center justify-between text-base">
                      <div className="text-sm">My CRONA Locked</div>
                      <div className="text-sm">{formatNumber(lockAmount?.toFixed(18))}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between text-base">
                      <div className="text-sm">My veCRONA balance</div>
                      <div className="text-sm">{formatNumber(veCrona?.toFixed(18))}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between text-base">
                      <div className="text-sm">Unlock Time</div>
                      <div className="text-sm">{lockEnd > 0 ? format(lockEnd * 1000, 'iii, MMM dd, yyyy') : '-'}</div>
                    </div>
                  </div>

                  {/* First create lock */}
                  {Number(lockAmount) == 0 ? (
                    approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
                      <Button color="gradient" disabled={approvalState === ApprovalState.PENDING} onClick={approve}>
                        {approvalState === ApprovalState.PENDING ? (
                          <Dots>{i18n._(t`Approving`)} </Dots>
                        ) : (
                          i18n._(t`Approve`)
                        )}
                      </Button>
                    ) : (
                      <Button
                        color={buttonDisabled ? 'gray' : !walletConnected ? 'blue' : insufficientFunds ? 'red' : 'blue'}
                        onClick={handleCreateLock}
                        disabled={buttonDisabled || inputError}
                      >
                        {!walletConnected
                          ? i18n._(t`Connect Wallet`)
                          : !input
                          ? i18n._(t`Create Lock`)
                          : insufficientFunds
                          ? i18n._(t`Insufficient Balance`)
                          : i18n._(t`Create Lock`)}
                      </Button>
                    )
                  ) : (
                    <div className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-2">
                      {/* increacse amount or increacse time */}
                      <Button
                        color={buttonDisabled ? 'gray' : !walletConnected ? 'blue' : insufficientFunds ? 'red' : 'blue'}
                        onClick={handleIncreaseAmount}
                        disabled={buttonDisabled || inputError}
                      >
                        {!walletConnected
                          ? i18n._(t`Connect Wallet`)
                          : !input
                          ? i18n._(t`Increase Amount`)
                          : insufficientFunds
                          ? i18n._(t`Insufficient Balance`)
                          : i18n._(t`Increase Amount`)}
                      </Button>
                      <Button
                        color={lockTimeBtnDisabled ? 'gray' : 'blue'}
                        disabled={lockTimeBtnDisabled}
                        onClick={handleIncreaseUnlockTime}
                      >
                        Increase Locktime
                      </Button>
                    </div>
                  )}

                  {/* lock end and withdraw */}
                  {lockEnd != 0 && getUnixTime(Date.now()) >= lockEnd ? (
                    <Button
                      color="gradient"
                      className="mt-2"
                      onClick={handleWithdrawWith}
                      disabled={getUnixTime(Date.now()) < lockEnd}
                    >
                      {!walletConnected
                        ? i18n._(t`Connect Wallet`)
                        : i18n._(t`Your lock ended, you can withdraw your CRONA`)}
                    </Button>
                  ) : (
                    <></>
                  )}

                  <div
                    className={
                      Number(rewards) > 0 && Number(harvestRewards) > 0
                        ? 'grid grid-cols-1 gap-2 md:grid-cols-2 mt-2'
                        : 'grid grid-cols-1 gap-2 md:grid-cols-1 mt-2'
                    }
                  >
                    {/* rewards */}
                    {Number(rewards) > 0 ? (
                      <Button color="gradient" className="mt-2" onClick={() => handleClaimRewards('claim')}>
                        {!walletConnected ? i18n._(t`Connect Wallet`) : i18n._(t`Claim Boost Rewards`)} (
                        {formatNumber(rewards?.toFixed(18))})
                      </Button>
                    ) : (
                      <></>
                    )}

                    {Number(harvestRewards) > 0 ? (
                      <Button color="gradient" className="mt-2" onClick={() => handleClaimRewards('harvest')}>
                        {!walletConnected ? i18n._(t`Connect Wallet`) : i18n._(t`Auto Boost Bounty`)} (
                        {formatNumber(harvestRewards?.toFixed(18))})
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-lg md:w-1/2 bg-dark-900">
                <div className="p-8 rounded-t-lg bg-dark-800">
                  <h1 className="text-2xl font-bold">Global votes</h1>
                </div>
                <div className="p-4 overflow-y-auto">
                  <div className="grid grid-cols-3 p-2 text-lg border-b-2 border-dark-700">
                    <div>Boosted Farms</div>
                    <div className="ml-auto">Votes</div>
                    <div className="ml-auto">Weight %</div>
                  </div>
                  <div className="max-h-[440px]">
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                    <VotingItems token0={CRONA[chainId]} token1={NATIVE[chainId]} vote="23439900" weight="32.23" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full text-white bg-gray-900 rounded-lg">
              <div className="flex items-center p-8 rounded-lg bg-dark-800">
                <h1 className="text-2xl font-bold">{i18n._(t`Vote to boost your farm`)}</h1>
                <QuestionHelper />
              </div>
              <div className="p-8 space-y-2 md:space-y-0 md:flex bg-dark-900">
                <div className="md:w-1/4">
                  <div className="mb-4 font-Poppins">{i18n._(t`Select boosted farms`)}</div>
                  <div className="p-6 overflow-y-auto border-4 h-80 rounded-xl border-dark-650">
                    {voteFarms.map((item, index) => (
                      <SelectItem key={index} item={item} triggerBoost={handleBoost} />
                    ))}
                  </div>
                </div>
                <div className="md:px-4 md:w-2/4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-base font-Poppins">{i18n._(t`Vote percentage`)}</div>
                    {/* <SelectItem name="Distribution Helper" triggerBoost={handleBoost} /> */}
                  </div>
                  <div className="grid grid-cols-2 px-2 py-2 overflow-y-auto border-4 h-60 gap-y-1 lg:px-4 rounded-xl border-dark-650">
                    {boostedFarms.map((item, index) => (
                      <VoteInputItem
                        key={index}
                        token0={CRONA[chainId]}
                        token1={NATIVE[chainId]}
                        percentage={handlePercentage}
                      />
                    ))}

                    {/* <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} />
                    <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} />
                    <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} />
                    <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} />
                    <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} />
                    <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} />
                    <VoteInputItem token0={CRONA[chainId]} token1={NATIVE[chainId]} percentage={65.2} /> */}
                  </div>
                  <div>
                    <div className="mt-1 mb-1">New vote weighting: {newWeighting}%</div>
                    <button className={buttonStyle}>Vote (weights must total 100%)</button>
                  </div>
                </div>
                <div className="w-1/4">
                  <div className="w-40 h-40 mx-auto mt-20 bg-gray-100 rounded-full"></div>
                  <div className="items-end mx-auto mt-16 text-center">Your current proposed vote weighting</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
