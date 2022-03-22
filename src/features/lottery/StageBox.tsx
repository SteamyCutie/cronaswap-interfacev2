import React from 'react'

interface StageBoxProps {
  count: string
  title: string
  content: string
  classNames?: string
}

export const StageBox: React.FC<StageBoxProps> = ({ count, title, content, classNames }) => {
  return (
    <div className={`pb-11 pl-6 pr-12 bg-dark-900 border-[1px] border-t-[#FFEB17] rounded-xl w-[307px] ${classNames}`}>
      <div className="items-end justify-end">
        <div className="font-Kumbh font-extrabold text-[68px] leading-[84px] absolute -z-10 text-grey opacity-30">
          {count}
        </div>
        <div className="pt-10 mb-3 text-2xl font-medium leading-8 text-center text-white">{title}</div>
      </div>
      <div className="text-base font-medium leading-6 text-grey">{content}</div>
    </div>
  )
}
