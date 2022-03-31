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
    <div className="w-full flex flex-row bg-[#2172E5] rounded divide-x-2 divide-white divide-opacity-20 text-white h-[172px] py-[45px]">
      {[
        {
          desc: `Total ${tokenName} Bets`,
          hasInfo: false,
          unit: '',
          value: totalBetsCount,
          width: '2/12',
        },
        {
          desc: `All time ${tokenName} Volume`,
          hasInfo: false,
          unit: tokenName,
          value: totalBetsAmount,
          width: '1/3',
        },
        {
          desc: 'Head Win Rate',
          hasInfo: true,
          unit: '%',
          value: headWinRate,
          info: 'Head Win Rate',
          width: '2/12',
        },
        {
          desc: 'Tail Win Rate',
          hasInfo: true,
          unit: '%',
          value: tailWinRate,
          info: 'Tail Win Rate',
          width: '2/12',
        },
        {
          desc: 'House Edge',
          hasInfo: true,
          unit: '%',
          value: houseEdge,
          info: 'House Edge',
          width: '2/12',
        },
      ].map((e) => (
        <div className={`w-${e.width} flex flex-col items-center`} key={e.desc}>
          <div className="flex justify-center items-center w-full">
            <div className="text-[14px] leading-[18px] font-medium truncate text-center">{e.desc}</div>
            {e.hasInfo && <InformationHelper text={e.info} />}
          </div>
          <h4 className="mt-3 text-[2.2vw] leading-[3.1vw] font-bold">
            {e.value} {e.unit}
          </h4>
        </div>
      ))}
    </div>
  )
}
