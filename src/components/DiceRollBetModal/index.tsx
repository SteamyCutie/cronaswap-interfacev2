import React, { FC, useEffect, useState } from 'react'

import Image from '../Image'
import Modal from '../Modal'
import { useActiveWeb3React } from '../../services/web3'
import { useLingui } from '@lingui/react'

import { DiceRollClaimRewardStatus, DiceRollStatus } from 'app/features/gamefi/diceroll/enum'
import { DiceRollOption } from '../../constants/gamefi'
import AnimationDice from '../AnimationDice'
import { GameBetStatus } from 'app/features/gamefi'
import { AlertTriangle } from 'react-feather'
const DiceRollBetPending = ({ diceRollOption }: { diceRollOption: DiceRollOption }) => {
  return (
    <div>
      <div className="rounded-[15px] pt-[64px]">
        <div className="flex flex-col mx-[109px] items-center">
          <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Placed</h4>
        </div>
      </div>
    </div>
  )
}

const DiceRollBetResult = ({ diceRollResult }: { diceRollResult: DiceRollStatus }) => {
  return (
    <div>
      <div className="rounded-[15px] pt-[64px]">
        <div className="flex flex-col mx-[109px] items-center">
          <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Result</h4>
        </div>
      </div>
    </div>
  )
}

const DiceRollAfterBetError = ({ diceRollAfterBetError }) => {
  return (
    <div>
      <div className="pt-[64px]">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="text-red" style={{ strokeWidth: 1.5 }} size={64} />
          <div className="font-bold text-red text-[24px]">{diceRollAfterBetError}</div>
        </div>
      </div>
    </div>
  )
}

interface DiceRollBetModalProps {
  isOpen: boolean
  onDismiss: () => void
  diceRollBetStatus: GameBetStatus
  diceRollOption?: DiceRollOption
  diceRollResult?: DiceRollStatus
  diceRollAfterBetError: string
}

const DiceRollBetModal: FC<DiceRollBetModalProps> = ({
  isOpen,
  onDismiss,
  diceRollBetStatus,
  diceRollOption,
  diceRollResult,
  diceRollAfterBetError,
}) => {
  const [intrvl, setIntrvl] = useState<NodeJS.Timeout>()
  const [diceFace, setdiceFace] = useState<number>(1)
  const rfSeq = [0, 5, 4, 3, 1, 2, 4, 5, 0, 3, 1, 2]
  let rfSeqId: number = 0
  useEffect(() => {
    switch (diceRollBetStatus) {
      case GameBetStatus.FATAL:
      case GameBetStatus.PENDING:
        clearInterval(intrvl)
        const interval = setInterval(() => {
          setdiceFace(rfSeq[rfSeqId])
          rfSeqId = (rfSeqId + 1) % 12
        }, 1000)
        setIntrvl(interval)
        break
      case GameBetStatus.PLACED:
        clearInterval(intrvl)
        const diceStype = document.querySelector('.dice')
        diceStype['style']['transition'] = 'all 3s ease-in-out'
        setdiceFace(diceRollResult)
        break
      case GameBetStatus.NOTPLACED:
        clearInterval(intrvl)
        break
    }
  }, [diceRollBetStatus, diceRollResult])

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={500} maxHeight={90}>
      <div className="flex flex-col items-center w-full mt-10">
        <AnimationDice diceFace={diceFace} />
      </div>
      {diceRollBetStatus === GameBetStatus.PENDING ? (
        <DiceRollBetPending diceRollOption={diceRollOption} />
      ) : diceRollBetStatus === GameBetStatus.PLACED ? (
        <DiceRollBetResult diceRollResult={diceRollResult} />
      ) : diceRollBetStatus === GameBetStatus.FATAL ? (
        <DiceRollAfterBetError diceRollAfterBetError={diceRollAfterBetError} />
      ) : (
        <div></div>
      )}
    </Modal>
  )
}

export default DiceRollBetModal
