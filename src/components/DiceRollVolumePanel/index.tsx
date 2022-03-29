import React from 'react'
import InformationHelper from '../InformationHelper'
export const DiceRollVolumePanel = ({ tokenName, totalBetsCount, totalBetsAmount, houseEdge }) => {
  return (
    <div className="flex flex-row divide-x-2 divide-white divide-opacity-20 py-[45px] mt-[64px] h-[172px] bg-[#2172E5] rounded text-white min-w-[86.25vw] justify-between">
      {[
        {
          desc: `Total ${tokenName} Bets`,
          hasInfo: false,
          unit: '',
          value: totalBetsCount,
        },
        {
          desc: `All time ${tokenName} Volume`,
          hasInfo: false,
          unit: tokenName,
          value: totalBetsAmount,
        },
        {
          desc: 'House Edge',
          hasInfo: true,
          unit: '%',
          value: houseEdge,
          info: 'House Edge',
        },
      ].map((e) => (
        <div className="pl-[6.32vw] pr-[8.89vw]" key={e.desc}>
          <div className="flex items-center">
            <div className="text-[14px] leading-[18px] font-medium flex-wrap">{e.desc} </div>
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
