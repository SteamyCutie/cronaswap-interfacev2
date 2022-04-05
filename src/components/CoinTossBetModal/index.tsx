import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { ChainId, Currency } from '@cronaswap/core-sdk'
import React, { FC } from 'react'
import { Trans, t } from '@lingui/macro'

import Button from '../../components/Button'
import CloseIcon from '../../components/CloseIcon'
import ExternalLink from '../../components/ExternalLink'
import Image from '../../components/Image'
import Lottie from 'lottie-react'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import { RowFixed } from '../../components/Row'
import { getExplorerLink } from '../../functions/explorer'
import loadingRollingCircle from '../../animation/loading-rolling-circle.json'
import { useActiveWeb3React } from '../../services/web3'
import useAddTokenToMetaMask from '../../hooks/useAddTokenToMetaMask'
import { useLingui } from '@lingui/react'
import { CoinTossBetStatus, CoinTossStatus } from 'app/features/gamefi/cointoss/enum'

const CoinTossBetPending = ({ coinTossStatus }: { coinTossStatus: CoinTossStatus }) => {
  return (
    <div className="w-[400px] h-[255px] bg-[#0D0C2B] rounded-[15px]">
      <div className="flex flex-col mt-[64px] mx-[109px] items-center">
        {coinTossStatus == CoinTossStatus.HEAD ? (
          <Image
            src="/images/pages/gamefi/cointoss/coin-head-active.png"
            width="64px"
            height="64px"
            alt="Coin Head Active"
          />
        ) : (
          <Image
            src="/images/pages/gamefi/cointoss/coin-head-inactive.png"
            width="64px"
            height="64px"
            alt="Coin Head Inactive"
          />
        )}
        <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Placed</h4>
      </div>
    </div>
  )
}

const CoinTossBetResult = ({ coinTossResult }: { coinTossResult: CoinTossStatus }) => {
  return (
    <div className="w-[410px] h-[269px] bg-[#0D0C2B] rounded-[15px]">
      <div className="flex flex-col mt-[64px] mx-[109px] items-center">
        {coinTossResult == CoinTossStatus.HEAD ? (
          <Image
            src="/images/pages/gamefi/cointoss/coin-head-active.png"
            width="80px"
            height="80px"
            alt="Coin Head Active"
          />
        ) : (
          <Image
            src="/images/pages/gamefi/cointoss/coin-head-inactive.png"
            width="80px"
            height="80px"
            alt="Coin Head Inactive"
          />
        )}
        <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Result</h4>
      </div>
    </div>
  )
}

interface CoinTossBetModalProps {
  isOpen: boolean
  onDismiss: () => void
  coinTossBetStatus: CoinTossBetStatus
  coinTossStatus?: CoinTossStatus
  coinTossResult?: CoinTossStatus
}

const CoinTossBetModal: FC<CoinTossBetModalProps> = ({
  isOpen,
  onDismiss,
  coinTossBetStatus,
  coinTossStatus,
  coinTossResult,
}) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {coinTossBetStatus === CoinTossBetStatus.PENDING ? (
        <CoinTossBetPending coinTossStatus={coinTossStatus} />
      ) : (
        <CoinTossBetResult coinTossResult={coinTossResult} />
      )}
    </Modal>
  )
}

export default CoinTossBetModal
