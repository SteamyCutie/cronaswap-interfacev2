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
import { CoinTossBetStatus, CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
import AnimationCoin from '../AnimationCoin'

const CoinTossBetPending = ({ coinTossStatus }: { coinTossStatus: CoinTossStatus }) => {
  return (
    <div>
      <div className="h-[255px] rounded-[15px] pt-[64px]">
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
      <div className="h-[269px] rounded-[15px] pt-[64px]">
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
  const [intrvl, setIntrvl] = useState<NodeJS.Timeout>()
  const [coinFace, setcoinFace] = useState<number>(1)
  const rfSeq = [0, 1]
  let rfSeqId: number = 0
  useEffect(() => {
    switch (coinTossBetStatus) {
      case CoinTossBetStatus.PENDING:
        clearInterval(intrvl)
        const interval = setInterval(() => {
          setcoinFace(rfSeq[rfSeqId])
          rfSeqId = (rfSeqId + 1) % 2
        }, 1000)
        setIntrvl(interval)
        break
      case CoinTossBetStatus.PLACED:
        clearInterval(intrvl)
        const diceStype = document.querySelector('.coin')
        diceStype['style']['transition'] = 'all 3s ease-in-out'
        setcoinFace(coinTossResult)
        break
      case CoinTossBetStatus.NOTPLACED:
        clearInterval(intrvl)
        break
    }
  }, [coinTossBetStatus, coinTossResult])
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={500} maxHeight={90}>
      <div className="flex flex-col items-center w-full mt-10">
        <AnimationCoin coinFace={coinFace} />
      </div>
      {coinTossBetStatus === CoinTossBetStatus.PENDING ? (
        <CoinTossBetPending coinTossStatus={coinTossStatus} />
      ) : coinTossBetStatus === CoinTossBetStatus.PLACED ? (
        <CoinTossBetResult coinTossResult={coinTossResult} />
      ) : (
        <div></div>
      )}
    </Modal>
  )
}

export default CoinTossBetModal
