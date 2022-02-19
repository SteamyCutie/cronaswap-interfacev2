import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { MASTERCHEF_ADDRESS, ZERO, NATIVE } from '@cronaswap/core-sdk'
import React, { useState, useRef } from 'react'
import { CRONA, XCRONA } from '../../config/tokens'
import Button from '../../components/Button'
import Dots from '../../components/Dots'
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
import { classNames, formatNumber, getExplorerLink } from '../../functions'
import { useCronaVaultContract, useDashboardV1Contract, useMasterChefContract } from 'hooks/useContract'
import DoubleLogo from '../../components/DoubleLogo'
import { useGasPrice } from 'state/user/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { getBalanceAmount } from 'functions/formatBalance'
import { getAPY } from 'features/staking/useStaking'
import { BigNumber } from 'bignumber.js'
import { CalculatorIcon } from '@heroicons/react/solid'
import ROICalculatorModal from 'app/components/ROICalculatorModal'

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

export default function ManualPoolCard() {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  const cronaBalance = useTokenBalance(account ?? undefined, CRONA[chainId])
  const xCronaBalance = useTokenBalance(account ?? undefined, XCRONA[chainId])
  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  const DEFAULT_GAS_LIMIT = 250000

  const dashboardContract = useDashboardV1Contract()
  const cronavaultContract = useCronaVaultContract()
  const { enterStaking, leaveStaking } = useCronaBar()

  const [activeTab, setActiveTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)

  const balance = activeTab === 0 ? cronaBalance : xCronaBalance

  const formattedBalance = balance?.toSignificant(8)

  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)
  const [approvalState, approve] = useApproveCallback(parsedAmount, MASTERCHEF_ADDRESS[chainId])

  const results = useRef(0)
  const getCronaVault = async () => {
    const totalstaked = await cronavaultContract.balanceOf()
    const tvlOfManual = await dashboardContract.tvlOfPool(0)
    const totalStakedValue = getBalanceAmount(totalstaked._hex, 18).toNumber()
    const tvlOfManualValue = getBalanceAmount(tvlOfManual.tvl._hex, 18).toNumber() - totalStakedValue
    results.current = tvlOfManualValue
  }
  getCronaVault()

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
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

  const { manualAPY } = getAPY()

  const [pendingHarvestTx, setPendingHarvestTx] = useState(false)
  const options = {
    gasLimit: DEFAULT_GAS_LIMIT,
  }
  const masterChefContract = useMasterChefContract()
  const harvestAmount = useRef(0)
  const getHarvestAmount = async () => {
    if (account) {
      harvestAmount.current = await masterChefContract.pendingCrona(0, account)
    }
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

  const [pendingCompundTx, setPendingCompundTx] = useState(false)
  const handleCompoundFarm = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingCompundTx(true)
      try {
        const tx = await masterChefContract.enterStaking(harvestAmount.current, { ...options, gasPrice })
        addTransaction(tx, {
          summary: `${i18n._(t`Compound`)} CRONA`,
        })
      } catch (e) {
        console.error(e)
      }
      setPendingCompundTx(false)
    }
  }

  const [showCalc, setShowCalc] = useState(false)
  const stakedAmount = Number(xCronaBalance?.toSignificant(8))
  const lpBalnce = !stakedAmount ? 0 : stakedAmount

  return (
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
              {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)} </Dots> : i18n._(t`Approve`)}
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
          {harvestAmount.current > 0 ? (
            <div className="flex gap-2">
              <Button color="gradient" className={`${buttonStyleEnabled} w-1/2`} onClick={handleCompoundFarm}>
                {!walletConnected ? (
                  i18n._(t`Connect Wallet`)
                ) : pendingCompundTx ? (
                  <Dots>{i18n._(t`Compounding`)}</Dots>
                ) : (
                  `Compound (${formatNumber(harvestAmount.current?.toFixed(18))})`
                )}
              </Button>
              <Button color="gradient" className={`${buttonStyleEnabled} w-1/2`} onClick={handleHarvestFarm}>
                {!walletConnected ? (
                  i18n._(t`Connect Wallet`)
                ) : pendingHarvestTx ? (
                  <Dots>{i18n._(t`Harvesting`)}</Dots>
                ) : (
                  `Harvest (${formatNumber(harvestAmount.current?.toFixed(18))})`
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className={`${buttonStyleDisabled} w-1/2`} disabled={true}>
                {!walletConnected ? i18n._(t`Connect Wallet`) : i18n._(t`Compound`)}
              </button>
              <button className={`${buttonStyleDisabled} w-1/2`} disabled={true}>
                {!walletConnected ? i18n._(t`Connect Wallet`) : i18n._(t`Harvest`)}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-rows-4 px-3 mt-[5px] py-6 border-t-[1px] border-dark-800 gap-y-2 md:px-8">
        <div className="flex justify-between text-base">
          <p className="text-dark-650">APY</p>
          <div className="flex items-center">
            <p className="font-bold text-right text-high-emphesis">
              {`${manualAPY ? manualAPY.toFixed(2) + '%' : i18n._(t`Loading...`)}`}
            </p>
            <CalculatorIcon className="w-5 h-5" onClick={() => setShowCalc(true)} />
          </div>
          <ROICalculatorModal
            isfarm={false}
            isOpen={showCalc}
            onDismiss={() => setShowCalc(false)}
            showBoost={false}
            showCompound={true}
            name={'CRONA'}
            apr={manualAPY}
            Lpbalance={lpBalnce}
          />
        </div>
        <div className="flex justify-between text-base">
          <p className="text-dark-650">Perfomance fee</p>
          <p className="font-bold text-right text-high-emphesis">0.00%</p>
        </div>
        <div className="flex justify-between text-base">
          <p className="text-dark-650">Total staked</p>
          <p className="font-bold text-right text-high-emphesis">{`${Number(results.current).toFixed(0)}`} CRONA</p>
        </div>
        <div className="flex justify-between text-base">
          <p className="text-dark-650">See Contract Info</p>
          <a
            href={chainId && getExplorerLink(chainId, MASTERCHEF_ADDRESS[chainId], 'address')}
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
