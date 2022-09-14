import { Disclosure, Transition } from '@headlessui/react'
import React, { useCallback, useState } from 'react'

import { ExternalLink as LinkIcon } from 'react-feather'
import { useLingui } from '@lingui/react'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { Token, ZERO } from '@cronaswap/core-sdk'
import { formatNumber, formatNumberScale, getExplorerLink, tryParseAmount } from 'app/functions'
import { ApprovalState, useApproveCallback, useBatchNodeContract, useContract } from 'app/hooks'
import { getAddress } from '@ethersproject/address'
import { useTokenBalance } from 'app/state/wallet/hooks'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import NumericalInput from 'app/components/NumericalInput'
import { t } from '@lingui/macro'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import { useBatchInfo, useUserInfo } from './hooks'
import useSmartChef from './useSmartChef'
import { ClockIcon } from '@heroicons/react/outline'
import { CRONA, GRONA } from 'app/config/tokens'
import { useBuyBatch, useHarvestBatch } from './useBatches'
import BATCH_NODE_ABI from 'app/constants/abis/batch-node.json'

const BatchListItemDetail = ({
  batch,
}) => {
  const { i18n } = useLingui()

  const { account, chainId } = useActiveWeb3React()

  const stakingToken = GRONA[chainId]
  const { pending, bondsAvailable, batchLimit, batchSold, expiration, price, rewardPerNodePerSecond, startTime, userLimit, stakingTokenPrice } = useBatchInfo(batch, account, stakingToken);

  const [pendingConvert, setPendingConvert] = useState(false)
  const [pendingReturn, setPendingReturn] = useState(false)

  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState<string>('')

  const nodeContract = useContract(batch.batchNode, BATCH_NODE_ABI);

  const typedDepositValue = tryParseAmount((Number(depositValue) * price?.toFixed(stakingToken.decimals)).toString(), stakingToken)

  const stakeBalance = useTokenBalance(account, stakingToken)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, nodeContract?.address)
  const addTransaction = useTransactionAdder()

  const { handleBuy } = useBuyBatch()
  const { handleHarvest } = useHarvestBatch()

  const buy = useCallback(async () => {
    try {
      setPendingConvert(true)
      let tx = await handleBuy(depositValue)
      addTransaction(tx, {
        summary: `${i18n._(t`Buying `)} ${depositValue} batches with ${typedDepositValue} ${stakingToken?.symbol}`,
      })
      setPendingConvert(false)
    } catch (e) {
      setPendingConvert(false)
      console.warn(e)
    }
  }, [handleBuy, depositValue, addTransaction, stakingToken?.symbol])

  // // TODO: Replace these
  // const { amount } = useUserInfo(pool, stakingToken)

  // const { deposit, withdraw, emergencyWithdraw, harvest } = useSmartChef(pool)

  // const userMaxStake = tryParseAmount('30000', stakingToken).subtract(
  //   tryParseAmount(amount && amount?.greaterThan(0) ? amount.toFixed(stakingToken?.decimals) : '0.000001', stakingToken)
  // )

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-0"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Disclosure.Panel className="flex flex-col w-full border-t-0 rounded rounded-t-none bg-dark-800" static>
        {/* <div className="grid grid-cols-2 gap-4 p-4"> */}
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
          <div className="col-span-2 text-center md:col-span-1 items-center grid">
            <div className="relative flex items-center mb-4 w-full">
              <NumericalInput
                className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-dark-purple"
                value={depositValue}
                onUserInput={setDepositValue}
              />
              {account && (
                <Button
                  variant="outlined"
                  color="blue"
                  size="xs"
                  onClick={() => {
                    setDepositValue(bondsAvailable)
                  }}
                  className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                >
                  {i18n._(t`MAX`)}
                </Button>
              )}
            </div>

            <div className='flex space-x-2'>
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
                  className="w-full"
                  color="blue"
                  disabled={
                    pendingTx ||
                    !typedDepositValue ||
                    // (pool.pid === 0 && Number(depositValue) > 30000) ||
                    stakeBalance?.lessThan(typedDepositValue)
                  }
                  onClick={async () => {
                    // setPendingTx(true)
                    // try {
                    //   // KMP decimals depend on asset, SLP is always 18
                    //   const tx = await deposit(depositValue.toBigNumber(stakingToken?.decimals))

                    //   addTransaction(tx, {
                    //     summary: `${i18n._(t`Deposit`)} ${stakingToken?.symbol}`,
                    //   })
                    // } catch (error) {
                    //   console.error(error)
                    // }
                    // setPendingTx(false)
                  }}
                >
                  {i18n._(t`Buy`)}
                </Button>
              )}
            </div>
          </div>
          <div className="col-span-2 text-center md:col-span-1 items-center grid">
            <div className="pr-4 mb-2 text-center cursor-pointer">
              Your bonds
            </div>
            <div className="relative w-full border-2 border-secondary rounded-md text-center text-lg font-semibold py-4 text-primary">
              {formatNumber(batchSold)} / {formatNumber(batchLimit)}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            Crona Earned
            <div className="flex flex-col justify-between text-sm gap-1 mt-1 rounded-lg bg-dark-700">
              <div className="flex mt-4">
                <div className="flex flex-col w-1/2 px-4 align-middle">
                  <div className="text-2xl font-bold">
                    {' '}
                    {/* {formatNumber(pendingReward?.toFixed(earningToken?.decimals))} */}
                    {formatNumber(pending)}
                  </div>
                  <div className="text-sm">
                    ~
                    {/* {formatNumber(
                      Number(pendingReward?.toFixed(earningToken?.decimals)) * Number(earningTokenPrice?.toFixed(18)),
                      true
                    )} */}
                    {formatNumber(pending * Number(stakingTokenPrice?.toFixed(18)))}
                  </div>
                </div>
                <div className="flex flex-col w-1/2 px-4 align-middle gap-y-1">
                  <Button
                    color={
                      // Number(formatNumber(pendingReward?.toFixed(earningToken?.decimals))) <= 0 ? 'blue' : 'gradient'
                      'blue'
                    }
                    size="sm"
                    className="w-full !text-sm"
                    variant={
                      // Number(formatNumber(pendingReward?.toFixed(earningToken?.decimals))) <= 0 ? 'outlined' : 'filled'
                      'filled'
                    }
                    // disabled={Number(formatNumber(pendingReward?.toFixed(earningToken?.decimals))) <= 0}
                    disabled={false}
                    onClick={async () => {
                      setPendingTx(true)
                      try {
                        // const tx = await harvest()
                        // addTransaction(tx, {
                        //   summary: `${i18n._(t`Harvest`)} ${earningToken?.symbol}`,
                        // })
                      } catch (error) {
                        console.error(error)
                      }
                      setPendingTx(false)
                    }}
                  >
                    {i18n._(t`Claim Rewards`)}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col p-2 space-y-2">
                <div className="flex flex-row justify-between px-2 text-md">
                  <div className='text-sm'>Next rewards in</div>
                  <div className='text-md'>Block / {formatNumber(86000)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Disclosure.Panel>
    </Transition>
  )
}

export default BatchListItemDetail
