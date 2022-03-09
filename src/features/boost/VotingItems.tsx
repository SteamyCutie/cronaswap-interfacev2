import { CurrencyLogoArray } from '../../components/CurrencyLogo'
import Checkbox from 'app/components/Checkbox'
import { Token } from '@cronaswap/core-sdk'
import { useCallback, useEffect, useState } from 'react'

export const SelectItem = ({ item, triggerBoost }) => {
  const handleSet = () => {
    triggerBoost(item)
  }
  return (
    <div className="flex items-center gap-2 hover:cursor-pointer">
      <Checkbox color="blue" checked={item.isBoost} className="w-4 h-4 border-2 rounded-sm border-dark-650" set={handleSet} />
      <div className="text-base text-dark-650 hover:text-blue text-[15px]">{item.name} LP</div>
    </div>
  )
}

export const VoteInputItem = ({ id, token0, token1, chainId, value, inputHandler }) => {
  const [val, setVal] = useState(value)
  const [focus, setFocus] = useState(false)
  const enforcer = (e: any) => {
    let nextValue = ~~e.target.value
    nextValue = nextValue > 100 ? 100 : nextValue
    nextValue = nextValue < 0 ? 0 : nextValue
    nextValue = nextValue === NaN ? 0 : nextValue
    inputHandler(id, nextValue)
    setVal(nextValue)
  }
  useEffect(() => { setVal(value) }, [value])
  const Token0 = new Token(chainId, token0.id, token0.decimals, token0.symbol, token0.name)
  const Token1 = new Token(chainId, token1.id, token1.decimals, token1.symbol, token1.name)
  return (
    <div className={`flex items-center h-12 px-2 py-1 border-[1px] rounded-md w-full lg:w-full ${focus ? 'border-blue/60' : 'border-dark-650'}`}>
      <div className="flex items-center gap-2">
        {Token0 && Token1 && <CurrencyLogoArray currencies={[Token0, Token1]} dense size={28} />}
        <div>%</div>
      </div>
      <input
        type="text"
        className="w-full px-1 text-xs bg-transparent "
        value={val > 0 ? val : ''}
        placeholder={`${Token0.symbol}-${Token1.symbol} LP`}
        onChange={enforcer}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  )
}

const VotingItems = ({ token0, token1, chainId, vote, weight }) => {

  const Token0 = new Token(chainId, token0.id, token0.decimals, token0.symbol, token0.name)
  const Token1 = new Token(chainId, token1.id, token1.decimals, token1.symbol, token1.name)
  return (
    <div className="flex justify-between p-2">
      <div className='flex w-2/5 items-center align-middle text-[14px] gap-2'>
        {Token0 && Token1 && (
          <CurrencyLogoArray currencies={[Token0, Token1]} dense size={window.innerWidth > 968 ? 28 : 24} />
        )}
        {`${Token0.symbol}-${Token1.symbol} LP`}
      </div>
      <div className="flex w-2/5 justify-center items-center align-middle text-[14px]">{vote}</div>
      <div className="flex w-1/5 justify-end items-center align-middle text-[14px]">{weight}</div>
    </div >
  )
}

export default VotingItems
