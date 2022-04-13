import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { ChainId, Currency } from '@cronaswap/core-sdk'
import React, { FC, useEffect, useState } from 'react'
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
import { CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
import AnimationCoin from '../AnimationCoin'
import { GameBetStatus } from 'app/features/gamefi'

const CoinTossBetPending = ({ coinTossStatus }: { coinTossStatus: CoinTossStatus }) => {
  return (
    <div>
      <div className="rounded-[15px] pt-[64px]">
        <div className="flex flex-col mx-[109px] items-center">
          {/* {coinTossStatus == CoinTossStatus.HEAD ? (
            <Image
              src="/images/pages/gamefi/cointoss/coin-head-active.png"
              width="64px"
              height="64px"
              alt="Coin Head Active"
            />
          ) : coinTossStatus == CoinTossStatus.TAIL ? (
            <Image
              src="/images/pages/gamefi/cointoss/coin-tail-active.png"
              width="64px"
              height="64px"
              alt="Coin Tail Active"
            />
          ) : (
            <></>
          )} */}
          <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Placed</h4>
        </div>
      </div>
    </div>
  )
}

const CoinTossBetResult = ({ coinTossResult }: { coinTossResult: CoinTossStatus }) => {
  return (
    <div>
      <div className="rounded-[15px] pt-[64px]">
        <div className="flex flex-col mx-[109px] items-center">
          {/* {coinTossResult == CoinTossStatus.HEAD ? (
            <Image
              src="/images/pages/gamefi/cointoss/coin-head-active.png"
              width="80px"
              height="80px"
              alt="Coin Head Active"
            />
          ) : coinTossResult == CoinTossStatus.TAIL ? (
            <Image
              src="/images/pages/gamefi/cointoss/coin-tail-active.png"
              width="80px"
              height="80px"
              alt="Coin Tail Active"
            />
          ) : (
            <></>
          )} */}
          <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Result</h4>
        </div>
      </div>
    </div>
  )
}

const CoinTossAfterBetError = ({ coinTossAfterBetError }) => {
  return (
    <div>
      <div className="pt-[64px]">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="text-red" style={{ strokeWidth: 1.5 }} size={64} />
          <div className="font-bold text-red text-[24px]">{coinTossAfterBetError}</div>
        </div>
      </div>
    </div>
  )
}

interface CoinTossBetModalProps {
  isOpen: boolean
  onDismiss: () => void
  coinTossBetStatus: GameBetStatus
  coinTossStatus?: CoinTossStatus
  coinTossResult?: CoinTossStatus
  coinTossAfterBetError?: string
}

const CoinTossBetModal: FC<CoinTossBetModalProps> = ({
  isOpen,
  onDismiss,
  coinTossBetStatus,
  coinTossStatus,
  coinTossResult,
  coinTossAfterBetError,
}) => {
  const [intrvl, setIntrvl] = useState<NodeJS.Timeout>()
  const [coinFace, setcoinFace] = useState<number>(1)
  const rfSeq = [0, 1]
  let rfSeqId: number = 0
  useEffect(() => {
    switch (coinTossBetStatus) {
      case GameBetStatus.FATAL:
      case GameBetStatus.PENDING:
        clearInterval(intrvl)
        const interval = setInterval(() => {
          setcoinFace(rfSeq[rfSeqId])
          rfSeqId = (rfSeqId + 1) % 2
        }, 3000)
        setIntrvl(interval)
        break
      case GameBetStatus.PLACED:
        clearInterval(intrvl)
        const diceStype = document.querySelector('.coin')
        diceStype['style']['transition'] = 'all 4s ease-in-out'
        setcoinFace(coinTossResult)
        break
      case GameBetStatus.NOTPLACED:
        clearInterval(intrvl)
        break
    }
  }, [coinTossBetStatus, coinTossResult])
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={500} maxHeight={90}>
      <div className="flex flex-col items-center w-full mt-10">
        <AnimationCoin coinFace={coinFace} />
      </div>
      {coinTossBetStatus === GameBetStatus.PENDING ? (
        <CoinTossBetPending coinTossStatus={coinTossStatus} />
      ) : coinTossBetStatus === GameBetStatus.PLACED ? (
        <CoinTossBetResult coinTossResult={coinTossResult} />
      ) : coinTossBetStatus === GameBetStatus.FATAL ? (
        <CoinTossAfterBetError coinTossAfterBetError={coinTossAfterBetError} />
      ) : (
        <div></div>
      )}
    </Modal>
  )
}

export default CoinTossBetModal
