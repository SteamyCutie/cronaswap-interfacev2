import { formatNumberScale } from '../../functions'
import React, { useState } from 'react'
import { SwitchVerticalIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { ExternalLink as LinkIcon } from 'react-feather'
import ExternalLink from '../../components/ExternalLink'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

import QuestionHelper from '../../components/QuestionHelper'
import Modal from './../../components/Modal/index'
import ModalHeader from './../../components/ModalHeader/index'
import Typography from 'app/components/Typography'
import Input from 'components/Input'
import Checkbox from 'app/components/Checkbox'
import { getCronaPrice, aprToApy } from 'features/staking/useStaking'

interface RoiCalculatorModalProps {
  isfarm: boolean
  isOpen: boolean
  onDismiss: () => void
  showBoost: boolean
  showCompound: boolean
  name: string
  apr: number
  Lpbalance?: number
  multiplier?: number
  lpPrice?: number
  token0?: any
  token1?: any
}

const buttonStyle =
  'flex justify-center items-center w-full h-8 rounded-2xl font-bold md:font-medium md:text-sm text-xs focus:outline-none focus:ring'
const buttonStyleEnabled = `${buttonStyle} text-high-emphesis bg-cyan-blue hover:bg-opacity-60`
const buttonStyleDisabled = `${buttonStyle} text-secondary bg-dark-700`
const buttonUnselected = `${buttonStyle} text-secondary text-white bg-dark-700`

const ROICalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isfarm,
  isOpen,
  onDismiss,
  showBoost,
  showCompound,
  name,
  apr,
  Lpbalance,
  multiplier,
  lpPrice,
  token0,
  token1,
}) => {
  const { i18n } = useLingui()

  const [usdvalue, setUsdValue] = useState(0)
  const [lpvalue, setLpValue] = useState(0)
  const [editingCurrency, setEditingCurrency] = useState('usd')
  const [stakedPeriod, setStakedPeriod] = useState(365)
  const [isCompounding, setIsCompounding] = useState(showCompound)
  const [compoundingPeriod, setCompoundingPeriod] = useState(1)
  const [isExpand, setIsExpand] = useState(false)
  const [isBoost, setIsBoost] = useState(false)

  if (isfarm === false) {
    lpPrice = getCronaPrice()
  }
  const ROIcalculator = (principal: number, apr: number) => {
    const aprAsDecimal = isBoost ? apr / 40 : apr / 100
    const daysAsDecimalOfYear = stakedPeriod / 365
    const timesCompounded = 365 / compoundingPeriod
    if (isCompounding === false) {
      const ROI = principal * aprAsDecimal * daysAsDecimalOfYear
      const cronaPriceInUSD = getCronaPrice()
      const ROIInTokens = ROI.toFixed(3)
      const ROIPercentage = usdvalue === 0 ? '0' : ((ROI / usdvalue) * 100).toFixed(2)
      return { ROI, ROIInTokens, ROIPercentage }
    }
    const ROI = principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - principal
    const cronaPriceInUSD = getCronaPrice()
    const ROIInTokens = (ROI / cronaPriceInUSD).toFixed(3)
    const ROIPercentage = usdvalue === 0 ? '0' : ((ROI / usdvalue) * 100).toFixed(2)
    return { ROI, ROIInTokens, ROIPercentage }
  }

  return (
    <Modal isOpen={isOpen} maxWidth={500} onDismiss={onDismiss}>
      <div className="pr-2 space-y-2 overflow-y-auto max-h-96 md:max-h-[480px] lg:max-h-[540px]">
        <ModalHeader title={i18n._(t`ROI Calculator`)} onClose={() => {}} />
        <div className="py-2">
          <div className="flex items-center justify-between text-sm">
            <Typography variant="sm">
              {name} {i18n._(t` Staked`)}
            </Typography>
            {showBoost && (
              <div className="flex gap-1">
                <Typography variant="sm">{i18n._(t`Max Boost Apr:`)}</Typography>
                <Checkbox checked={isBoost} color="blue" set={() => setIsBoost(!isBoost)} />
              </div>
            )}
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
                      ? (setUsdValue(Number(val)), setLpValue(Number(val) / lpPrice))
                      : (setLpValue(Number(val)), setUsdValue(Number(val) * lpPrice))
                  }}
                />
                <div className="text-sm text-right md:text-base">{editingCurrency === 'lp' ? name + ' ' : 'USD'}</div>
              </div>
              <div className="flex items-end justify-between w-full p-3 space-x-3 text-sm focus:bg-dark-700">
                <div className="h-5 ">{editingCurrency === 'lp' ? usdvalue : lpvalue}</div>
                <div className="text-xs text-right md:text-sm">{editingCurrency === 'usd' ? name + ' ' : 'USD'}</div>
              </div>
            </div>
            <SwitchVerticalIcon
              className="w-1/12 mx-auto h-7"
              onClick={() => {
                editingCurrency === 'usd' ? setEditingCurrency('lp') : setEditingCurrency('usd')
              }}
            />
          </div>
          <div className="flex items-center justify-between px-2 mb-2">
            <button
              className={`${buttonStyle} bg-dark-500 w-10 md:w-20`}
              onClick={() => {
                setUsdValue(100), setLpValue(100 / lpPrice)
              }}
            >
              $100
            </button>
            <button
              className={`${buttonStyle} bg-dark-500 w-10 md:w-20`}
              onClick={() => {
                setUsdValue(1000), setLpValue(1000 / lpPrice)
              }}
            >
              $1000
            </button>
            {!isNaN(Lpbalance) && (
              <button
                className={`${Lpbalance === 0 ? buttonStyleDisabled : buttonStyle} bg-dark-500 w-20 md:w-24`}
                disabled={Lpbalance === 0}
                onClick={() => {
                  setLpValue(Lpbalance), setUsdValue(Lpbalance * lpPrice)
                }}
              >
                My balance
              </button>
            )}
            {/* <QuestionHelper text="“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm." /> */}
          </div>
          <Typography variant="sm">{i18n._(t`Staked for`)}</Typography>
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
              className={`${stakedPeriod === 365 * 5 ? buttonStyleEnabled : buttonUnselected} px-2 mx-auto md:px-4`}
              onClick={() => setStakedPeriod(365 * 5)}
            >
              5Y
            </button>
          </div>
          {showCompound && (
            <>
              <Typography variant="sm">{i18n._(t`Compounding Every`)}</Typography>
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
            </>
          )}
          <ArrowDownIcon className="h-6 mx-auto mb-3" />
          <div className="p-2 space-y-1 rounded-lg bg-dark-800">
            <Typography variant="sm" className="text-cyan-blue">
              {i18n._(t`ROI AT CURRENT RATES`)}
            </Typography>
            <div className="h-6 max-w-full text-lg font-bold text-blue md:text-xl">
              $ {ROIcalculator(usdvalue, apr).ROI.toFixed(2)}
            </div>
            <div className="text-sm">
              ~ {ROIcalculator(usdvalue, apr).ROIInTokens} CRONA ({ROIcalculator(usdvalue, apr).ROIPercentage}%)
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
              {isfarm && (
                <div className="flex justify-between">
                  <Typography>{i18n._(t`APR(incl. LP rewards)`)}</Typography>
                  <p className="text-cyan-blue">{Number(apr).toFixed(2)}%</p>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <Typography>{i18n._(t`Base APR (CRONA yield only)`)}</Typography>
                <p className="text-cyan-blue">{Number(apr).toFixed(2)}%</p>
              </div>
              <div className="flex justify-between gap-2">
                <Typography>{i18n._(t`APY (1x daily compound)`)}</Typography>
                <p className="text-cyan-blue">{aprToApy(apr).toFixed(2)}%</p>
              </div>
              {isfarm && (
                <div className="flex justify-between">
                  <Typography>{i18n._(t`Farm Multiplier`)}</Typography>
                  <p className="text-cyan-blue">{multiplier / 100}X</p>
                </div>
              )}
              <div className="my-2 text-sm list-style-type:disc;">
                <Typography variant="sm">{i18n._(t`• Calculated based on current rates.`)}</Typography>
                <Typography variant="sm">
                  {isfarm
                    ? i18n._(t`• LP rewards: 0.17% trading fees, distributed proportionally among LP token holders.`)
                    : i18n._(t`• All estimated rates take into account this pool’s 2.99% performance fee`)}
                </Typography>
                <Typography variant="sm">
                  {i18n._(
                    t`• All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.`
                  )}
                </Typography>
              </div>
              {isfarm ? (
                <ExternalLink
                  startIcon={<LinkIcon size={16} className="text-cyan-blue" />}
                  href={`https://app.cronaswap.org/add/${token0?.symbol == 'CRO' ? 'CRO' : token0?.id}/${
                    token1?.symbol == 'CRO' ? 'CRO' : token1?.id
                  }`}
                >
                  <Typography variant="sm" className="text-cyan-blue">
                    Get {token0?.symbol}-{token1?.symbol} LP
                  </Typography>
                </ExternalLink>
              ) : (
                <ExternalLink
                  startIcon={<LinkIcon size={16} className="text-cyan-blue" />}
                  href={`https://app.cronaswap.org/swap/CRO/CRONA`}
                >
                  <Typography variant="sm" className="text-cyan-blue">
                    Get CRONA
                  </Typography>
                </ExternalLink>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ROICalculatorModal
