import { useState } from 'react'

interface AnimationCoinProps {
  coinFace?: number | 0
  rollTimes?: number | 0
}
export default function AnimationCoin({ coinFace }: AnimationCoinProps) {
  const faces = 2
  // const [face, setface] = useState(1)
  const coin = (
    <div
      className="coin-container hover:cursor-pointer"
      // onClick={() => {
      //   setface(1 + (face % 2))
      // }}
    >
      <div className={`coin face-${coinFace}`}>
        <div className="face-0">
          <div className="face-container">HEAD</div>
        </div>
        <div className="face-1">
          <div className="face-container">TAIL</div>
        </div>
      </div>
    </div>
  )

  return coin
}
