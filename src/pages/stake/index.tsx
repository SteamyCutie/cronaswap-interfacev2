import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { MASTERCHEF_ADDRESS, ZERO, NATIVE } from '@cronaswap/core-sdk'
import React, { useState, useRef } from 'react'
import { CRONA, XCRONA } from '../../config/tokens'
import BigNumber from 'bignumber.js'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Head from 'next/head'
import Image from 'next/image'
import Input from '../../components/Input'
import TransactionFailedModal from '../../modals/TransactionFailedModal'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../services/web3'
import useCronaBar from '../../hooks/useCronaBar'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useLingui } from '@lingui/react'
import { useTokenBalance } from '../../state/wallet/hooks'
import { classNames, formatNumber } from '../../functions'
import { useCronaVaultContract, useDashboardV1Contract, useMasterChefContract } from 'hooks/useContract'
import { ArrowRightIcon } from '@heroicons/react/outline'
import DoubleLogo from '../../components/DoubleLogo'
import { useGasPrice } from 'state/user/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { getDecimalAmount, getBalanceNumber, getBalanceAmount } from 'functions/formatBalance'
import {
  getAPY,
  getCronaPrice,
  convertSharesToCrona,
  convertCronaToShares,
  useWithdrawalFeeTimer,
} from 'features/staking/useStaking'
import { CRONAVAULT_ADDRESS } from 'constants/addresses'
import { BIG_ZERO } from 'app/functions/bigNumber'
import QuestionHelper from 'app/components/QuestionHelper'

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
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`

export default function Stake() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const cronaBalance = useTokenBalance(account ?? undefined, CRONA[chainId])
  const xCronaBalance = useTokenBalance(account ?? undefined, XCRONA[chainId])
  const [xBalanceAuto, setXBalanceAuto] = useState(0)
  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  const DEFAULT_GAS_LIMIT = 250000
  const DEFAULT_GAS_LIMIT_AUTO = 380000

  const dashboardContract = useDashboardV1Contract()
  const cronavaultContract = useCronaVaultContract()
  const { enterStaking, leaveStaking } = useCronaBar()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  // for Auto staking
  const [activeTabAuto, setActiveTabAuto] = useState(0)
  const [modalOpenAuto, setModalOpenAuto] = useState(false)

  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)
  // for Auto staking
  const [inputAuto, setInputAuto] = useState<string>('')
  const [usingBalanceAuto, setUsingBalanceAuto] = useState(false)

  const balance = activeTab === 0 ? cronaBalance : xCronaBalance
  const balanceAuto = activeTabAuto === 0 ? cronaBalance : xCronaBalance

  const formattedBalance = balance?.toSignificant(8)
  const formattedBalanceAuto = balanceAuto?.toSignificant(8)

  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)
  const parsedAmountAuto = usingBalanceAuto ? balanceAuto : tryParseAmount(inputAuto, balanceAuto?.currency)

  const [approvalState, approve] = useApproveCallback(parsedAmount, MASTERCHEF_ADDRESS[chainId])
  const [approvalStateAuto, approveAuto] = useApproveCallback(parsedAmountAuto, CRONAVAULT_ADDRESS[chainId])

  const fullShare = useRef(BIG_ZERO)
  const results = useRef([0, 0, 0, 0])

  // for countdown
  const lastDepositedTime = useRef(0)
  const userSharesValue = useRef(BIG_ZERO)

  const getCronaVault = async () => {
    const autocronaBounty = await cronavaultContract.calculateHarvestCronaRewards()
    const totalstaked = await cronavaultContract.balanceOf()
    const tvlOfManual = await dashboardContract.tvlOfPool(0)
    const userInfo = await cronavaultContract.userInfo(account)
    const userShares = userInfo.shares
    const pricePerFullShare = await cronavaultContract.getPricePerFullShare()
    lastDepositedTime.current = parseInt(userInfo.lastDepositedTime, 10)
    userSharesValue.current = new BigNumber(userShares._hex)
    fullShare.current = new BigNumber(pricePerFullShare._hex)
    const { cronaAsBigNumber, cronaAsNumberBalance } = convertSharesToCrona(
      new BigNumber(userShares._hex),
      new BigNumber(pricePerFullShare._hex)
    )
    setXBalanceAuto(cronaAsNumberBalance)
    const cronaAtLastUserAction = new BigNumber(userInfo.cronaAtLastUserAction._hex)
    const autoCronaProfit = cronaAsBigNumber.minus(cronaAtLastUserAction)
    const recentProfit = autoCronaProfit.gte(0) ? getBalanceNumber(autoCronaProfit, 18) : 0
    const autocronaBountyValue = getBalanceAmount(autocronaBounty._hex, 18).toNumber()
    const totalStakedValue = getBalanceAmount(totalstaked._hex, 18).toNumber()
    const tvlOfManualValue = getBalanceAmount(tvlOfManual.tvl._hex, 18).toNumber() - totalStakedValue
    results.current = [autocronaBountyValue, totalStakedValue, recentProfit, tvlOfManualValue]
  }
  getCronaVault()

  const { secondsRemaining } = useWithdrawalFeeTimer(lastDepositedTime.current, userSharesValue.current, 259200)
  const withdrawalFeeTimer = parseInt(secondsRemaining)
  const d = (withdrawalFeeTimer / 86400) | 0
  const h = ((withdrawalFeeTimer % 86400) / 3600) | 0
  const m = ((withdrawalFeeTimer - 86400 * d - h * 3600) / 60) | 0

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  const handleInputAuto = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalanceAuto(false)
      setInputAuto(v)
    }
  }

  const insufficientFunds = (balance && balance.equalTo(ZERO)) || parsedAmount?.greaterThan(balance)
  const insufficientFundsAuto = (balanceAuto && balanceAuto.equalTo(ZERO)) || Number(inputAuto) > xBalanceAuto

  const inputError = insufficientFunds
  const inputErrorAuto = insufficientFundsAuto

  const [pendingTx, setPendingTx] = useState(false)
  const [pendingTxAuto, setPendingTxAuto] = useState(false)

  const buttonDisabled = !input || pendingTx || (parsedAmount && parsedAmount.equalTo(ZERO))
  const buttonDisabledAuto = !inputAuto || pendingTxAuto || (parsedAmountAuto && parsedAmountAuto.equalTo(ZERO))

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
            return
          }
        }
        const success = await sendTx(() => enterStaking(parsedAmount))
        if (!success) {
          setPendingTx(false)
          return
        }
      } else if (activeTab === 1) {
        const success = await sendTx(() => leaveStaking(parsedAmount))
        if (!success) {
          setPendingTx(false)
          return
        }
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  // for Auto Staking
  const handleClickButtonAuto = async () => {
    if (buttonDisabledAuto) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTxAuto(true)
      if (activeTabAuto === 0) {
        if (approvalStateAuto !== ApprovalState.NOT_APPROVED) {
          try {
            const convertedStakeAmount = getDecimalAmount(new BigNumber(inputAuto), 18)
            const tx = await callWithGasPrice(cronavaultContract, 'deposit', [convertedStakeAmount.toString()], {
              gasLimit: DEFAULT_GAS_LIMIT_AUTO,
            })
            addTransaction(tx, {
              summary: `${i18n._(t`Stake`)} CRONA`,
            })
            setPendingTxAuto(false)
          } catch (error) {
            setPendingTxAuto(false)
          }
        }
      } else if (activeTabAuto === 1) {
        try {
          const convertedStakeAmount = getDecimalAmount(new BigNumber(inputAuto), 18)
          const shareStakeToWithdraw = convertCronaToShares(convertedStakeAmount, fullShare.current)
          const tx = await callWithGasPrice(
            cronavaultContract,
            'withdraw',
            [shareStakeToWithdraw.sharesAsBigNumber.toString()],
            {
              gasLimit: DEFAULT_GAS_LIMIT_AUTO,
            }
          )
          addTransaction(tx, {
            summary: `${i18n._(t`Unstake`)} CRONA`,
          })
          setPendingTxAuto(false)
        } catch (error) {
          setPendingTxAuto(false)
        }
      }

      handleInputAuto('')
      setPendingTxAuto(false)
    }
  }

  const { manualAPY, autoAPY } = getAPY()
  const cronaPrice = getCronaPrice()
  const [pendingBountyTx, setPendingBountyTx] = useState(false)
  const handleBountyClaim = async () => {
    setPendingBountyTx(true)
    try {
      const tx = await callWithGasPrice(cronavaultContract, 'harvest', undefined, { gasLimit: 380000 })
      addTransaction(tx, {
        summary: `${i18n._(t`Claim`)} CRONA`,
      })
      setPendingBountyTx(false)
    } catch (error) {
      console.error(error)
      setPendingBountyTx(false)
    }
  }

  const [pendingHarvestTx, setPendingHarvestTx] = useState(false)
  const options = {
    gasLimit: DEFAULT_GAS_LIMIT,
  }
  const masterChefContract = useMasterChefContract()
  const harvestAmount = useRef(0)
  const getHarvestAmount = async () => {
    harvestAmount.current = await masterChefContract.pendingCrona(0, account)
  }
  getHarvestAmount()
  const gasPrice = useGasPrice()
  const handleHarvestFarm = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingHarvestTx(true)
      try {
        const tx = await masterChefContract.leaveStaking('0', { ...options, gasPrice })
        addTransaction(tx, {
          summary: `${i18n._(t`Harvest`)} CRONA`,
        })
      } catch (e) {
        console.error(e)
      }
      setPendingHarvestTx(false)
    }
  }

  const tooltip = (
    <div>
      <p className="text-base">Unstaking fee: 0.1%</p>
      <p>
        Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every time
        you stake a new CRONA in the pool.
      </p>
    </div>
  )

  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
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
      <div className="w-11/12 m-auto">
        <div className="items-center w-full py-10 mb-12 rounded md:flex bg-dark-400">
          <div className="w-3/4 mx-auto md:w-7/12 gap-y-10">
            <div className="text-2xl font-bold text-white mb-7">{i18n._(t`Crona Stake`)}</div>
            <div className="mb-3 text-base font-hero">
              {i18n._(t`Looking for a less resource-intensive alternative to mining?`)}
              <br />
              {i18n._(t`Use your CRONA tokens to earn more tokens,for Free.`)}
            </div>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfKgvVAO6VwiGkCkc9TzRUJFKPYqzg0siOV6T0oq0ELPz9KLw/viewform"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2 text-sm font-bold font-Poppins">
                <div className="text-light-blue">{i18n._(t`Apply to Launch`)}</div>
                <ArrowRightIcon height={14} className="" />
              </div>
            </a>
          </div>
          <div className="w-3/4 px-4 py-4 m-auto mt-5 rounded-lg md:w-4/12 md:px-10 bg-dark-gray">
            <div className="text-lg text-dark-650">{i18n._(t`Auto Crona Bounty`)}</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl text-white">{`${Number(results.current[0]).toFixed(3)}`}</div>
                <div className="text-base text-light-blue">
                  {`${Number(results.current[0] * cronaPrice).toFixed(3)}`} USD
                </div>
              </div>
              <div className="w-1/3 min-w-max">
                <button
                  className={`${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90 px-1 text-base md:text-lg`}
                  disabled={!results.current[0]}
                  onClick={handleBountyClaim}
                >
                  {pendingBountyTx ? <Dots>{i18n._(t`Claiming`)} </Dots> : i18n._(t`Claim`)}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full gap-4 md:flex">
          {/* Auto Compounding Staking */}
          <div className="w-full grid-rows-2 mx-auto mb-4 md:w-1/2 rounded-2xl gird bg-dark-400 md:m-0">
            <div className="flex items-center justify-between w-full h-[134px] rounded-t-2xl pl-3 pr-3 md:pl-5 md:pr-7 bg-gradient-to-r from-bunting to-blackberry bg-opacity-40">
              <div className="ml-4">
                <p className="mb-3 text-xl font-bold md:text-2xl md:leading-5 text-high-emphesis">
                  {i18n._(t`Auto CRONA`)}
                </p>
                <p className="text-xs font-bold md:text-base md:leading-5 text-dark-650">
                  {i18n._(t`Automatic restaking`)}
                </p>
              </div>
              <DoubleLogo currency0={CRONA[chainId]} currency1={NATIVE[chainId]} size={40} />
            </div>
            <div>
              <TransactionFailedModal isOpen={modalOpenAuto} onDismiss={() => setModalOpenAuto(false)} />
              <div className="w-full px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-6 md:px-8">
                {/* select method */}
                <div className="flex w-full rounded h-14 bg-dark-800">
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setActiveTabAuto(0)
                      handleInputAuto('')
                    }}
                  >
                    <div className={activeTabAuto === 0 ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Stake CRONA`)}</p>
                    </div>
                  </div>
                  <div
                    className="h-full w-6/12 p-0.5"
                    onClick={() => {
                      setActiveTabAuto(1)
                      handleInputAuto('')
                    }}
                  >
                    <div className={activeTabAuto === 1 ? activeTabStyle : inactiveTabStyle}>
                      <p>{i18n._(t`Unstake`)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-6">
                  <p className="font-bold text-large md:text-2xl text-high-emphesis">
                    {activeTabAuto === 0 ? i18n._(t`Stake CRONA`) : i18n._(t`Unstake`)}
                  </p>
                  <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                    <p className="text-dark-650">{i18n._(t`Balance`)}:&nbsp;</p>
                    <p className="text-base font-bold">
                      {activeTabAuto === 0 ? formattedBalanceAuto : xBalanceAuto.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* CRONA Amount Input */}
                <Input.Numeric
                  value={inputAuto}
                  onUserInput={handleInputAuto}
                  className={classNames(
                    'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis',
                    inputErrorAuto ? ' pl-10 md:pl-12' : ''
                  )}
                  placeholder=" "
                />

                {/* input overlay: */}
                <div className="relative w-full h-0 pointer-events-none bottom-14">
                  <div
                    className={`flex justify-between items-center h-14 rounded px-3 md:px-5 ${
                      inputErrorAuto ? ' border border-red' : ''
                    }`}
                  >
                    <div className="flex space-x-2 ">
                      {inputErrorAuto && (
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
                          inputAuto ? 'text-high-emphesis' : 'text-secondary'
                        }`}
                      >
                        {`${inputAuto ? inputAuto : '0'} ${activeTabAuto === 0 ? '' : 'x'}CRONA`}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-secondary md:text-base">
                      <button
                        className="px-2 py-1 ml-3 text-xs font-bold border pointer-events-auto focus:outline-none focus:ring hover:bg-opacity-40 md:bg-cyan-blue md:bg-opacity-30 border-secondary md:border-cyan-blue rounded-2xl md:py-1 md:px-3 md:ml-4 md:text-sm md:font-normal md:text-cyan-blue"
                        onClick={() => {
                          if (!balanceAuto.equalTo(ZERO)) {
                            setInputAuto(balanceAuto?.toSignificant(balanceAuto.currency.decimals))
                          }
                        }}
                      >
                        {i18n._(t`MAX`)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                {(approvalStateAuto === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
                activeTabAuto === 0 ? (
                  <Button
                    color="gradient"
                    className={`${buttonStyle} text-high-emphesis`}
                    disabled={approvalStateAuto === ApprovalState.PENDING}
                    onClick={approveAuto}
                  >
                    {approvalStateAuto === ApprovalState.PENDING ? (
                      <Dots>{i18n._(t`Approving`)} </Dots>
                    ) : (
                      i18n._(t`Approve`)
                    )}
                  </Button>
                ) : (
                  <button
                    className={
                      buttonDisabledAuto
                        ? buttonStyleDisabled
                        : !walletConnected
                        ? buttonStyleConnectWallet
                        : insufficientFundsAuto
                        ? buttonStyleInsufficientFunds
                        : buttonStyleEnabled
                    }
                    onClick={handleClickButtonAuto}
                    disabled={buttonDisabledAuto || inputErrorAuto}
                  >
                    {!walletConnected
                      ? i18n._(t`Connect Wallet`)
                      : !inputAuto
                      ? i18n._(t`Enter Amount`)
                      : insufficientFundsAuto
                      ? i18n._(t`Insufficient Balance`)
                      : activeTabAuto === 0
                      ? i18n._(t`Confirm Staking`)
                      : i18n._(t`Confirm Withdrawal`)}
                  </button>
                )}
              </div>
              <div className="grid grid-rows-2 px-3 gap-y-2 md:px-8">
                <div className="flex justify-between text-base">
                  <p className="text-dark-650">Recent CRONA profit</p>
                  <p className="font-bold text-right text-aqua-pearl">{`${Number(results.current[2].toFixed(2))}`}</p>
                </div>
                <div className="flex justify-between text-base">
                  <p className="flex items-center text-dark-650">
                    0.1% unstakng fee until
                    <QuestionHelper text={tooltip} />
                  </p>
                  <p className="font-bold text-right text-aqua-pearl">
                    {`${d}`}d: {`${h}`}h : {`${m}`}m
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-4 px-3 mt-6 py-6 border-t-[1px] border-dark-800 gap-y-2 md:px-8">
              <div className="flex justify-between text-base">
                <p className="text-dark-650">APY</p>
                <p className="font-bold text-right text-high-emphesis">
                  {`${autoAPY ? autoAPY.toFixed(2) + '%' : i18n._(t`Loading...`)}`}
                </p>
              </div>
              <div className="flex justify-between text-base">
                <p className="text-dark-650">Perfomance fee</p>
                <p className="font-bold text-right text-high-emphesis">2.99%</p>
              </div>
              <div className="flex justify-between text-base">
                <p className="text-dark-650">Total staked</p>
                <p className="font-bold text-right text-high-emphesis">
                  {`${Number(results.current[1]).toFixed(0)}`} CRONA
                </p>
              </div>
              <div className="flex justify-between text-base">
                <p className="text-dark-650">See Token Info</p>
                <a
                  href="https://app.cronaswap.org/info/token/0xadbd1231fb360047525BEdF962581F3eee7b49fe"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold"
                >
                  {i18n._(t`View Contract`)}
                </a>
              </div>
            </div>
          </div>
          {/* Manual Staking */}
          <div className="w-full grid-rows-2 mx-auto mb-4 md:w-1/2 rounded-2xl gird bg-dark-400 md:m-0">
            <div className="flex items-center justify-between w-full h-[134px] rounded-t-2xl pl-3 pr-3 md:pl-5 md:pr-7 bg-gradient-to-r from-Mardi-Gras to-Myrtle">
              <div className="ml-4">
                <p className="mb-3 text-xl font-bold md:text-2xl md:leading-5 text-high-emphesis">
                  {i18n._(t`Manual CRONA`)}
                </p>
                <p className="text-xs font-bold md:text-base md:leading-5 text-dark-650">
                  {i18n._(t`Earn CRONA, Stake CRONA`)}
                </p>
              </div>
              <DoubleLogo currency0={CRONA[chainId]} currency1={NATIVE[chainId]} size={40} />
            </div>
            <div>
              <TransactionFailedModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
              <div className="w-full px-3 pt-2 pb-6 rounded bg-dark-900 md:pb-9 md:pt-6 md:px-8">
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
                  <div className={input ? 'hidden md:flex md:items-center' : 'flex items-center'}>
                    <p className="text-dark-650">{i18n._(t`Balance`)}:&nbsp;</p>
                    <p className="text-base font-bold">{formattedBalance}</p>
                  </div>
                </div>

                {/* CRONA Amount Input */}
                <Input.Numeric
                  value={input}
                  onUserInput={handleInput}
                  className={classNames(
                    'w-full h-14 px-3 md:px-5 mt-5 rounded bg-dark-800 text-sm md:text-lg font-bold text-dark-800 whitespace-nowrap caret-high-emphesis',
                    inputError ? ' pl-10 md:pl-12' : ''
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

                {/* Confirm Button */}
                {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) &&
                activeTab === 0 ? (
                  <Button
                    color="gradient"
                    className={`${buttonStyle} text-high-emphesis`}
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
                <Button
                  color="gradient"
                  className={activeTab ? buttonStyleDisabled : buttonStyleEnabled}
                  onClick={handleHarvestFarm}
                  disabled={activeTab !== 0 && walletConnected}
                >
                  {!walletConnected
                    ? i18n._(t`Connect Wallet`)
                    : pendingHarvestTx
                    ? i18n._(t`Harvesting`)
                    : i18n._(t`Harvest (${formatNumber(harvestAmount.current?.toFixed(18))})`)}
                </Button>
              </div>
            </div>
            <div className="grid grid-rows-4 px-3 mt-[5px] py-6 border-t-[1px] border-dark-800 gap-y-2 md:px-8">
              <div className="flex justify-between text-base">
                <p className="text-dark-650">APY</p>
                <p className="font-bold text-right text-high-emphesis">
                  {`${manualAPY ? manualAPY.toFixed(2) + '%' : i18n._(t`Loading...`)}`}
                </p>
              </div>
              <div className="flex justify-between text-base">
                <p className="text-dark-650">Perfomance fee</p>
                <p className="font-bold text-right text-high-emphesis">0.00%</p>
              </div>
              <div className="flex justify-between text-base">
                <p className="text-dark-650">Total staked</p>
                <p className="font-bold text-right text-high-emphesis">
                  {`${Number(results.current[3]).toFixed(0)}`} CRONA
                </p>
              </div>
              <div className="flex justify-between text-base">
                <p className="text-dark-650">See Token Info</p>
                <a
                  href="https://app.cronaswap.org/info/token/0xadbd1231fb360047525BEdF962581F3eee7b49fe"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold"
                >
                  {i18n._(t`View Contract`)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
