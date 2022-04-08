import React, { FC } from 'react'

import Image from '../Image'
import Modal from '../Modal'
import { useActiveWeb3React } from '../../services/web3'
import { useLingui } from '@lingui/react'

import {
  DiceRollBetStatus,
  DiceRollClaimRewardStatus,
  DiceRollReview,
  DiceRollStatus,
} from 'app/features/gamefi/diceroll/enum'
import { DiceRollOption } from '../../constants/gamefi'
const DiceRollBetPending = ({ diceRollOption }: { diceRollOption: DiceRollOption }) => {
  return (
    <div>
      <div className="h-[255px] rounded-[15px] pt-[64px]">
        <div className="flex flex-col mx-[109px] items-center">
          <Image
            src="/images/pages/gamefi/cointoss/coin-head-active.png"
            width="64px"
            height="64px"
            alt="Dice Rolling"
          />
          <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Placed</h4>
        </div>
      </div>
    </div>
  )
}

const DiceRollBetResult = ({ diceRollResult }: { diceRollResult: DiceRollStatus }) => {
  return (
    <div>
      <div className="h-[269px] rounded-[15px] pt-[64px]">
        <div className="flex flex-col mx-[109px] items-center">
          <h4 className="font-bold text-[36px] leading-[44.65px] mt-4">Bet Result</h4>
        </div>
      </div>
    </div>
  )
}

interface DiceRollBetModalProps {
  isOpen: boolean
  onDismiss: () => void
  diceRollBetStatus: DiceRollBetStatus
  diceRollOption?: DiceRollOption
  diceRollResult?: DiceRollStatus
}

const DiceRollBetModal: FC<DiceRollBetModalProps> = ({
  isOpen,
  onDismiss,
  diceRollBetStatus,
  diceRollOption,
  diceRollResult,
}) => {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={500} maxHeight={90}>
      {diceRollBetStatus === DiceRollBetStatus.PENDING ? (
        <DiceRollBetPending diceRollOption={diceRollOption} />
      ) : diceRollBetStatus === DiceRollBetStatus.PLACED ? (
        <DiceRollBetResult diceRollResult={diceRollResult} />
      ) : (
        <div></div>
      )}
    </Modal>
  )
}

export default DiceRollBetModal
