import React from 'react'
import InformationHelper from '../InformationHelper'
export const DiceRollVolumePanel = ({ tokenName, totalBetsCount, totalBetsAmount, houseEdge }) => {
  return (
    <div className="w-full flex flex-row bg-[#2172E5] rounded divide-x-2 divide-white divide-opacity-20 text-white h-[172px] py-[45px]">
      {[
        {
          desc: `Total ${tokenName} Bets`,
          hasInfo: false,
          unit: '',
          value: totalBetsCount,
          width: '1/4',
        },
        {
          desc: `All time ${tokenName} Volume`,
          hasInfo: false,
          unit: tokenName,
          value: totalBetsAmount,
          width: '1/2',
        },
        {
          desc: 'House Edge',
          hasInfo: true,
          unit: '%',
          value: houseEdge,
          info: 'House Edge',
          width: '1/4',
        },
      ].map((e) => (
        <div className={`w-${e.width} flex flex-col items-center`} key={e.desc}>
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
