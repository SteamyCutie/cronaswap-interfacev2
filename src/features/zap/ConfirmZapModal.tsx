import { ChainId, Currency, CurrencyAmount, Ether, Percent, TradeType, Trade as V2Trade } from '@cronaswap/core-sdk'
import { ZapTrade } from 'app/state/zap/hooks'
import React, { useCallback, useMemo } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../../modals/TransactionConfirmationModal'

import ZapModalFooter from './ZapModalFooter'
import ZapModalHeader from './ZapModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */

function tradeMeaningfullyDiffers(...args: [ZapTrade, ZapTrade]): boolean {
  const [tradeA, tradeB] = args
  return (
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputLPToken.equal(tradeB.outputLPToken)
  )
}

export default function ConfirmZapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  zapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
}: {
  isOpen: boolean
  trade: ZapTrade | undefined
  originalTrade: ZapTrade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: Percent
  onAcceptChanges: () => void
  onConfirm: () => void
  zapErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const modalHeader = useCallback(() => {
    return trade ? (
      <ZapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade])

  const modalBottom = useCallback(() => {
    return trade ? (
      <ZapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        zapErrorMessage={zapErrorMessage}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, zapErrorMessage, trade])

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
