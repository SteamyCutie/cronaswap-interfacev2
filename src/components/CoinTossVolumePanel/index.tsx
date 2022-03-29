import React from 'react'
import InformationHelper from '../InformationHelper'
export const CoinTossVolumePanel = ({
  tokenName,
  totalBetsCount,
  totalBetsAmount,
  headWinRate,
  tailWinRate,
  houseEdge,
}) => {
  return (
    <div className="flex flex-row divide-x-2 divide-white divide-opacity-20 mx-[6.94vw] py-[45px] mt-[64px]  h-[172px] bg-[#2172E5] rounded text-white text-full">
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
          desc: 'Head Win Rate',
          hasInfo: true,
          unit: '%',
          value: headWinRate,
          info: 'Head Win Rate',
        },
        {
          desc: 'Tail Win Rate',
          hasInfo: true,
          unit: '%',
          value: tailWinRate,
          info: 'Tail Win Rate',
        },
        {
          desc: 'House Edge',
          hasInfo: true,
          unit: '%',
          value: houseEdge,
          info: 'House Edge',
        },
      ].map((e) => (
        <>
          <div className="pl-[3.33vw] pr-[3.75vw]" key={e.desc}>
            <div className="flex items-center">
              <div className="text-[14px] leading-[18px] font-medium flex-wrap">{e.desc} </div>
              {e.hasInfo && <InformationHelper text={e.info} />}
            </div>
            <h4 className="mt-3 text-[2.5vw] leading-[3.1vw] font-bold">
              {e.value} {e.unit}
            </h4>
          </div>
        </>
      ))}
    </div>
  )
}
