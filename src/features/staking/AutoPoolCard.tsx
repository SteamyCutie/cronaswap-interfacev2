import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { ZERO, NATIVE } from '@cronaswap/core-sdk'
import React, { useState, useRef } from 'react'
import { CRONA, XCRONA } from '../../config/tokens'
import BigNumber from 'bignumber.js'
import Button from '../../components/Button'
import Dots from '../../components/Dots'
import Image from 'next/image'
import Input from '../../components/Input'
import TransactionFailedModal from '../../modals/TransactionFailedModal'
import { t } from '@lingui/macro'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../services/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useLingui } from '@lingui/react'
import { useTokenBalance } from '../../state/wallet/hooks'
import { classNames, formatBalance } from '../../functions'
import { useCronaVaultContract } from 'hooks/useContract'
import DoubleLogo from '../../components/DoubleLogo'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { getDecimalAmount, getBalanceNumber, getBalanceAmount } from 'functions/formatBalance'
import { getAPY, convertSharesToCrona, convertCronaToShares, useWithdrawalFeeTimer } from 'features/staking/useStaking'
import { CRONAVAULT_ADDRESS } from 'constants/addresses'
import { BIG_ZERO } from 'app/functions/bigNumber'
import QuestionHelper from 'app/components/QuestionHelper'

const INPUT_CHAR_LIMIT = 18

const tabStyle = 'flex justify-center items-center h-full w-full rounded-lg cursor-pointer text-sm md:text-base'
const activeTabStyle = `${tabStyle} text-high-emphesis font-bold bg-dark-900`
const inactiveTabStyle = `${tabStyle} text-secondary`

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`
const buttonStyleInsufficientFunds = `${buttonStyleEnabled} opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonStyleConnectWallet = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-90`

export default function AutoPoolCard() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const cronaBalance = useTokenBalance(account ?? undefined, CRONA[chainId])
  const xCronaBalance = useTokenBalance(account ?? undefined, XCRONA[chainId])
  const [xBalanceAuto, setXBalanceAuto] = useState(0)
  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  const DEFAULT_GAS_LIMIT_AUTO = 400000

  const cronavaultContract = useCronaVaultContract()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [activeTabAuto, setActiveTabAuto] = useState(0)
  const [modalOpenAuto, setModalOpenAuto] = useState(false)

  const [inputAuto, setInputAuto] = useState<string>('')
  const [usingBalanceAuto, setUsingBalanceAuto] = useState(false)

  const balanceAuto = activeTabAuto === 0 ? cronaBalance : xCronaBalance

  const formattedBalanceAuto = balanceAuto?.toSignificant(8)

  const parsedAmountAuto = usingBalanceAuto ? balanceAuto : tryParseAmount(inputAuto, balanceAuto?.currency)

  const [approvalStateAuto, approveAuto] = useApproveCallback(parsedAmountAuto, CRONAVAULT_ADDRESS[chainId])

  const fullShare = useRef(BIG_ZERO)
  const results = useRef([0, 0])

  // for countdown
  const lastDepositedTime = useRef(0)
  const userSharesValue = useRef(BIG_ZERO)

  const getCronaVault = async () => {
    const totalstaked = await cronavaultContract.balanceOf()
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
    const totalStakedValue = getBalanceAmount(totalstaked._hex, 18).toNumber()
    results.current = [totalStakedValue, recentProfit]
  }
  getCronaVault()

  const { secondsRemaining } = useWithdrawalFeeTimer(lastDepositedTime.current, userSharesValue.current, 259200)
  const withdrawalFeeTimer = parseInt(secondsRemaining)
  const d = (withdrawalFeeTimer / 86400) | 0
  const h = ((withdrawalFeeTimer % 86400) / 3600) | 0
  const m = ((withdrawalFeeTimer - 86400 * d - h * 3600) / 60) | 0

  const handleInputAuto = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalanceAuto(false)
      setInputAuto(v)
    }
  }

  const insufficientFundsAuto =
    (activeTabAuto === 0 && balanceAuto && balanceAuto.equalTo(ZERO)) ||
    (activeTabAuto !== 0 && xBalanceAuto && xBalanceAuto === 0) ||
    (activeTabAuto === 0 && parsedAmountAuto?.greaterThan(balanceAuto)) ||
    (activeTabAuto !== 0 && Number(inputAuto) > xBalanceAuto)
  const inputErrorAuto = insufficientFundsAuto

  const [pendingTxAuto, setPendingTxAuto] = useState(false)
  const buttonDisabledAuto = !inputAuto || pendingTxAuto || (parsedAmountAuto && parsedAmountAuto.equalTo(ZERO))

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
            const tx = await callWithGasPrice(cronavaultContract, 'deposit', [convertedStakeAmount.toFixed()], {
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
            [shareStakeToWithdraw.sharesAsBigNumber.toFixed()],
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

  const { autoAPY } = getAPY()

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
    <div className="w-full grid-rows-2 mx-auto mb-4 md:w-1/2 rounded-2xl gird bg-dark-400 md:m-0">
      <div className="flex items-center justify-between w-full h-[134px] rounded-t-2xl pl-3 pr-3 md:pl-5 md:pr-7 bg-gradient-to-r from-bunting to-blackberry bg-opacity-40">
        <div className="ml-4">
          <p className="mb-3 text-xl font-bold md:text-2xl md:leading-5 text-high-emphesis">{i18n._(t`Auto CRONA`)}</p>
          <p className="text-xs font-bold md:text-base md:leading-5 text-dark-650">{i18n._(t`Automatic restaking`)}</p>
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
            <div className={inputAuto ? 'hidden md:flex md:items-center' : 'flex items-center'}>
              <p className="text-dark-650">{i18n._(t`Balance`)}:&nbsp;</p>
              <p className="text-base font-bold">
                {activeTabAuto === 0 ? formattedBalanceAuto : xBalanceAuto ? xBalanceAuto.toFixed(2) : 0}
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
                    if (activeTabAuto === 0) {
                      if (!balanceAuto.equalTo(ZERO)) {
                        setInputAuto(balanceAuto?.toSignificant(balanceAuto.currency.decimals))
                      }
                    } else {
                      if (xBalanceAuto) {
                        setInputAuto(xBalanceAuto.toString())
                      }
                    }
                  }}
                >
                  {i18n._(t`MAX`)}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          {(approvalStateAuto === ApprovalState.NOT_APPROVED || approvalStateAuto === ApprovalState.PENDING) &&
          activeTabAuto === 0 ? (
            <Button
              color="gradient"
              className={`${buttonStyle} text-high-emphesis`}
              disabled={approvalStateAuto === ApprovalState.PENDING}
              onClick={approveAuto}
            >
              {approvalStateAuto === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)} </Dots> : i18n._(t`Approve`)}
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
            <p className="font-bold text-right text-aqua-pearl">{`${Number(results.current[1].toFixed(2))}`}</p>
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
          <p className="font-bold text-right text-high-emphesis">{`${Number(results.current[0]).toFixed(0)}`} CRONA</p>
        </div>
        <div className="flex justify-between text-base">
          <p className="text-dark-650">See Contract Info</p>
          <a
            href="https://cronoscan.com/address/0xDf3EBc46F283eF9bdD149Bb24c9b201a70d59389"
            target="_blank"
            rel="noreferrer"
            className="font-bold"
          >
            {i18n._(t`View Contract`)}
          </a>
        </div>
      </div>
    </div>
  )
}
