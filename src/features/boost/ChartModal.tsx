import { ChartPieIcon } from "@heroicons/react/solid"
import { i18n } from "@lingui/core"
import { t } from '@lingui/macro'
import Modal from "app/components/Modal"
import ModalHeader from "app/components/ModalHeader"
import { VotingChart } from "./VotingChart"

interface ChartIconButtonProps {
  handler: any
}

export const ChartIconButton: React.FC<ChartIconButtonProps> = ({ handler }) => {
  return (
    <div className="w-7 h-7 cursor-pointer" onClick={handler}>
      <ChartPieIcon className="hover:fill-[#FFFFFF]" />
    </div>
  )
}

interface VoteChartModalProps {
  isOpen: boolean
  onDismiss: () => void
  data: any
}

export const VoteChartModal: React.FC<VoteChartModalProps> = ({ isOpen, onDismiss, data }) => {
  var maxW = window.innerWidth
  maxW = maxW > 768 ? 530 : 380
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth={maxW}>
      <div className="max-h-screen w-full px-2 space-y-2 overflow-hidden">
        <ModalHeader title={i18n._(t`Boosted Pools`)} onClose={onDismiss} className="w-full" />
        <div className="py-2 w-full">
          <VotingChart data={data} />
        </div>
      </div>
    </Modal>
  )
}