import { Disclosure, Transition } from '@headlessui/react'
import React, { useState } from 'react'

import Button from '../../components/Button'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useLingui } from '@lingui/react'
import { useActiveWeb3React } from '../../services/web3'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { MASTERCHEF_ADDRESS, Token, ZERO } from '@cronaswap/core-sdk'
import { getAddress } from '@ethersproject/address'
import { useTokenBalance } from '../../state/wallet/hooks'
import { usePendingCrona, useUserInfo } from './hooks'
import { tryParseAmount } from '../../functions/parse'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useMasterChef from './useMasterChef'
import { formatNumber, formatNumberScale, getExplorerLink } from '../../functions'
import { t } from '@lingui/macro'
import Dots from '../../components/Dots'
import NumericalInput from '../../components/NumericalInput'
import ExternalLink from '../../components/ExternalLink'
import Typography from '../../components/Typography'

const FarmListItem = ({ farm }) => {
  const { i18n } = useLingui()

  const { account, chainId } = useActiveWeb3React()
  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const addTransaction = useTransactionAdder()

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    farm.token1 ? 18 : farm.token0 ? farm.token0.decimals : 18,
    farm.token1 ? farm.symbol : farm.token0.symbol,
    farm.token1 ? farm.name : farm.token0.name
  )

  // User liquidity token balance
  const balance = useTokenBalance(account, liquidityToken)

  // TODO: Replace these
  const { amount } = useUserInfo(farm, liquidityToken)

  const pendingCrona = usePendingCrona(farm)

  const typedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const typedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, MASTERCHEF_ADDRESS[chainId])

  const { deposit, withdraw, harvest } = useMasterChef()

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-4">
          <div className="col-span-2 text-center md:col-span-1">
            {account && (
              <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                {i18n._(t`Wallet Balance`)}: {formatNumberScale(balance?.toSignificant(4, undefined, 2) ?? 0)}
                {farm.lpPrice && balance
                  ? ` (` + formatNumberScale(farm.lpPrice * Number(balance?.toFixed(18) ?? 0), true) + `)`
                  : ``}
              </div>
            )}
            <div className="relative flex items-center w-full mb-4">
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
                    if (!balance.equalTo(ZERO)) {
                      setDepositValue(balance.toFixed(liquidityToken?.decimals))
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
                className="w-full"
                color="blue"
                disabled={pendingTx || !typedDepositValue || balance.lessThan(typedDepositValue) || farm?.id === '1'}
                onClick={async () => {
                  setPendingTx(true)
                  try {
                    // KMP decimals depend on asset, SLP is always 18
                    const tx = await deposit(farm?.id, depositValue.toBigNumber(liquidityToken?.decimals))

                    addTransaction(tx, {
                      summary: `${i18n._(t`Deposit`)} ${
                        farm.token1 ? `${farm.token0.symbol}/${farm.token1.symbol}` : farm.token0.symbol
                      }`,
                    })
                  } catch (error) {
                    console.error(error)
                  }
                  setPendingTx(false)
                }}
              >
                {i18n._(t`Stake`)}
              </Button>
            )}
          </div>
          <div className="col-span-2 text-center md:col-span-1">
            {account && (
              <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                {i18n._(t`Your Staked`)}: {formatNumberScale(amount?.toSignificant(6)) ?? 0}
                {farm.lpPrice && amount
                  ? ` (` + formatNumberScale(farm.lpPrice * Number(amount?.toSignificant(18) ?? 0), true) + `)`
                  : ``}
              </div>
            )}
            <div className="relative flex items-center w-full mb-4">
              <NumericalInput
                className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                value={withdrawValue}
                onUserInput={setWithdrawValue}
              />
              {account && (
                <Button
                  variant="outlined"
                  color="blue"
                  size="xs"
                  onClick={() => {
                    if (!amount.equalTo(ZERO)) {
                      setWithdrawValue(amount.toFixed(liquidityToken?.decimals))
                    }
                  }}
                  className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                >
                  {i18n._(t`MAX`)}
                </Button>
              )}
            </div>
            <Button
              className="w-full"
              color="blue"
              disabled={pendingTx || !typedWithdrawValue || amount.lessThan(typedWithdrawValue)}
              onClick={async () => {
                setPendingTx(true)
                try {
                  const tx = await withdraw(farm?.id, withdrawValue.toBigNumber(liquidityToken?.decimals))
                  addTransaction(tx, {
                    summary: `${i18n._(t`Withdraw`)} ${
                      farm.token1 ? `${farm.token0.symbol}/${farm.token1.symbol}` : farm.token0.symbol
                    }`,
                  })
                } catch (error) {
                  console.error(error)
                }

                setPendingTx(false)
              }}
            >
              {i18n._(t`Unstake`)}
            </Button>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="mb-2 text-xs md:text-base text-secondary">CRONA Earned</div>
            <div className="flex flex-col justify-between gap-4 text-sm rounded-lg bg-dark-700">
              <div className="flex mt-4">
                <div className="flex flex-col w-2/3 px-4 align-middle">
                  <div className="text-2xl font-bold"> {formatNumber(pendingCrona?.toFixed(18))}</div>
                  <div className="text-sm">~{Number(formatNumber(pendingCrona?.toFixed(18))) * farm.tokenPrice}</div>
                </div>
                <div className="flex flex-col w-1/3 px-4 align-middle gap-y-1">
                  <Button
                    color={Number(formatNumber(pendingCrona?.toFixed(18))) <= 0 ? 'blue' : 'gradient'}
                    className="w-full"
                    variant={Number(formatNumber(pendingCrona?.toFixed(18))) <= 0 ? 'outlined' : 'filled'}
                    disabled={Number(formatNumber(pendingCrona?.toFixed(18))) <= 0}
                    onClick={async () => {
                      setPendingTx(true)
                      try {
                        const tx = await harvest(farm.pid)
                        addTransaction(tx, {
                          summary: `${i18n._(t`Harvest`)} ${
                            farm.token1 ? `${farm.token0.symbol}/${farm.token1.symbol}` : farm.token0.symbol
                          }`,
                        })
                      } catch (error) {
                        console.error(error)
                      }
                      setPendingTx(false)
                    }}
                  >
                    {i18n._(t`Harvest`)}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col p-2 space-y-2">
                <div className="flex flex-row justify-between text-md px-2">
                  <ExternalLink
                    startIcon={<LinkIcon size={16} />}
                    href={chainId && getExplorerLink(chainId, farm.lpToken, 'address')}
                  >
                    <Typography variant="sm">{i18n._(t`View Contract`)}</Typography>
                  </ExternalLink>
                  <ExternalLink
                    startIcon={<LinkIcon size={16} />}
                    href={`https://app.cronaswap.org/add/${farm?.pair?.token0?.id}/${farm?.pair?.token1?.id}`}
                  >
                    <Typography variant="sm">
                      {i18n._(t`Get ${farm?.pair?.token0?.symbol}-${farm?.pair?.token0?.symbol} LP`)}
                    </Typography>
                  </ExternalLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Disclosure.Panel>
    </Transition>
  )
}

export default FarmListItem
