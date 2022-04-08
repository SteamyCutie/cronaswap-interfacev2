import React from 'react'
import InformationHelper from '../InformationHelper'
import { Currency } from '@cronaswap/core-sdk'
import { BigNumber as BN } from '@ethersproject/bignumber'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'app/functions/formatBalance'
interface DiceRollVolumePanelProps {
  token: Currency | undefined
  totalBetsCount: number | 0
  houseEdge: number | 0
  totalBetsAmount: BN
}
export const DiceRollVolumePanel = ({
  token,
  totalBetsCount,
  totalBetsAmount,
  houseEdge,
}: DiceRollVolumePanelProps) => {
  return (
    <div className="w-full flex flex-row bg-[#2172E5] rounded divide-x-2 divide-white divide-opacity-20 text-white h-[172px] py-[45px]">
      {[
        {
          desc: `Total ${token?.symbol} Bets`,
          hasInfo: false,
          unit: '',
          value: totalBetsCount,
          width: '3/12',
        },
        {
          desc: `All time ${token?.symbol} Volume`,
          hasInfo: false,
          unit: token?.symbol,
          value: getBalanceAmount(new BigNumber(totalBetsAmount?.toString()), token?.decimals).toString(),
          width: '6/12',
        },
        {
          desc: 'House Edge',
          hasInfo: true,
          unit: '%',
          value: houseEdge,
          info: 'House Edge',
          width: '3/12',
        },
      ].map((e) => (
        <div className={`w-${e.width} flex flex-col items-center`} key={e.desc}>
          <div className="flex items-center justify-center w-full">
            <div className="text-[14px] leading-[18px] font-medium truncate text-center">{e.desc}</div>
            {e.hasInfo && <InformationHelper text={e.info} />}
          </div>
          <h4 className="mt-3 text-[2.5vw] leading-[3.1vw] font-bold">
            {e.value} {e.unit}
          </h4>
        </div>
      ))}
    </div>
  )
}
