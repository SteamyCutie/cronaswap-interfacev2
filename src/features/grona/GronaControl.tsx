import { Token, ZERO } from '@cronaswap/core-sdk'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import NumericalInput from 'app/components/NumericalInput'
import { ApprovalState, useApproveCallback, useTreasuryContract } from 'app/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useState } from 'react'
import { tryParseAmount } from 'app/functions'
import { CRONA, GRONA } from 'app/config/tokens'
import Checkbox from 'app/components/Checkbox'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useBuyGRONA, useSellGRONA } from './useGrona'
import Loader from 'app/components/Loader'
import { RowBetween } from 'app/components/Row'

const GronaControl = () => {
  const styleCard = 'flex flex-col gap-3 w-full rounded-xl gap-3'
  const styleItem = 'flex flex-col p-8 py-6 rounded-xl bg-dark-1000/60 w-full text-center justify-start'

  const convertRate = 0.7
  const returnFee = 0.02

  const { account, chainId } = useActiveWeb3React()

  const [pendingConvert, setPendingConvert] = useState(false)
  const [pendingReturn, setPendingReturn] = useState(false)

  const [depositValue, setDepositValue] = useState<string>('')
  const [returnValue, setReturnValue] = useState<string>('')

  const stakingToken = CRONA[chainId]
  const earningToken = GRONA[chainId]
  const treasuryContract = useTreasuryContract()

  const typedDepositValue = tryParseAmount(depositValue, stakingToken)
  const typedReturnValue = tryParseAmount(returnValue, earningToken)

  const stakeBalance = useTokenBalance(account, stakingToken)
  const earnBalance = useTokenBalance(account, earningToken)

  const [approvalDepositState, approveDeposit] = useApproveCallback(typedDepositValue, treasuryContract?.address)
  const [approvalReturnState, approveReturn] = useApproveCallback(typedReturnValue, treasuryContract?.address)
  const addTransaction = useTransactionAdder()

  const initMax = 50
  const [maxValue, setMaxValue] = useState(initMax)

  const { handleBuy } = useBuyGRONA()
  const { handleSell } = useSellGRONA()

  const buy = useCallback(async () => {
    try {
      setPendingConvert(true)
      let tx = await handleBuy(depositValue)
      addTransaction(tx, {
        summary: `${i18n._(t`Convert `)} ${stakingToken?.symbol} ${i18n._(t`to `)} ${earningToken?.symbol}`,
      })
      setPendingConvert(false)
    } catch (e) {
      setPendingConvert(false)
      console.warn(e)
    }
  }, [handleBuy, depositValue, addTransaction, stakingToken?.symbol, earningToken?.symbol])

  const sell = useCallback(async () => {
    try {
      setPendingReturn(true)
      let tx = await handleSell(returnValue)
      addTransaction(tx, {
        summary: `${i18n._(t`Convert `)} ${earningToken?.symbol} ${i18n._(t`to `)} ${stakingToken?.symbol}`,
      })
      setPendingReturn(false)
    } catch (e) {
      setPendingReturn(false)
      console.warn(e)
    }
  }, [addTransaction, earningToken?.symbol, handleSell, returnValue, stakingToken?.symbol])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center w-full gap-4 bg-center bg-no-repeat bg-cover rounded-2xl">

      {/** Deposit */}
      <div className={`${styleCard} md:rounded-r-none md:pr-3 mt-8`}>
        <div className={`${styleItem} font-medium text-lg`}>
          <p className="">Convert</p>
          <p className="flex items-center justify-center font-bold text-yellow">
            CRONA <ChevronRightIcon width={24} /> GRONA
          </p>
        </div>
        <div className={`${styleItem} h-full space-y-6`}>
          <RowBetween>
            <div className='font-medium'>Available</div>
            <div className='font-bold'>
              {stakeBalance ? Number(stakeBalance?.toFixed(stakingToken.decimals)).toFixed(2) : 0} {stakingToken?.symbol}{' '}
            </div>
          </RowBetween>
          <div className="relative flex items-center w-full mb-4">
            <NumericalInput
              className="w-full px-4 py-4 pr-20 rounded-md text-2xl font-semibold focus:ring focus:ring-dark-700 bg-dark-700/40"
              value={depositValue}
              onUserInput={setDepositValue}
            />
            {account && (
              <Button
                variant="outlined"
                color="blue"
                size="xs"
                onClick={() => {
                  if (!stakeBalance?.equalTo(ZERO)) {
                    setDepositValue(
                      Number(stakeBalance?.toFixed(stakingToken?.decimals)) > maxValue
                        ? maxValue.toFixed()
                        : stakeBalance?.toFixed(stakingToken?.decimals)
                    )
                  }
                }}
                className="absolute border-0 right-4 focus:ring focus:ring-dark-700"
              >
                {i18n._(t`MAX`)}
              </Button>
            )}
          </div>

          {approvalDepositState === ApprovalState.NOT_APPROVED || approvalDepositState === ApprovalState.PENDING ? (
            <Button
              className="w-full"
              color="gradient"
              size="lg"
              disabled={approvalDepositState === ApprovalState.PENDING}
              onClick={approveDeposit}
            >
              {approvalDepositState === ApprovalState.PENDING ? (
                <div className="flex justify-center items-center space-x-2">
                  <Loader stroke="white" />
                  <Dots>{i18n._(t`Approving`)}</Dots>
                </div>
              ) : (
                i18n._(t`Approve Contract`)
              )}
            </Button>
          ) : (
            <Button
              className="w-full"
              color={typedDepositValue?.greaterThan(ZERO) ? "gradient" : "gray"}
              size="lg"
              disabled={
                pendingConvert ||
                !typedDepositValue ||
                Number(depositValue) > maxValue ||
                stakeBalance?.lessThan(typedDepositValue)
              }
              onClick={buy}
            >
              {pendingConvert ? (
                <div className="flex justify-center items-center space-x-2">
                  <Loader stroke="white" />
                  <Dots>{i18n._(t`Confirming`)}</Dots>
                </div>
              ) : (
                i18n._(t`${typedDepositValue?.greaterThan(ZERO) ? 'Convert' : 'Enter an amount'}`)
              )}
            </Button>
          )}

          <div className='font-medium text-sm'>
            <RowBetween className="mt-8">
              <div >Output GRONA</div>
              <div className='font-semibold'> {Number(Number(depositValue) * convertRate).toFixed(2)}</div>
            </RowBetween>

            <RowBetween className="mt-2">
              <div>Current max conversion</div>
              <div className='font-semibold'> {maxValue === initMax ? initMax : 'unlimited'}</div>
            </RowBetween>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-left leading-4">
            <Checkbox
              checked={maxValue !== initMax}
              color="blue"
              set={() => setMaxValue(maxValue === initMax ? 1000000000 : initMax)}
              className="!rounded-md"
            />
            I understand what I am doing and want to enable unlimited conversion.
          </div>
        </div>
      </div>


      {/** Returned */}
      <div className={`${styleCard} md:rounded-l-none md:pl-3 mt-8`}>
        <div className={`${styleItem} font-medium text-lg`}>
          <p className="">Return</p>
          <p className="flex items-center justify-center font-bold text-yellow">
            GRONA <ChevronRightIcon width={24} /> CRONA
          </p>
        </div>
        <div className={`${styleItem}  h-full space-y-6`}>
          <RowBetween>
            <div className='font-medium'>Available</div>
            <div className='font-bold'>
              {earnBalance ? Number(earnBalance?.toFixed(earningToken.decimals)).toFixed(2) : 0} {earningToken?.symbol}{' '}
            </div>
          </RowBetween>
          <div className="relative flex items-center w-full mb-4">
            <NumericalInput
              className="w-full px-4 py-4 pr-20 rounded-md text-2xl font-semibold focus:ring focus:ring-dark-700 bg-dark-700/40"
              value={returnValue}
              onUserInput={setReturnValue}
            />
            {account && (
              <Button
                variant="outlined"
                color="blue"
                size="xs"
                onClick={() => {
                  if (!earnBalance?.equalTo(ZERO)) {
                    setReturnValue(earnBalance?.toFixed(earningToken?.decimals))
                  }
                }}
                className="absolute border-0 right-4 focus:ring focus:ring-dark-700"
              >
                {i18n._(t`MAX`)}
              </Button>
            )}
          </div>

          {approvalReturnState === ApprovalState.NOT_APPROVED || approvalReturnState === ApprovalState.PENDING ? (
            <Button
              className="w-full"
              size="lg"
              color="gradient"
              disabled={approvalReturnState === ApprovalState.PENDING}
              onClick={approveReturn}
            >
              {approvalReturnState === ApprovalState.PENDING ? (
                <Dots>{i18n._(t`Approving`)}</Dots>
              ) : (
                i18n._(t`Approve Contract`)
              )}
            </Button>
          ) : (
            <Button
              className="w-full"
              color={typedReturnValue?.greaterThan(ZERO) ? "gradient" : "gray"}
              size="lg"
              disabled={pendingReturn || !typedReturnValue || Number(earnBalance) < Number(typedReturnValue.toFixed())}
              onClick={sell}
            >
              {pendingReturn ? (
                <div className="flex justify-center items-center space-x-2">
                  <Loader stroke="white" />
                  <Dots>{i18n._(t`Confirming`)}</Dots>
                </div>
              ) : (
                i18n._(t`${Number(returnValue) ? 'Return' : 'Enter an amount'}`)
              )}
            </Button>
          )}

          <div className='font-medium text-sm'>
            <RowBetween className="mt-8">
              <div>Output CRONA</div>
              <div className='font-semibold'> {Number(Number(returnValue) * (1 - returnFee)).toFixed(2)}</div>
            </RowBetween>

            <RowBetween className="mt-2">
              <div>After 2% reflect fees</div>
            </RowBetween>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GronaControl;
