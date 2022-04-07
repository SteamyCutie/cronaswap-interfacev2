import { Currency } from '@cronaswap/core-sdk'
import { BigNumber as BN } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useState } from 'react'
import Web3Connect from '../Web3Connect'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'app/functions/formatBalance'
import { CoinTossClaimRewardStatus } from 'app/features/gamefi/cointoss/enum'
import Loader from '../Loader'
import { ButtonConfirmed } from '../Button'
interface GameRewardClaimPanelProps {
  selectedCurrency?: Currency | undefined
  rewards?: BN | undefined
  onClaim?: undefined | (() => void)
  claimRewardStatus?: CoinTossClaimRewardStatus | undefined
}
const GameRewardClaimPanel = ({ selectedCurrency, rewards, onClaim, claimRewardStatus }: GameRewardClaimPanelProps) => {
  const { account, chainId, library } = useActiveWeb3React()
  return (
    <div className="w-[532px] h-[365px] bg-[#1C1B38] rounded">
      <div className="mt-10 ml-10">
        <h4 className="text-white font-bold text-[36px] leading-[44.65px]">Play-To-Earn Rewards</h4>
        <p className="mt-2 text-[14px] leading-[16px] font-normal">
          Earn CROISSANT when you lose, when you use CRONA for wagers!
        </p>
      </div>
      <div className="flex flex-col mx-10 mt-10">
        <div className="flex flex-row">
          <p className="mt-2 text-[14px] leading-[16px] font-normal">Reward</p>
        </div>

        <div className="border mt-2 border-[#2172E5] bg-[#0D0C2B] rounded h-[60px] flex flex-row items-center pl-6">
          <h5 className="font-bold text-[24px] leading-[29.77px]">{`${
            rewards ? getBalanceAmount(new BigNumber(rewards?.toString()), selectedCurrency?.decimals) : 0
          } ${selectedCurrency?.symbol}`}</h5>
        </div>
      </div>
      <div className="items-stretch w-[452px] h-[60px] mx-10 mt-6">
        {!account ? (
          <Web3Connect color="blue" className="w-full h-full text-base text-white" />
        ) : rewards?.eq(BN.from('0')) ? (
          <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
            No Reward
          </button>
        ) : (
          <button
            className="w-full h-full bg-[#2172E5] rounded hover:bg-light-blue disabled:bg-black disabled:cursor-not-allowed"
            disabled={claimRewardStatus === CoinTossClaimRewardStatus.PENDING}
            onClick={onClaim}
          >
            {claimRewardStatus === CoinTossClaimRewardStatus.PENDING ? (
              <div className="flex items-center justify-center h-full space-x-2">
                <div>Claiming</div>
                <Loader stroke="white" />
              </div>
            ) : (
              <div>Claim</div>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default GameRewardClaimPanel
