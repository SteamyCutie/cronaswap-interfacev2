import { CurrencyLogoArray } from '../../components/CurrencyLogo'
import Checkbox from 'app/components/Checkbox'
import Input from 'app/components/Input'
import { useState } from 'react'

export const SelectItem = ({ name }) => {
  return (
    <div className="flex items-center gap-2 hover:cursor-pointer">
      <Checkbox color="blue" className="w-4 h-4 border-2 rounded-sm border-dark-650" set={() => {}} />
      <div className="text-base text-dark-650 hover:text-blue">{name}</div>
    </div>
  )
}

export const VoteInputItem = ({ token0, token1, percentage }) => {
  const [voteValue, setVoteValue] = useState('')
  const handleChange = (event) => {
    setVoteValue(event.target.value)
  }

  return (
    <div className="flex items-center h-12 p-1 border-2 rounded-md w-36 lg:w-44 border-dark-650">
      <div className="flex items-center gap-2">
        {token0 && token1 && <CurrencyLogoArray currencies={[token0, token1]} dense size={20} />}
        <div>%</div>
      </div>
      <input
        type={'string'}
        value={voteValue}
        placeholder={`${token0.symbol}-${token1.symbol} LP`}
        className="w-full px-1 text-sm bg-transparent "
        onChange={handleChange}
      />
    </div>
  )
}

const VotingItems = ({ token0, token1, vote, weight }) => {
  return (
    <div className="grid justify-between grid-cols-3 p-2 text-lg">
      <div>
        {token0 && token1 && (
          <CurrencyLogoArray currencies={[token0, token1]} dense size={window.innerWidth > 968 ? 40 : 28} />
        )}
      </div>
      <div className="ml-auto">{vote}</div>
      <div className="ml-auto">{weight}</div>
    </div>
  )
}

export default VotingItems
