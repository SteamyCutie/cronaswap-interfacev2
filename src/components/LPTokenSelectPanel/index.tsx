import { Currency, CurrencyAmount, Pair, Percent, Token } from '@cronaswap/core-sdk'
import React, { ReactNode, useCallback, useState } from 'react'
import { classNames, formatCurrencyAmount } from '../../functions'

import Button from '../Button'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { CurrencyLogo, CurrencyLogoArray } from '../CurrencyLogo'
import CurrencySearchModal from '../../modals/SearchModal/CurrencySearchModal'
import DoubleCurrencyLogo from '../DoubleLogo'
import { FiatValue } from './FiatValue'
import Input from '../Input'
import Lottie from 'lottie-react'
import selectCoinAnimation from '../../animation/select-coin.json'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../services/web3'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useLingui } from '@lingui/react'
import LPTokenSearchModal from 'app/modals/SearchModal/LPTokenSearchModal'
import { useCurrency } from 'app/hooks/Tokens'
import { FarmPairInfo } from 'app/constants/farmsv1'

interface LPTokenSelectPanelProps {
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: CurrencyAmount<Token> | null
  id: string
  showCommonBases?: boolean
  allowManageTokenList?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  customBalanceText?: string
  showSearch?: boolean
  onLPTokenSelect?: (lpToken: FarmPairInfo) => void
  lpToken?: FarmPairInfo | null
}

export default function LPTokenSelectPanel({
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  renderBalance,
  fiatValue,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  customBalanceText,
  allowManageTokenList = true,
  showSearch = true,
  onLPTokenSelect,
  lpToken = null,
}: LPTokenSelectPanelProps) {
  const { i18n } = useLingui()
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  let token0 = useCurrency(lpToken ? lpToken?.token0?.id : undefined)
  let token1 = useCurrency(lpToken ? lpToken?.token1?.id : undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div id={id} className={classNames(hideInput ? 'p-4' : 'p-5', 'rounded bg-dark-800')}>
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        <div className={classNames('w-full sm:w-2/5')}>
          <button
            type="button"
            className={classNames(
              !!currency ? 'text-primary' : 'text-high-emphesis',
              'open-currency-select-button h-full outline-none select-none cursor-pointer border-none text-xl font-medium items-center'
            )}
            onClick={() => {
              if (onCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <div className="flex">
              {lpToken ? (
                <DoubleCurrencyLogo currency0={token0} currency1={token1} size={54} margin={true} />
              ) : (
                <div className="flex flex-row rounded bg-dark-700" style={{ maxWidth: 120, maxHeight: 54 }}>
                  <div style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                  <div style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col items-start justify-center mx-3.5 w-80">
                {label && <div className="text-xs font-medium text-secondary whitespace-nowrap">{label}</div>}
                <div className="flex items-center">
                  <div className="text-lg font-bold token-symbol-container md:text-2xl">
                    {(lpToken && lpToken?.name) || (
                      <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap ">
                        {i18n._(t`Select a LP token`)}
                      </div>
                    )}
                  </div>

                  {!disableCurrencySelect && currency && (
                    <ChevronDownIcon width={16} height={16} className="ml-2 stroke-current" />
                  )}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <LPTokenSearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          allowManageTokenList={allowManageTokenList}
          hideBalance={hideBalance}
          showSearch={showSearch}
          onLPTokenSelect={onLPTokenSelect}
        />
      )}
    </div>
  )
}
