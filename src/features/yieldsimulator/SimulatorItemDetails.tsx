import { Disclosure, Transition } from '@headlessui/react'
import React, { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react'
import { useActiveWeb3React } from '../../services/web3'
import { Token } from '@cronaswap/core-sdk'
import { getAddress } from '@ethersproject/address'
import { useUserInfo } from '../farms/hooks'
import { formatNumberScale } from '../../functions'
import { t } from '@lingui/macro'
import NumericalInput from '../../components/NumericalInput'
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/outline'
import { aprToApy } from '../staking/useStaking'
import { useLockedBalance } from '../boost/hook'

const SimulatorItemDetails = ({ farm, veCrona, handleBoost }) => {
  const { i18n } = useLingui()

  const { chainId } = useActiveWeb3React()
  const [depositValue, setDepositValue] = useState('')

  const liquidityToken = new Token(
    chainId,
    getAddress(farm.lpToken),
    farm.token1 ? 18 : farm.token0 ? farm.token0.decimals : 18,
    farm.token1 ? farm.symbol : farm.token0.symbol,
    farm.token1 ? farm.name : farm.token0.name
  )

  const { amount } = useUserInfo(farm, liquidityToken)
  const { veCronaSupply } = useLockedBalance()
  const totalVeCrona = Number(veCronaSupply) / 1e18
  // Caculate BoostFactor
  const userBalanceInFarm = (Number(amount?.toSignificant(6, undefined, 4)) + Number(depositValue)) * farm.lpPrice
  const totalDepositedInFarm = farm.tvl * farm.lpPrice
  const derivedBalance = userBalanceInFarm * 0.4
  const adjustedBalance = (totalDepositedInFarm * veCrona) / totalVeCrona
  const BoostFactor =
    derivedBalance + adjustedBalance < userBalanceInFarm
      ? (derivedBalance + adjustedBalance) / derivedBalance
      : userBalanceInFarm / derivedBalance

  BoostFactor && handleBoost(BoostFactor)

  const apy = aprToApy(farm.apr * BoostFactor)
  const [share, setShare] = useState(Number(amount?.toSignificant(6, undefined, 4)) / farm.tvl)
  const [earning, setEarning] = useState((Number(amount?.toSignificant(6, undefined, 4)) * (apy / 100)) / 365)

  const handleInput = (val) => {
    setDepositValue(val)
    const value = Number(amount?.toSignificant(6, undefined, 4)) + Number(depositValue)
    setShare(value > 0 ? (value >= farm.tvl ? 1 : value / farm.tvl) : 0)
    share !== 1 && setEarning((value * (apy / 100)) / 365)
  }

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
        <div className="justify-between px-6 my-4 space-y-4 lg:px-16 md:w-full md:flex">
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
                value={depositValue}
                onUserInput={(val) => {
                  handleInput(val)
                }}
                placeholder={`0.0 ${farm.name}`}
              />
            </div>
          </div>
          <ArrowRightIcon className="h-6 rotate-90 md:h-10 md:rotate-0" />
          <div className="flex justify-between gap-2 -translate-y-2 md:w-5/12">
            <div className="text-white">
              <div className="text-lg">{i18n._(t`Your share of staking`)}</div>
              <div className="text-lg font-bold md:text-xl">{(share * 100).toFixed(6)}%</div>
            </div>
            <div className="text-white">
              <div className="text-lg">{i18n._(t`CRONA earning`)}</div>
              <div className="text-lg font-bold md:text-xl">{earning ? earning.toFixed(2) : 0}/day</div>
            </div>
          </div>
        </div>
      </Disclosure.Panel>
    </Transition>
  )
}

export default SimulatorItemDetails
