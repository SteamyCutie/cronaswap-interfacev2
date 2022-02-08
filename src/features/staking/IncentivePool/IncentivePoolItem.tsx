import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { useCurrency } from 'app/hooks/Tokens'
import { classNames, formatNumber, formatPercent } from 'app/functions'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import IncentivePoolItemDetail from './IncentivePoolItemDetail'
import { usePendingReward, usePoolsInfo } from './hooks'

const IncentivePoolItem = ({ pool, ...rest }) => {
  const { i18n } = useLingui()

  let stakingToken = useCurrency(pool.stakingToken?.id)
  let earningToken = useCurrency(pool.earningToken?.id)

  const { apr, endInBlock, bonusEndBlock, totalStaked, stakingTokenPrice, earningTokenPrice } = usePoolsInfo(pool)

  const pendingReward = usePendingReward(pool, earningToken)

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
              <div className="flex w-1/2 col-span-2 space-x-4 lg:gap-5 lg:w-3/12 lg:col-span-1 items-center">
                {/* <DoubleLogo currency0={token0} currency1={token1} size={window.innerWidth > 768 ? 40 : 24} /> */}
                {stakingToken && earningToken && (
                  <CurrencyLogoArray
                    currencies={[earningToken, stakingToken]}
                    dense
                    size={window.innerWidth > 968 ? 40 : 28}
                  />
                )}
                <div className="flex flex-col justify-center">
                  <div className="text-xs font-bold md:text-base">Earn {earningToken?.symbol}</div>
                  {formatNumber(pendingReward?.toFixed(18)) != '0' ? (
                    <div className=" text-xs text-blue">{i18n._(t`STAKING CRONA`)}</div>
                  ) : (
                    <div className=" text-xs text-gray">{i18n._(t`Stake CRONA`)}</div>
                  )}
                </div>
              </div>

              {/* Earned */}
              <div className="flex flex-col justify-center w-2/12 space-y-1">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Earned`)}</div>
                <div className="text-xs font-bold md:text-base">{formatNumber(pendingReward?.toFixed(18))}</div>
              </div>

              {/* Total staked */}
              <div className="flex-col justify-center hidden lg:w-2/12 lg:block space-y-1">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Total staked`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(totalStaked?.toFixed(stakingToken?.decimals))} {stakingToken?.symbol}
                </div>
              </div>

              {/* APR */}
              <div className="flex flex-col justify-center w-3/12 lg:w-2/12 space-y-1">
                <div className="text-xs md:text-[14px] text-secondary">APR</div>
                <div className="text-xs font-bold md:text-base">{formatPercent(apr)} </div>
              </div>

              {/* Ends in */}
              <div className="flex-col justify-center hidden lg:w-2/12 lg:block space-y-1">
                <div className="flex items-center text-xs md:text-[14px] text-secondary">{i18n._(t`Ends in`)}</div>
                <div className="text-xs font-bold md:text-base">{formatNumber(bonusEndBlock)} blocks</div>
              </div>

              <div className="flex flex-col items-center justify-center lg:w-1/12">
                <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`} />
              </div>
            </div>
          </Disclosure.Button>

          {open && (
            <IncentivePoolItemDetail
              pool={pool}
              pendingReward={pendingReward}
              stakingTokenPrice={stakingTokenPrice}
              earningTokenPrice={earningTokenPrice}
              endInBlock={endInBlock}
              bonusEndBlock={bonusEndBlock}
            />
          )}
        </div>
      )}
    </Disclosure>
  )
}

export default IncentivePoolItem
