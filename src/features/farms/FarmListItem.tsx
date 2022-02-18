import { Token } from '@cronaswap/core-sdk'
import { classNames, formatNumber, formatPercent, formatNumberScale } from '../../functions'
import React, { useState } from 'react'
import { useCurrency } from '../../hooks/Tokens'
import { useTokenBalance } from '../../state/wallet/hooks'
import { Disclosure } from '@headlessui/react'
import {
  ChevronDownIcon,
  LockClosedIcon,
  CalculatorIcon,
  SwitchVerticalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
} from '@heroicons/react/solid'
import { ExternalLink as LinkIcon } from 'react-feather'
import ExternalLink from '../../components/ExternalLink'
import FarmListItemDetails from './FarmListItemDetails'
import { usePendingCrona } from './hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { getAddress } from '@ethersproject/address'

import QuestionHelper from '../../components/QuestionHelper'
import { CurrencyLogoArray } from '../../components/CurrencyLogo'
import Dots from 'app/components/Dots'
import Modal from './../../components/Modal/index'
import ModalHeader from './../../components/ModalHeader/index'
import Typography from 'app/components/Typography'
import Input from 'components/Input'
import Lottie from 'lottie-react'
import Checkbox from 'app/components/Checkbox'
import Button from 'app/components/Button'
import { CRONAVAULT_ADDRESS } from 'constants/addresses'
import { getCronaPrice, aprToApy } from 'features/staking/useStaking'
import { useActiveWeb3React } from 'app/services/web3'
import { AbiCoder } from '@ethersproject/abi'

const buttonStyle =
  'flex justify-center items-center w-full h-8 rounded-2xl font-bold md:font-medium md:text-sm text-xs focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonUnselected = `${buttonStyle} text-secondary text-white bg-dark-700`

const FarmListItem = ({ farm, ...rest }) => {
  const { i18n } = useLingui()

  let token0 = useCurrency(farm.token0?.id)
  let token1 = useCurrency(farm.token1?.id)

  const pendingCrona = usePendingCrona(farm)

  const [showCalc, setShowCalc] = useState(false)
  const [usdvalue, setUsdValue] = useState(0)
  const [lpvalue, setLpValue] = useState(0)
  const [editingCurrency, setEditingCurrency] = useState('usd')
  const [stakedPeriod, setStakedPeriod] = useState(365)
  const [isCompounding, setIsCompounding] = useState(true)
  const [compoundingPeriod, setCompoundingPeriod] = useState(1)
  const [isExpand, setIsExpand] = useState(false)
  const [isBoost, setIsBoost] = useState(false)

  const MyLpBalance = (farm) => {
    const { account, chainId } = useActiveWeb3React()

    if (!account) {
      return 0
    }
    const liquidityToken = new Token(
      chainId,
      getAddress(farm.lpToken),
      farm.token1 ? 18 : farm.token0 ? farm.token0.decimals : 18,
      farm.token1 ? farm.symbol : farm.token0.symbol,
      farm.token1 ? farm.name : farm.token0.name
    )

    const balance = useTokenBalance(account, liquidityToken)
    return Number(formatNumberScale(balance?.toSignificant(6, undefined, 4) ?? 0, false, 4))
  }

  const Lpbalance = MyLpBalance(farm)

  const ROIcalculator = (principal: number, apr: number) => {
    const aprAsDecimal = isBoost ? apr / 40 : apr / 100
    const daysAsDecimalOfYear = stakedPeriod / 365
    const timesCompounded = 365 / compoundingPeriod
    if (isCompounding === false) {
      const ROI = principal * aprAsDecimal * daysAsDecimalOfYear
      const cronaPriceInUSD = getCronaPrice()
      const ROIInTokens = ROI.toFixed(3)
      const ROIPercentage = ((ROI / usdvalue) * 100).toFixed(2)
      return { ROI, ROIInTokens, ROIPercentage }
    }
    const ROI = principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - principal
    const cronaPriceInUSD = getCronaPrice()
    const ROIInTokens = (ROI / cronaPriceInUSD).toFixed(3)
    const ROIPercentage = usdvalue === 0 ? '0' : ((ROI / usdvalue) * 100).toFixed(2)
    return { ROI, ROIInTokens, ROIPercentage }
  }

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button
            className={classNames(
              open && 'rounded-b-none',
              'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
            )}
          >
            <div className="flex gap-x-2">
              {/* Token logo */}
              <div className="flex items-center w-1/2 col-span-2 space-x-4 lg:gap-5 lg:w-3/12 lg:col-span-1">
                {/* <DoubleLogo currency0={token0} currency1={token1} size={window.innerWidth > 768 ? 40 : 24} /> */}
                {token0 && token1 && (
                  <CurrencyLogoArray currencies={[token0, token1]} dense size={window.innerWidth > 968 ? 40 : 28} />
                )}
                <div className="flex flex-col justify-center">
                  <div className="text-xs md:text-[12px] text-blue">
                    {formatNumber(pendingCrona?.toFixed(18)) != '0' ? `FARMING` : ``}
                  </div>
                  <div className="text-xs font-bold md:text-base">{farm?.name}</div>
                  {farm?.migrate ? <div className="text-xs text-pink">{i18n._(t`Migrating`)}</div> : <></>}
                  {farm?.isCommunity && (
                    <span className="inline-flex ml-0 mr-auto items-center px-2 rounded-full text-xs bg-dark-800 text-gray">
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-gray" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx={4} cy={4} r={3} />
                      </svg>
                      Community
                    </span>
                  )}
                </div>
              </div>

              {/* Earned */}
              <div className="flex flex-col justify-center w-2/12 space-y-1">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Earned`)}</div>
                <div className="text-xs font-bold md:text-base">{formatNumber(pendingCrona?.toFixed(18))}</div>
              </div>

              {/* Liquidity */}
              <div className="flex-col justify-center hidden space-y-1 lg:w-2/12 lg:block">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Liquidity`)}</div>
                <div className="text-xs font-bold md:text-base">{formatNumber(farm.tvl, true)}</div>
              </div>

              {/* Multiplier */}
              <div className="flex-col justify-center hidden space-y-1 lg:w-2/12 lg:block">
                {/* <div className="text-xs md:text-base text-secondary">{i18n._(t`Multiplier`)}</div> */}
                <div className="flex items-center text-xs md:text-[14px] text-secondary">
                  {i18n._(t`Multiplier`)}
                  <QuestionHelper text="The Multiplier represents the proportion of CRONA rewards each farm receives, as a proportion of the CRONA produced each block. For example, if a 1x farm received 1 CRONA per block, a 40x farm would receive 40 CRONA per block. This amount is already included in all APR calculations for the farm." />
                </div>
                <div className="text-xs font-bold md:text-base">{farm.multiplier / 100}x</div>
              </div>

              {/* APR */}
              {farm.chef === 0 ? (
                <div className="flex flex-col justify-center w-2/12 space-y-1 lg:w-1/12">
                  <div className="text-xs md:text-[14px] text-secondary">APR</div>
                  <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr)} </div>
                </div>
              ) : (
                // <div className="flex flex-col justify-center w-2/12 lg:w-3/12">
                //   <div className="text-xs md:text-base text-secondary">vAPR</div>
                //   <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr)} (proj. 332.91%)<LockClosedIcon className="h-4" /></div>
                // </div>

                <div className="flex flex-col justify-center w-2/12 space-y-1 lg:w-2/12">
                  <div className="text-xs md:text-[14px] text-secondary">
                    <div className="flex items-center">
                      APR{' '}
                      <QuestionHelper text="vAPR stands for “Variable Annual Percentage Rate”: it is the interest you’d earn on your deposits for a whole year, and it’s variable because it depends on today’s trading activity in this pool, the price of the assets you deposit, the price of the assets you’re rewarded with, and the current rewards rates." />
                    </div>
                  </div>

                  <div className="items-center md:flex">
                    <div className="text-xs font-bold md:text-base" onClick={() => setShowCalc(true)}>
                      {formatPercent(farm.apr)}
                    </div>
                    <CalculatorIcon className="w-5 h-5" onClick={() => setShowCalc(true)} />
                    {/* <div className="flex items-center">
                      <LockClosedIcon className="h-4 text-yellow" />
                      <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr*1.01)} → {formatPercent(farm.boostApr)}</div>
                    </div> */}
                  </div>
                </div>
              )}

              {/* Boost APR */}
              {farm.chef === 1 ? (
                <div className="flex-col justify-center w-2/12 space-y-1 lg:w-2/12">
                  <div className="text-xs md:text-[14px] text-secondary">
                    <div className="flex items-center">
                      Boost APR{' '}
                      <QuestionHelper text="vAPR stands for “Variable Annual Percentage Rate”: it is the interest you’d earn on your deposits for a whole year, and it’s variable because it depends on today’s trading activity in this pool, the price of the assets you deposit, the price of the assets you’re rewarded with, and the current rewards rates." />
                    </div>
                  </div>

                  <div className="md:flex">
                    {/* <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr)} / </div> */}
                    <div className="flex items-center">
                      <LockClosedIcon className="h-4 text-yellow" />
                      {/* <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr*1.01)} → {formatPercent(farm.boostApr)}</div> */}
                      <div className="text-xs font-bold md:text-base">
                        {formatPercent(farm.boostApr)} → {formatPercent(farm.apr * 2.5)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="flex flex-col items-center justify-center lg:w-1/12">
                <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`} />
              </div>
            </div>
            <Modal isOpen={showCalc} maxWidth={500} onDismiss={() => setShowCalc(false)}>
              <div className="pr-2 space-y-2 overflow-y-auto max-h-96 md:max-h-[480px] lg:max-h-[540px]">
                <ModalHeader title={i18n._(t`ROI Calculator`)} onClose={() => setShowCalc(false)} />
                <div className="py-2">
                  <div className="flex items-center justify-between text-sm">
                    <Typography variant="sm">
                      {farm?.name} {i18n._(t`LP Staked`)}
                    </Typography>
                    <div className="flex gap-1">
                      <Typography variant="sm">{i18n._(t`Max Boost Apr:`)}</Typography>
                      <Checkbox checked={isBoost} color="blue" set={() => setIsBoost(!isBoost)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 mb-2 rounded-md bg-dark-800">
                    <div className="w-11/12">
                      <div className="flex items-end w-full p-3 space-x-3 focus:bg-dark-700">
                        <Input.Numeric
                          id="token-amount-input"
                          value={editingCurrency === 'usd' ? usdvalue : lpvalue}
                          className="h-6 bg-dark-800 text-blue"
                          onUserInput={(val) => {
                            editingCurrency === 'usd'
                              ? (setUsdValue(Number(val)), setLpValue(Number(val) / farm?.lpPrice))
                              : (setLpValue(Number(val)), setUsdValue(Number(val) * farm?.lpPrice))
                          }}
                        />
                        <div className="text-sm text-right md:text-base">
                          {editingCurrency === 'lp' ? farm?.name + ' ' + i18n._(t` LP`) : 'USD'}
                        </div>
                      </div>
                      <div className="flex items-end justify-between w-full p-3 space-x-3 text-sm focus:bg-dark-700">
                        <div className="h-5 ">{editingCurrency === 'lp' ? usdvalue : lpvalue}</div>
                        <div className="text-xs text-right md:text-sm">
                          {editingCurrency === 'usd' ? farm?.name + ' ' + i18n._(t` LP`) : 'USD'}
                        </div>
                      </div>
                    </div>
                    <SwitchVerticalIcon
                      className="w-1/12 mx-auto h-7"
                      onClick={() => {
                        editingCurrency === 'usd' ? setEditingCurrency('lp') : setEditingCurrency('usd')
                        console.log('++++')
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between px-2 mb-2">
                    <button
                      className={`${buttonStyle} bg-dark-500 w-10 md:w-20`}
                      onClick={() => {
                        setUsdValue(100), setLpValue(100 / farm?.lpPrice)
                      }}
                    >
                      $100
                    </button>
                    <button
                      className={`${buttonStyle} bg-dark-500 w-10 md:w-20`}
                      onClick={() => {
                        setUsdValue(1000), setLpValue(1000 / farm?.lpPrice)
                      }}
                    >
                      $1000
                    </button>
                    <button
                      className={`${Lpbalance === 0 ? buttonStyleDisabled : buttonStyle} bg-dark-500 w-20 md:w-24`}
                      disabled={Lpbalance === 0}
                      onClick={() => {
                        setLpValue(Lpbalance), setUsdValue(Lpbalance * farm.lpPrice)
                      }}
                    >
                      My balance
                    </button>
                    {/* Need to be fixed */}
                    <QuestionHelper text="“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm." />
                  </div>

                  <Typography variant="sm">
                    {farm?.name} {i18n._(t`Staked for`)}
                  </Typography>
                  <div className="grid grid-cols-5 gap-2 mt-2 mb-4">
                    <button
                      className={`${stakedPeriod === 1 ? buttonStyleEnabled : buttonUnselected} px-2 mx-auto md:px-4`}
                      onClick={() => setStakedPeriod(1)}
                    >
                      1D
                    </button>
                    <button
                      className={`${stakedPeriod === 7 ? buttonStyleEnabled : buttonUnselected} px-2 mx-auto md:px-4`}
                      onClick={() => setStakedPeriod(7)}
                    >
                      7D
                    </button>
                    <button
                      className={`${stakedPeriod === 30 ? buttonStyleEnabled : buttonUnselected} px-2 mx-auto md:px-4`}
                      onClick={() => setStakedPeriod(30)}
                    >
                      30D
                    </button>
                    <button
                      className={`${stakedPeriod === 365 ? buttonStyleEnabled : buttonUnselected} px-2 mx-auto md:px-4`}
                      onClick={() => setStakedPeriod(365)}
                    >
                      1Y
                    </button>
                    <button
                      className={`${
                        stakedPeriod === 365 * 5 ? buttonStyleEnabled : buttonUnselected
                      } px-2 mx-auto md:px-4`}
                      onClick={() => setStakedPeriod(365 * 5)}
                    >
                      5Y
                    </button>
                  </div>

                  <Typography variant="sm">
                    {farm?.name} {i18n._(t`Compounding Every`)}
                  </Typography>
                  <div className="grid grid-cols-5 gap-2 mt-2 mb-3">
                    <div className="m-auto">
                      <Checkbox
                        checked={isCompounding}
                        className="items-end justify-center w-8 h-8"
                        color="blue"
                        set={() => setIsCompounding(!isCompounding)}
                      />
                    </div>
                    <button
                      className={`${
                        isCompounding
                          ? compoundingPeriod === 1
                            ? buttonStyleEnabled
                            : buttonUnselected
                          : buttonStyleDisabled
                      } px-2 mx-auto md:px-4`}
                      disabled={!isCompounding}
                      onClick={() => setCompoundingPeriod(1)}
                    >
                      1D
                    </button>
                    <button
                      className={`${
                        isCompounding
                          ? compoundingPeriod === 7
                            ? buttonStyleEnabled
                            : buttonUnselected
                          : buttonStyleDisabled
                      } px-2 mx-auto md:px-4`}
                      disabled={!isCompounding}
                      onClick={() => setCompoundingPeriod(7)}
                    >
                      7D
                    </button>
                    <button
                      className={`${
                        isCompounding
                          ? compoundingPeriod === 14
                            ? buttonStyleEnabled
                            : buttonUnselected
                          : buttonStyleDisabled
                      } px-2 mx-auto md:px-4`}
                      disabled={!isCompounding}
                      onClick={() => setCompoundingPeriod(14)}
                    >
                      14D
                    </button>
                    <button
                      className={`${
                        isCompounding
                          ? compoundingPeriod === 30
                            ? buttonStyleEnabled
                            : buttonUnselected
                          : buttonStyleDisabled
                      } px-2 mx-auto md:px-4`}
                      disabled={!isCompounding}
                      onClick={() => setCompoundingPeriod(30)}
                    >
                      30D
                    </button>
                  </div>
                  <ArrowDownIcon className="h-6 mx-auto mb-3" />

                  <div className="p-2 space-y-1 rounded-lg bg-dark-800">
                    <Typography variant="sm" className="text-cyan-blue">
                      {i18n._(t`ROI AT CURRENT RATES`)}
                    </Typography>
                    <div className="h-6 max-w-full text-lg font-bold text-blue md:text-xl">
                      $ {ROIcalculator(usdvalue, farm?.apr).ROI.toFixed(2)}
                    </div>
                    <div className="text-sm">
                      ~ {ROIcalculator(usdvalue, farm?.apr).ROIInTokens} CRONA (
                      {ROIcalculator(usdvalue, farm?.apr).ROIPercentage}%)
                    </div>
                  </div>
                </div>

                <div className="align-middle bg-dark-800">
                  <div className="flex items-center justify-center mx-auto">
                    <Typography variant="lg" className="text-cyan-blue" onClick={() => setIsExpand(!isExpand)}>
                      {isExpand ? i18n._(t`Hide `) : i18n._(t`Details `)}
                    </Typography>
                    {isExpand ? (
                      <ArrowUpIcon className="h-4 text-cyan-blue" />
                    ) : (
                      <ArrowDownIcon className="h-4 text-cyan-blue" />
                    )}
                  </div>

                  {isExpand && (
                    <div className="p-2 text-sm h-fit md:text-base">
                      <div className="flex justify-between">
                        <Typography>{i18n._(t`APR(incl. LP rewards)`)}</Typography>
                        <p className="text-cyan-blue">{Number(farm?.apr).toFixed(2)}%</p>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Typography>{i18n._(t`Base APR (CRONA yield only)`)}</Typography>
                        <p className="text-cyan-blue">{Number(farm?.apr).toFixed(2)}%</p>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Typography>{i18n._(t`APY (1x daily compound)`)}</Typography>
                        <p className="text-cyan-blue">{aprToApy(farm?.apr).toFixed(2)}%</p>
                      </div>
                      <div className="flex justify-between">
                        <Typography>{i18n._(t`Farm Multiplier`)}</Typography>
                        <p className="text-cyan-blue">{farm?.multiplier / 100}X</p>
                      </div>
                      <div className="my-2 text-sm list-style-type:disc;">
                        <Typography variant="sm">{i18n._(t`• Calculated based on current rates.`)}</Typography>
                        <Typography variant="sm">
                          {i18n._(
                            t`• LP rewards: 0.17% trading fees, distributed proportionally among LP token holders.`
                          )}
                        </Typography>
                        <Typography variant="sm">
                          {i18n._(
                            t`• All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`
                          )}
                        </Typography>
                      </div>
                      <ExternalLink
                        startIcon={<LinkIcon size={16} className="text-cyan-blue" />}
                        href={`https://app.cronaswap.org/add/${
                          farm?.token0?.symbol == 'CRO' ? 'CRO' : farm?.token0?.id
                        }/${farm?.token1?.symbol == 'CRO' ? 'CRO' : farm?.token1?.id}`}
                      >
                        <Typography variant="sm" className="text-cyan-blue">
                          Get {farm?.token0?.symbol}-{farm?.token1?.symbol} LP
                        </Typography>
                      </ExternalLink>
                    </div>
                  )}
                </div>
              </div>
            </Modal>
          </Disclosure.Button>

          {open && <FarmListItemDetails farm={farm} />}
        </div>
      )}
    </Disclosure>
  )
}

export default FarmListItem
