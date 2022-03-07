import { AlertTriangle, ArrowDown } from 'react-feather'
import { Currency, Percent, TradeType, Trade as V2Trade } from '@cronaswap/core-sdk'
import React, { useState } from 'react'
import { isAddress, shortenAddress } from '../../functions'

import Card from '../../components/Card'
import { CurrencyLogo } from '../../components/CurrencyLogo'
import { Field } from '../../state/zap/actions'
import { RowBetween } from '../../components/Row'
import TradePrice from './TradePrice'
import Typography from '../../components/Typography'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../services/web3'
import { useLingui } from '@lingui/react'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { warningSeverity } from '../../functions'
import { ZapTrade } from 'app/state/zap/hooks'
import { useCurrency } from 'app/hooks/Tokens'
import DoubleCurrencyLogo from 'app/components/DoubleLogo'

export default function ZapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: ZapTrade
  allowedSlippage: Percent
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const { i18n } = useLingui()

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const fiatValueInput = useUSDCValue(trade.inputAmount)

  let token0 = useCurrency(trade.outputLPToken ? trade.outputLPToken.token0?.id : undefined)
  let token1 = useCurrency(trade.outputLPToken ? trade.outputLPToken.token1?.id : undefined)
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CurrencyLogo currency={trade.inputAmount.currency} size={48} />
            <div className="overflow-ellipsis w-[220px] overflow-hidden font-bold text-2xl text-high-emphesis">
              {trade.inputAmount.toSignificant(6)}
            </div>
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{trade.inputAmount.currency.symbol}</div>
        </div>
        <div className="ml-3 mr-3 min-w-[24px]">
          <ArrowDown size={24} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DoubleCurrencyLogo currency0={token0} currency1={token1} size={54} margin={true} />
          </div>
          <div className="ml-3 text-2xl font-medium text-high-emphesis">{`${token0.symbol} - ${token1.symbol}`}</div>
        </div>
      </div>

      <>
        {i18n._(t`Output is not estimated. You will receive some `)} {`${token0.symbol} - ${token1.symbol} `}{' '}
        {i18n._(t` LP token or the transaction will revert.`)}
      </>
    </div>
  )
}
