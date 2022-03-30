import React from 'react'
import { Currency, CurrencyAmount, Percent } from '@cronaswap/core-sdk'

interface BetAmountInputPanelProps {
  currency?: Currency | null
  minBetAmount?: string | ''
  maxBetAmount?: string | ''
}
export default function BetAmountInputPanel({ currency, maxBetAmount, minBetAmount }: BetAmountInputPanelProps) {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between w-full">
        <div>Bet amount</div>
        <div className="flex flex-row gap-1 align-middle">
          <div className="text-[12px] leading-[24px] font-medium">Limit: </div>
          <div className="text-blue text-[14px] leading-[24px] font-bold">{30} </div>
          <div className="text-[12px] leading-[24px] font-medium">Max: </div>
          <div className="text-blue text-[14px] leading-[24px] font-bold">{3000}</div>
          <div className="text-[14px] leading-[24px] font-bold">{'WCRO'}</div>
        </div>
      </div>
      <div className="rounded border border-[#2172E5] w-full h-[60px] bg-[#0D0C2B] mt-[8px]"></div>
    </div>
  )
}
