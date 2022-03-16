import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { FC } from 'react'

interface ProgressBarProps {
  className?: string
  progress: number | string
}

const ProgressBar: FC<ProgressBarProps> = ({ progress, className }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={classNames('flex flex-grow h-2 rounded-full bg-dark-700 overflow-hidden', className)}>
        <div
          className={classNames(
            'flex justify-end bg-gradient-to-r from-pink-red to-pink rounded-r-full h-full',
            className
          )}
          style={{ width: `${Number(progress) * 100}%` }}
        />
      </div>
      <Typography variant="xs" className="text-green">
        {(Number(progress) * 100).toFixed(2)}%
      </Typography>
    </div>
  )
}

export default ProgressBar
