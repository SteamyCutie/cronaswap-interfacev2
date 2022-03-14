import { ChainId, ZERO } from '@cronaswap/core-sdk'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Dots from 'app/components/Dots'
import NumericalInput from 'app/components/NumericalInput'
import QuestionHelper from 'app/components/QuestionHelper'
import { Ifo, PoolIds } from 'app/constants/types'
import { formatBalance, formatCurrencyAmount, formatNumber, formatNumberScale, tryParseAmount } from 'app/functions'
import { BIG_ONE, BIG_TEN, BIG_ZERO } from 'app/functions/bigNumber'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'app/functions/formatBalance'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { useMemo, useState } from 'react'
import { PublicIfoData, WalletIfoData } from '../hooks/types'
import useIfoPool from '../hooks/useIfoPool'
import IfoCardDetails from './IfoCardDetails'
import BigNumber from 'bignumber.js'
import { useIfoV2Contract } from 'app/hooks'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import { useTransactionAdder } from '../../../state/transactions/hooks'
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
        title: 'CRONA OFFERING',
        variant: 'blue',
        tooltip: 'Every person can only commit a limited amount, but may expect a higher return per token committed.',
      }
    case PoolIds.poolUnlimited:
      return {
        title: 'USDC OFFERING',
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
  const { account, chainId } = useActiveWeb3React()
  const { address } = ifo
  const ifoContract = useIfoV2Contract(address[chainId])
  const now = Date.parse(new Date().toString()) / 1000

  const { status, offerToken } = publicIfoData
  const raiseToken = publicIfoData[poolId].raiseToken

  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const rasieTokenBalance = useTokenBalance(account ?? undefined, raiseToken)

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

  const [approvalState, approve] = useApproveCallback(parsedAmount, ifo.address[chainId ? chainId : ChainId.CRONOS])

  const handleInput = (v: string) => {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  // TODO:
  const { limitPerUserInLP } = publicPoolCharacteristics
  const { amountTokenCommittedInLP } = userPoolCharacteristics

  const veCronaLeft = walletIfoData.ifoVeCrona?.veCronaLeft
  console.log('+++++++', veCronaLeft.toNumber())
  const maximumTokenEntry = useMemo(() => {
    if (!veCronaLeft) {
      return BIG_ZERO
      // return limitPerUserInLP.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals))
    }

    if (limitPerUserInLP.isGreaterThan(0)) {
      // console.log(Number(limitPerUserInLP.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals))))
      // console.log(Number(veCronaLeft.multipliedBy(10)))

      //compare vecrona left
      if (amountTokenCommittedInLP.isGreaterThan(0)) {
        // console.log('amountTokenCommittedInLP', Number(veCronaLeft.multipliedBy(10).minus(amountTokenCommittedInLP.multipliedBy(10 ** (18 - raiseToken.decimals))))/1e18)
        // console.log('ab1', Number(amountTokenCommittedInLP.multipliedBy(10 ** (18 - raiseToken.decimals))) /1e18)
        // console.log('ab2', Number(veCronaLeft.multipliedBy(10))/1e18)
        // console.log('true', veCronaLeft.multipliedBy(10).isGreaterThan(amountTokenCommittedInLP.multipliedBy(10 ** (18 - raiseToken.decimals))))

        // console.log('ve', Number(veCronaLeft.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals))))

        // console.log('sssss', Number(limitPerUserInLP.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals))))

        // return amountTokenCommittedInLP.isLessThan(limitPerUserInLP)
        //   ? limitPerUserInLP.minus(amountTokenCommittedInLP)
        //   : BIG_ZERO
        return veCronaLeft
          .multipliedBy(10)
          .isGreaterThan(amountTokenCommittedInLP.multipliedBy(10 ** (18 - raiseToken.decimals)))
          ? limitPerUserInLP.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals))
          : veCronaLeft.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals))
      }

      if (limitPerUserInLP.isGreaterThan(0)) {
        // console.log('amountTokenCommittedInLP2', Number(amountTokenCommittedInLP))

        return limitPerUserInLP
          .minus(amountTokenCommittedInLP)
          .multipliedBy(10 ** (18 - raiseToken.decimals)) //$983.78
          .isLessThanOrEqualTo(veCronaLeft.multipliedBy(10)) //$16.22
          ? limitPerUserInLP.minus(amountTokenCommittedInLP).multipliedBy(10 ** (18 - raiseToken.decimals)) //$983.78
          : veCronaLeft.multipliedBy(10) // x $10 $16.22
      }
    }

    return veCronaLeft.multipliedBy(10)
  }, [veCronaLeft, limitPerUserInLP, amountTokenCommittedInLP])

  // include user balance for input
  // const maximumTokenCommittable = useMemo(() => {

  //   return maximumTokenEntry.isLessThanOrEqualTo(new BigNumber(rasieTokenBalance?.toSignificant(4))) ? maximumTokenEntry : new BigNumber(rasieTokenBalance?.toSignificant(4))
  // }, [poolId, maximumTokenEntry, rasieTokenBalance])

  // console.log('maximumTokenCommittable', Number(maximumTokenEntry)/1e18, Number(maximumTokenCommittable), rasieTokenBalance?.toSignificant(4).toBigNumber(18))

  // console.log('abcd', getBalanceAmount(maximumTokenCommittable).toFixed(7).slice(0, -1))

  const buttonDisabled =
    !input ||
    pendingTx ||
    (parsedAmount && parsedAmount.equalTo(ZERO)) ||
    // status === 'finished' ||
    (poolId === PoolIds.poolBasic && Number(input) > getBalanceNumber(maximumTokenEntry))

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

  const callsData = useMemo(
    () => [
      { methodName: 'viewUserInfo', callInputs: [account, [0, 1]] }, // viewUserInfo
      { methodName: 'viewUserOfferingAndRefundingAmountsForPools', callInputs: [account, [0, 1]] }, // viewUserOfferingAndRefundingAmountsForPools
    ],
    [account]
  )

  const allowClaimObject = useSingleCallResult([] ? ifoContract : null, 'allowClaim', [])?.result
  // const allowClaim = allowClaimObject ? allowClaimObject[0] : false
  const allowClaim = true

  const addTransaction = useTransactionAdder()
  const [pendingAllowTx, setPendingAllowTx] = useState(false)
  const handleAllowClaim = async () => {
    setPendingAllowTx(true)
    try {
      const args = [!allowClaim]
      const tx = await ifoContract.setAllowClaim(...args)
      addTransaction(tx, {
        summary: `${i18n._(t`Set`)} CRONA`,
      })
      setPendingAllowTx(false)
    } catch (error) {
      console.log(error)
      setPendingAllowTx(false)
    }
  }

  return (
    <div className="space-y-6 rounded-lg md:mt-4 md:mb-4 md:ml-4 bg-dark-800">
      <div className="flex flex-row justify-between p-6 rounded-t item-center bg-dark-600">
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
        <CurrencyLogo currency={offerToken} size={'48px'} />
        <div className="flex flex-col overflow-hidden">
          <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
            {ifo[poolId].saleAmount} {offerToken.symbol}
          </div>
          <div className="text-sm font-bold leading-5 text-secondary">
            {ifo[poolId].distributionRatio * 100}% of total sale
          </div>
        </div>
      </div>

      {/* input */}
      <div className="col-span-2 px-4 text-center md:col-span-1">
        <div className="flex items-center justify-between mb-2 text-left cursor-pointer text-secondary">
          <div>
            {raiseToken.symbol} {i18n._(t`Balance`)}:{' '}
            {formatNumberScale(rasieTokenBalance?.toSignificant(6, undefined, 4) ?? 0, false, 4)}
          </div>
          {poolId === PoolIds.poolBasic && (
            <div className="text-sm text-blue">maxCommit: {formatNumber(Number(maximumTokenEntry) / 1e18, true)}</div>
          )}
        </div>

        {/* <div className={`relative flex items-center w-full mb-4 ${inputError ? 'rounded border border-red' : ''}`}> */}
        <div className="relative flex items-center w-full mb-4">
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
                  setInput(
                    poolId === PoolIds.poolBasic
                      ? getBalanceAmount(maximumTokenEntry).toFixed(7).slice(0, -1)
                      : rasieTokenBalance?.toFixed(raiseToken?.decimals)
                  )
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
          <Button
            color={
              buttonDisabled || !allowClaim ? 'gray' : !walletConnected ? 'blue' : insufficientFunds ? 'red' : 'blue'
            }
            onClick={handleDepositPool}
            disabled={buttonDisabled || inputError || !allowClaim}
          >
            {!walletConnected
              ? i18n._(t`Connect Wallet`)
              : !allowClaim
              ? i18n._(t`Claim is not allowed`)
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
          now > publicIfoData.endTimeNum + ifo.claimDelayTime &&
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
