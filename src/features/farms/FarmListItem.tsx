import { classNames, formatNumber, formatPercent } from '../../functions'

import DoubleLogo from '../../components/DoubleLogo'
import React from 'react'
import { useCurrency } from '../../hooks/Tokens'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, LockClosedIcon } from '@heroicons/react/solid'

import FarmListItemDetails from './FarmListItemDetails'
import { usePendingCrona } from './hooks'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import QuestionHelper from '../../components/QuestionHelper'
import { CurrencyLogoArray } from '../../components/CurrencyLogo'

const FarmListItem = ({ farm, ...rest }) => {
  const { i18n } = useLingui()

  let token0 = useCurrency(farm.token0?.id)
  let token1 = useCurrency(farm.token1?.id)

  const pendingCrona = usePendingCrona(farm)

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
              <div className="flex w-1/2 col-span-2 space-x-4 lg:gap-10 lg:w-3/12 lg:col-span-1 items-center">
                {/* <DoubleLogo currency0={token0} currency1={token1} size={window.innerWidth > 768 ? 40 : 24} /> */}
                {token0 && token1 && (
                  <CurrencyLogoArray currencies={[token0, token1]} dense size={window.innerWidth > 968 ? 40 : 28} />
                )}
                <div className="flex flex-col justify-center">
                  <div className="text-xs md:text-xs text-blue">
                    {formatNumber(pendingCrona?.toFixed(18)) != '0' ? `FARMING` : ``}
                  </div>
                  <div className="text-xs font-bold md:text-base">{farm?.name}</div>
                </div>
              </div>

              {/* Earned */}
              <div className="flex flex-col justify-center w-2/12">
                <div className="text-xs md:text-base text-secondary">{i18n._(t`Earned`)}</div>
                <div className="text-xs font-bold md:text-base">{formatNumber(pendingCrona?.toFixed(18))}</div>
              </div>

              {/* Liquidity */}
              <div className="flex-col justify-center hidden lg:w-2/12 lg:block">
                <div className="text-xs md:text-base text-secondary">{i18n._(t`Liquidity`)}</div>
                <div className="text-xs font-bold md:text-base">{formatNumber(farm.tvl, true)}</div>
              </div>

              {/* Multiplier */}
              <div className="flex-col justify-center hidden lg:w-2/12 lg:block">
                {/* <div className="text-xs md:text-base text-secondary">{i18n._(t`Multiplier`)}</div> */}
                <div className="flex items-center text-xs md:text-base text-secondary">
                  {i18n._(t`Multiplier`)}
                  <QuestionHelper text="The Multiplier represents the proportion of CRONA rewards each farm receives, as a proportion of the CRONA produced each block. For example, if a 1x farm received 1 CRONA per block, a 40x farm would receive 40 CRONA per block. This amount is already included in all APR calculations for the farm." />
                </div>
                <div className="text-xs font-bold md:text-base">{farm.multiplier / 100}x</div>
              </div>

              {/* APR */}
              {farm.chef === 0 ? (
                <div className="flex flex-col justify-center w-2/12 lg:w-1/12">
                  <div className="text-xs md:text-xs text-secondary">APR</div>
                  <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr)} </div>
                </div>
              ) : (
                // <div className="flex flex-col justify-center w-2/12 lg:w-3/12">
                //   <div className="text-xs md:text-base text-secondary">vAPR</div>
                //   <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr)} (proj. 332.91%)<LockClosedIcon className="h-4" /></div>
                // </div>

                <div className="flex flex-col justify-center w-2/12 lg:w-3/12">
                  <div className="text-xs md:text-base text-secondary">
                    <div className="flex items-center">
                      vAPR{' '}
                      <QuestionHelper text="vAPR stands for “Variable Annual Percentage Rate”: it is the interest you’d earn on your deposits for a whole year, and it’s variable because it depends on today’s trading activity in this pool, the price of the assets you deposit, the price of the assets you’re rewarded with, and the current rewards rates." />
                    </div>
                  </div>

                  <div className="md:flex">
                    <div className="text-xs font-bold md:text-base">{formatPercent(farm.apr)} / </div>
                    <div className="flex items-center">
                      <LockClosedIcon className="h-4 text-yellow" />
                      <div className="text-xs font-bold md:text-base">{formatPercent(farm.boostApr)}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center justify-center lg:w-1/12">
                <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`} />
              </div>
            </div>
          </Disclosure.Button>

          {open && <FarmListItemDetails farm={farm} />}
        </div>
      )}
    </Disclosure>
  )
}

export default FarmListItem
