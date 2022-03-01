import { CurrencyLogoArray } from '../../components/CurrencyLogo'
import Checkbox from 'app/components/Checkbox'
import { useState } from 'react'

export const SelectItem = ({ item, triggerBoost }) => {
  const handleSet = () => {
    triggerBoost(item)
  }
  return (
    <div className="flex items-center gap-2 hover:cursor-pointer">
      <Checkbox color="blue" className="w-4 h-4 border-2 rounded-sm border-dark-650" set={handleSet} />
      <div className="text-base text-dark-650 hover:text-blue">{item.name} LP</div>
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
