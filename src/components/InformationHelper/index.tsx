import React, { FC, useCallback, useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import Tooltip from '../Tooltip'

const InformationHelper: FC<{ text?: any }> = ({ children, text }) => {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  if (children) {
    return (
      <Tooltip text={text} show={show}>
        <div
          className="flex items-center justify-center outline-none"
          onClick={open}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {children}
        </div>
      </Tooltip>
    )
  }

  return (
    <Tooltip text={text} show={show}>
      <div
        className="flex items-center justify-center outline-none cursor-help hover:text-primary"
        onClick={open}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        <InformationCircleIcon width={16} height={16} />
      </div>
    </Tooltip>
  )
}

export default InformationHelper
