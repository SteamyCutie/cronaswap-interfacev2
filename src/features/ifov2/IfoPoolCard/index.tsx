import { ZERO } from '@cronaswap/core-sdk'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Dots from 'app/components/Dots'
import NumericalInput from 'app/components/NumericalInput'
import QuestionHelper from 'app/components/QuestionHelper'
import { Ifo, PoolIds } from 'app/constants/types'
import { formatNumberScale, tryParseAmount } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { useState } from 'react'
import { PublicIfoData, WalletIfoData } from '../hooks/types'
import useIfoPool from '../hooks/useIfoPool'
import IfoCardDetails from './IfoCardDetails'

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const cardConfig = (
  poolId: PoolIds
): {
  title: string
  variant: 'blue' | 'violet'
  tooltip: string
} => {
  switch (poolId) {
    case PoolIds.poolBasic:
      return {
        title: 'Basic Sale',
        variant: 'blue',
        tooltip: 'Every person can only commit a limited amount, but may expect a higher return per token committed.',
      }
    case PoolIds.poolUnlimited:
      return {
        title: 'Unlimited Sale',
        variant: 'violet',
        tooltip: 'No limits on the amount you can commit. Additional fee applies when claiming.',
      }
    default:
      return { title: '', variant: 'blue', tooltip: '' }
  }
}

const INPUT_CHAR_LIMIT = 18

const sendTx = async (txFunc: () => Promise<any>): Promise<boolean> => {
  let success = true
  try {
    const ret = await txFunc()
    if (ret?.error) {
      success = false
    }
  } catch (e) {
    console.error(e)
    success = false
  }
  return success
}

const IfoPoolCard: React.FC<IfoCardProps> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const config = cardConfig(poolId)

  const { status, startTimeNum, raiseTokenPriceInUSD } = publicIfoData
  const userPoolCharacteristics = walletIfoData[poolId]

  const { account } = useActiveWeb3React()
  const rasieTokenBalance = useTokenBalance(account ?? undefined, ifo.raiseToken)

  const walletConnected = !!account
  const toggleWalletModal = useWalletModalToggle()

  const [input, setInput] = useState<string>('')
  const [pendingTx, setPendingTx] = useState(false)
  const [claimPendingTx, setClaimPendingTx] = useState(false)
  const [usingBalance, setUsingBalance] = useState(false)

  const parsedAmount = usingBalance ? rasieTokenBalance : tryParseAmount(input, rasieTokenBalance?.currency)

  const insufficientFunds =
    (rasieTokenBalance && rasieTokenBalance.equalTo(ZERO)) || parsedAmount?.greaterThan(rasieTokenBalance)
  const inputError = insufficientFunds

  const buttonDisabled = !input || pendingTx || (parsedAmount && parsedAmount.equalTo(ZERO)) || status === 'finished'

  const [approvalState, approve] = useApproveCallback(parsedAmount, ifo.address)

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  // const typedDepositValue = tryParseAmount(depositValue, ifo.currency)

  // const [approvalState, approve] = useApproveCallback(typedDepositValue, ifo.address)

  const { harvestPool, depositPool } = useIfoPool(walletIfoData.contract)

  const handleDepositPool = async () => {
    if (buttonDisabled) return

    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setPendingTx(true)

      if (approvalState === ApprovalState.NOT_APPROVED) {
        const success = await sendTx(() => approve())
        if (!success) {
          setPendingTx(false)
          return
        }
      }

      // const success = await sendTx(() => createLockWithMc(parsedAmount, getUnixTime(addDays(Date.now(), activeTab))))
      const success = await sendTx(() => depositPool(parsedAmount, poolId))

      if (!success) {
        setPendingTx(false)
        // setModalOpen(true)
        return
      }

      handleInput('')
      setPendingTx(false)
    }
  }

  const handleHarvestPool = async () => {
    if (!walletConnected) {
      toggleWalletModal()
    } else {
      setClaimPendingTx(true)

      // const success = await sendTx(() => createLockWithMc(parsedAmount, getUnixTime(addDays(Date.now(), activeTab))))
      const success = await sendTx(() => harvestPool(poolId))

      if (!success) {
        setClaimPendingTx(false)
        // setModalOpen(true)
        return
      }

      setClaimPendingTx(false)
    }
  }

  return (
    <div className="md:mt-4 md:mb-4 md:ml-4 rounded-lg bg-dark-800 space-y-6">
      <div className="flex flex-row item-center justify-between p-6 rounded-t bg-dark-600">
        <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
          {config.title}
          <QuestionHelper text={config.tooltip} />
        </div>

        {status === 'coming_soon' && (
          <div className="bg-gray-700 bg-opacity-60 text-white opacity-60 h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
            Upcoming
          </div>
        )}

        {status === 'live' && (
          <div className="bg-gray-700 bg-opacity-60 text-green h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
            Live
          </div>
        )}

        {status === 'finished' && (
          <div className="bg-gray-600 bg-opacity-60 text-yellow  h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
            Finished
          </div>
        )}
      </div>
      <div className="flex gap-3 px-4">
        <CurrencyLogo currency={ifo.offerToken} size={'48px'} />
        <div className="flex flex-col overflow-hidden">
          <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
            {ifo[poolId].saleAmount}
          </div>
          <div className="text-sm leading-5 font-bold text-secondary">
            {ifo[poolId].distributionRatio * 100}% of total sale
          </div>
        </div>
      </div>

      {/* input */}
      <div className="col-span-2 text-center md:col-span-1  px-4">
        <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
          {ifo.offerToken.symbol} {i18n._(t`Balance`)}:{' '}
          {formatNumberScale(rasieTokenBalance?.toSignificant(6, undefined, 4) ?? 0, false, 4)}
        </div>

        <div className={`relative flex items-center w-full mb-4 ${inputError ? 'rounded border border-red' : ''}`}>
          <NumericalInput
            className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-dark-purple"
            value={input}
            onUserInput={handleInput}
          />
          {account && (
            <Button
              variant="outlined"
              color="blue"
              size="xs"
              onClick={() => {
                if (!rasieTokenBalance?.equalTo(ZERO)) {
                  setInput(rasieTokenBalance?.toFixed(ifo.raiseToken?.decimals))
                }
              }}
              className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
            >
              {i18n._(t`MAX`)}
            </Button>
          )}
        </div>

        {approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING ? (
          <Button
            className="w-full"
            color="gradient"
            disabled={approvalState === ApprovalState.PENDING}
            onClick={approve}
          >
            {approvalState === ApprovalState.PENDING ? <Dots>{i18n._(t`Approving`)}</Dots> : i18n._(t`Approve`)}
          </Button>
        ) : (
          // <Button className="w-full" color="blue" disabled={pendingTx || !typedDepositValue || rasieTokenBalance?.lessThan(typedDepositValue)}>
          //     {i18n._(t`Commit`)}
          // </Button>
          <Button
            color={buttonDisabled ? 'gray' : !walletConnected ? 'blue' : insufficientFunds ? 'red' : 'blue'}
            onClick={handleDepositPool}
            disabled={buttonDisabled || inputError}
          >
            {!walletConnected
              ? i18n._(t`Connect Wallet`)
              : !input
              ? i18n._(t`Commit`)
              : insufficientFunds
              ? i18n._(t`Insufficient Balance`)
              : i18n._(t`Commit`)}
          </Button>
        )}

        {/* claim */}
        {status === 'finished' &&
          !userPoolCharacteristics.hasClaimed &&
          (userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) ||
            userPoolCharacteristics.refundingAmountInLP.isGreaterThan(0)) && (
            <Button className="w-full mt-2" color="gradient" disabled={claimPendingTx} onClick={handleHarvestPool}>
              {claimPendingTx ? <Dots>{i18n._(t`Claiming`)}</Dots> : i18n._(t`Claim`)}
            </Button>
          )}
      </div>

      {/* info */}
      <IfoCardDetails poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
    </div>
  )
}

export default IfoPoolCard
