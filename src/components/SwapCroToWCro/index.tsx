import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'
import Web3Connect from '../Web3Connect'

const SwapCroToWCro = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const inputAmount: Number = 0

  return (
    <div className="w-[532px] h-[429px] bg-[#1C1B38] rounded relative">
      <div className="mt-10 ml-10">
        <h4 className="text-white font-bold text-[36px] leading-[44.65px]">Swap CRO</h4>
        <p className="mt-2 text-[14px] leading-[16px] font-normal">Swap your CRO to WCRO for free</p>
      </div>
      <div className="flex flex-col mx-10 mt-10">
        <div className="flex flex-row justify-between">
          <p className="mt-2 text-[14px] leading-[16px] font-normal">Swap your CRO to WCRO for free</p>
          <div className="flex flex-row text-[14px] leading-[24px] font-bold gap-1">
            <p className="text-[#2172E5]">{0}</p>
            <p>CRO</p>
          </div>
        </div>
        <div className="border mt-2 border-[#2172E5] bg-[#0D0C2B] rounded h-[60px]"></div>
      </div>
      <div className="flex flex-row justify-between mx-10 mt-6">
        <p className="mt-2 text-[14px] leading-[16px] font-normal">You get:</p>
        <div className="flex flex-row text-[14px] leading-[24px] font-bold gap-1">
          <p className="text-[#2172E5]">{0}</p>
          <p>WCRO</p>
        </div>
      </div>
      <div className="items-stretch w-[452px] h-[60px] mx-10 mt-10">
        {!account ? (
          <Web3Connect color="blue" className="w-full h-full text-base text-white" />
        ) : inputAmount === 0 ? (
          <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
            Input Swap Amount
          </button>
        ) : (
          <button className="w-full h-full bg-[#2172E5] rounded hover:bg-light-blue">Swap</button>
        )}
      </div>
    </div>
  )
}

export default SwapCroToWCro
