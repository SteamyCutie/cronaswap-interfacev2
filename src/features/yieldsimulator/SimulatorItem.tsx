import { classNames, formatNumber, formatPercent, formatNumberScale } from '../../functions'
import React, { useState } from 'react'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrency } from '../../hooks/Tokens'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, LockClosedIcon, CalculatorIcon } from '@heroicons/react/solid'
import SimulatorItemDetails from './SimulatorItemDetails'
import { usePendingCrona, useUserInfo } from '../farms/hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

import QuestionHelper from '../../components/QuestionHelper'
import { CurrencyLogoArray } from '../../components/CurrencyLogo'
import ROICalculatorModal from 'app/components/ROICalculatorModal'
import { Token } from '@cronaswap/core-sdk'
import { getAddress } from '@ethersproject/address'
import { useTokenBalance } from '../../state/wallet/hooks'

const SimulatorItem = ({ farm, veCrona, handleBoost }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  let token0 = useCurrency(farm.token0?.id)
  let token1 = useCurrency(farm.token1?.id)

  const pendingCrona = usePendingCrona(farm)

  const [showCalc, setShowCalc] = useState(false)
  const MyLpBalance = (farm) => {
    const liquidityToken = new Token(
      chainId,
      getAddress(farm.lpToken),
      farm.token1 ? 18 : farm.token0 ? farm.token0.decimals : 18,
      farm.token1 ? farm.symbol : farm.token0.symbol,
      farm.token1 ? farm.name : farm.token0.name
    )

    // const balance = useTokenBalance(account, liquidityToken)
    const { amount } = useUserInfo(farm, liquidityToken)
    return Number(amount?.toFixed(liquidityToken?.decimals))
  }
  const Lpbalance = { account } ? MyLpBalance(farm) : 0

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
                    <span className="inline-flex items-center px-2 ml-0 mr-auto text-xs rounded-full bg-dark-800 text-gray">
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
                    <ROICalculatorModal
                      isfarm={true}
                      isOpen={showCalc}
                      onDismiss={() => setShowCalc(false)}
                      showBoost={true}
                      showCompound={false}
                      name={farm.name + ' LP'}
                      apr={farm.apr}
                      Lpbalance={Lpbalance}
                      multiplier={farm.multiplier}
                      lpPrice={farm.lpPrice}
                      token0={farm.token0}
                      token1={farm.token1}
                    />
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
          </Disclosure.Button>

          {open && <SimulatorItemDetails farm={farm} veCrona={veCrona} handleBoost={handleBoost} />}
        </div>
      )}
    </Disclosure>
  )
}

export default SimulatorItem
