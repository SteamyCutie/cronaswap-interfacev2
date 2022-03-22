import { isMobile } from 'react-device-detect'
import { FC } from 'react'
import { classNames } from '../../functions'

const MultiGlowShadow: FC<{ className?: string }> = ({ children, className }) => {
  if (isMobile) {
    return <div className="shadow-swap">{children}</div>
  }

  return (
    <div className={classNames(className, 'relative w-full')}>
      {/* <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
      <div className="absolute bottom-1/4 -right-10 bg-red top-4 w-3/5 rounded-full z-0  filter blur-[150px]" /> */}
      <div className="absolute rounded-full -translate-x-96 h-[900px] w-[900px] blur-3xl bg-gradient-to-l from-[#FF0058] to-[#003DE9]"></div>
      <div className="relative justify-start float-left w-full filter drop-shadow">{children}</div>
    </div>
  )
}

export default MultiGlowShadow
