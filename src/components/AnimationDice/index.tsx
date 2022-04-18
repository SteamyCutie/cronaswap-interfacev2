interface AnimationDiceProps {
  diceFace?: number | 1
  rollTimes?: number | 0
}
export default function AnimationDice({ diceFace }: AnimationDiceProps) {
  const faces = 6
  const maxRollTimes = 10
  const dice = (
    <div className="dice-container">
      <div className={`dice face-${diceFace}`}>
        <div className="face-0">
          <div className="dot-container">
            <div className="dot"></div>
          </div>
        </div>
        <div className="face-2">
          <div className="dot-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        <div className="face-3">
          <div className="dot-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        <div className="face-1">
          <div className="dot-container">
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        <div className="face-4">
          <div className="dot-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        <div className="face-5">
          <div className="dot-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return dice
}
