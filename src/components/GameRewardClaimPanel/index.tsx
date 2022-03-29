import { Currency } from '@cronaswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import React, { useState } from 'react'
import Web3Connect from '../Web3Connect'
interface GameRewardClaimPanelProps {
  currency?: Currency | null
}
const GameRewardClaimPanel = ({ currency }: GameRewardClaimPanelProps) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [rewardAmount, setRewardAmount] = useState<Number>(0)
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
        <div className="border mt-2 border-[#2172E5] bg-[#0D0C2B] rounded h-[60px]"></div>
      </div>
      <div className="items-stretch w-[452px] h-[60px] mx-10 mt-6">
        {!account ? (
          <Web3Connect color="blue" className="w-full h-full text-base text-white" />
        ) : rewardAmount === 0 ? (
          <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
            No Reward
          </button>
        ) : (
          <button className="w-full h-full bg-[#2172E5] rounded hover:bg-light-blue">Claim</button>
        )}
      </div>
    </div>
  )
}

export default GameRewardClaimPanel
