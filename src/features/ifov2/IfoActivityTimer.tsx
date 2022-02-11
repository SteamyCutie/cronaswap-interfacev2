import Typography from 'app/components/Typography'
import useInterval from 'app/hooks/useInterval'
import { useState } from 'react'

interface IfoActivityTimerState {
  days: string
  hours: string
  minutes: string
  seconds: string
}

function IfoActivityTimer({ remainingTime }) {
  const [remaining, setRemaining] = useState<IfoActivityTimerState>()

  useInterval(() => {
    if (!remainingTime) return

    const { days, hours, minutes, seconds } = remainingTime
    setRemaining({
      days: String(Math.max(days, 0)).padStart(2, '0'),
      hours: String(Math.max(hours, 0)).padStart(2, '0'),
      minutes: String(Math.max(minutes, 0)).padStart(2, '0'),
      seconds: String(Math.max(seconds, 0)).padStart(2, '0'),
    })
  }, 1000)

  // Render normally
  if (remaining) {
    return (
      <>
        <div className="flex items-baseline gap-1 text-pink">
          <Typography variant="h2" className="text-yellow">
            {remaining.days}D
          </Typography>
          <Typography variant="h2" className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="h2" className="text-yellow">
            {remaining.hours}H
          </Typography>
          <Typography variant="h2" className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="h2" className="text-yellow">
            {remaining.minutes}M
          </Typography>
          <Typography variant="h2" className="text-mono text-secondary">
            :
          </Typography>
        </div>
        <div className="flex items-baseline gap-2">
          <Typography variant="h2" className="text-yellow">
            {remaining.seconds}S
          </Typography>
        </div>
      </>
    )
  }

  // No data available
  return <></>
}

export default IfoActivityTimer
