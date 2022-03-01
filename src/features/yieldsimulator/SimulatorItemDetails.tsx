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
import { usePendingCrona, useUserInfo } from '../farms/hooks'
import { tryParseAmount } from '../../functions/parse'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useMasterChef from '../farms/useMasterChef'
import { formatNumber, formatNumberScale, getExplorerLink } from '../../functions'
import { t } from '@lingui/macro'
import Dots from '../../components/Dots'
import NumericalInput from '../../components/NumericalInput'
import ExternalLink from '../../components/ExternalLink'
import Typography from '../../components/Typography'
import { MASTERCHEFV2_ADDRESS } from '../../constants/addresses'
import { ArrowRightIcon, FireIcon, PlusIcon } from '@heroicons/react/outline'
import NavLink from '../../components/NavLink'

const SimulatorItemDetails = ({ farm }) => {
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

  const [approvalState, approve] = useApproveCallback(
    typedDepositValue,
    farm.chef === 0 ? MASTERCHEF_ADDRESS[chainId] : MASTERCHEFV2_ADDRESS[chainId]
  )

  const { deposit, withdraw, harvest } = useMasterChef(farm.chef)

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
        <div className="items-center justify-between px-8 mt-4 md:flex">
          <div className="flex items-center justify-between w-full md:w-5/12">
            <div className="text-white">
              <div className="text-lg">{i18n._(t`You staked`)}</div>
              <div className="text-lg font-bold md:text-xl">
                {formatNumberScale(amount?.toSignificant(6, undefined, 4) ?? 0, false, 4)}
              </div>
            </div>
            <PlusIcon className="h-10" />
            <div className="relative flex items-center">
              <NumericalInput
                className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                value={withdrawValue}
                onUserInput={setWithdrawValue}
                placeholder="0.0 CRONA"
              />
            </div>
          </div>
          <ArrowRightIcon className="h-10" />
          <div className="flex items-center justify-between md:w-5/12">
            <div className="text-white">
              <div className="text-lg">{i18n._(t`Your share of staking`)}</div>
              <div className="text-lg font-bold md:text-xl">0.000585%</div>
            </div>
            <div className="text-white">
              <div className="text-lg">{i18n._(t`CRONA earning`)}</div>
              <div className="text-lg font-bold md:text-xl">21.6/day</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3"></div>
      </Disclosure.Panel>
    </Transition>
  )
}

export default SimulatorItemDetails
