import { ChainId, Currency, CurrencyAmount, Ether, Percent, TradeType, Trade as V2Trade } from '@cronaswap/core-sdk'
import { ZapTrade } from 'app/state/zap/hooks'
import React, { useCallback, useMemo } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../../modals/TransactionConfirmationModal'

import ZapModalFooter from './ZapModalFooter'
import ZapModalHeader from './ZapModalHeader'

export default function ConfirmZapModal({
  trade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  zapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}: {
  isOpen: boolean
  trade: ZapTrade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  allowedSlippage: Percent
  onAcceptChanges: () => void
  onConfirm: () => void
  zapErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const modalHeader = useCallback(() => {
    return trade ? (
      <ZapModalHeader trade={trade} allowedSlippage={allowedSlippage} onAcceptChanges={onAcceptChanges} />
    ) : null
  }, [allowedSlippage, onAcceptChanges, trade])

  const modalBottom = useCallback(() => {
    return trade ? <ZapModalFooter onConfirm={onConfirm} trade={trade} zapErrorMessage={zapErrorMessage} /> : null
  }, [onConfirm, zapErrorMessage, trade])

  // text to show while loading
  const pendingText = `Zapping ${trade?.inputAmount?.toSignificant(6)} ${trade?.inputAmount?.currency?.symbol} for  ${
    trade?.outputLPToken?.token0.symbol
  } - ${trade?.outputLPToken?.token1.symbol}`

  const confirmationContent = useCallback(
    () =>
      zapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={zapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Zap"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, zapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={undefined}
    />
  )
}
