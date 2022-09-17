import React, { useState } from 'react'
import { useActiveWeb3React } from 'app/services/web3'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { useCurrency } from 'app/hooks/Tokens'
import { classNames, formatNumber, formatPercent, formatNumberScale, minimum } from 'app/functions'
import { CurrencyLogoArray } from 'app/components/CurrencyLogo'
import BatchListItemDetail from './BatchListItemDetail'
import { usePendingReward, useBatchInfo } from './hooks'
import { CalculatorIcon } from '@heroicons/react/solid'
import ROICalculatorModal from 'app/components/ROICalculatorModal'
import { getAddress } from '@ethersproject/address'
import { CRONA } from '@cronaswap/core-sdk'
import { useTokenBalance } from 'state/wallet/hooks'
import Pool from 'pages/exchange/pool'
import { GRONA } from 'app/config/tokens'
import { max } from 'lodash'

const BatchListItem = ({ batch, ...rest }) => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()

  const stakingToken = GRONA[chainId]
  const earningToken = CRONA[chainId]

  const { pending, bondsAvailable, batchLimit, batchSold, expiration, price, rewardPerNodePerSecond, startTime, userLimit } = useBatchInfo(batch, account, stakingToken);
  // const { apr, endInBlock, bonusEndBlock, totalStaked, stakingTokenPrice, earningTokenPrice } = usePoolsInfo(pool)

  // const pendingReward = usePendingReward(pool, earningToken)
  // const cronaBalance = useTokenBalance(account ?? undefined, CRONA[chainId])
  // const balance = Number(cronaBalance?.toSignificant(8))
  // const [showCalc, setShowCalc] = useState(false)

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
              <div className="flex items-center w-1/2 col-span-2 space-x-4 lg:gap-5 lg:w-2/12 lg:col-span-1">
                Batch ID - {batch.bid}
              </div>

              <div className="flex flex-col justify-center w-2/12 lg:w-1/12 space-y-1">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Earned`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(pending?.toFixed(earningToken?.decimals))}
                </div>
              </div>

              <div className="flex-col justify-center w-4/12 space-y-1 lg:w-2/12 lg:block">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Total bonds`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(batchLimit)}
                </div>
              </div>

              <div className="flex-col justify-center hidden space-y-1 lg:w-2/12 lg:block">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Bonds available`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(bondsAvailable)}
                </div>
              </div>

              <div className="flex-col justify-center hidden space-y-1 lg:w-2/12 lg:block">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Daily APR`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(rewardPerNodePerSecond / price * 86400 * 100)} %
                </div>
              </div>

              <div className="flex-col justify-center hidden space-y-1 lg:w-2/12 lg:block">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Bond price`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(price?.toFixed(stakingToken.decimals))} $GRONA
                </div>
              </div>

              <div className="flex-col justify-center hidden space-y-1 lg:w-2/12 lg:block">
                <div className="text-xs md:text-[14px] text-secondary">{i18n._(t`Expire period`)}</div>
                <div className="text-xs font-bold md:text-base">
                  {formatNumber(expiration / 86400)} days
                </div>
              </div>

              <div className="flex flex-col items-center justify-center lg:w-1/12">
                <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`} />
              </div>
            </div>
          </Disclosure.Button>

          {open && (
            <BatchListItemDetail batch={batch} />
          )}
        </div>
      )}
    </Disclosure>
  )
}

export default BatchListItem
