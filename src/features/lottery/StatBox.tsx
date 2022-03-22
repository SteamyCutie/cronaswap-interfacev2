import React from 'react'

interface StatBoxProps {
  content: string
  stat: string
}

export const StatBox: React.FC<StatBoxProps> = ({ content, stat }) => {
  return (
    <div className="py-6 pl-6 pr-32 bg-dark-900 border-[1px] border-t-[#FFEB17] rounded-md ">
      <div className="w-24 mb-3 text-sm font-medium leading-4 text-grey">{content}</div>
      <div className="text-2xl font-bold leading-7 text-white">{stat}</div>
    </div>
    // border-image-source: conic-gradient(from 45.7deg at 50% 50%, #FFEB17 0deg, #003DE9 12.27deg, #093BE4 12.31deg, #FF0058 204.37deg, #FFEB17 360deg);
  )
}
