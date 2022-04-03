import React from 'react'
import { Currency, CurrencyAmount, Percent, Token } from '@cronaswap/core-sdk'
import { useCurrency, useGameFiTokens } from 'app/hooks/Tokens'
import { ChevronDownIcon } from '@heroicons/react/solid'
import Input from '../Input'
import { CurrencyLogo } from '../CurrencyLogo'

interface BetAmountInputPanelProps {
  selectedToken: string | ''
  onSelectToken: (value: string) => void
  minBetAmount?: string | ''
  maxBetAmount?: string | ''
  onMax: () => void
  inputValue: string
  onInputValue: (value: string) => void
}
export default function BetAmountInputPanel({
  selectedToken,
  onSelectToken,
  maxBetAmount,
  minBetAmount,
  onMax,
  inputValue,
  onInputValue,
}: BetAmountInputPanelProps) {
  const gameFiTokens = useGameFiTokens()
  const tokenList = Object.values(gameFiTokens)

  const inputCurrency = useCurrency(selectedToken)

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between w-full">
        <div>Bet amount</div>
        <div className="flex flex-row gap-1 align-middle">
          <div className="text-[12px] leading-[24px] font-medium">Limit: </div>
          <div className="text-blue text-[14px] leading-[24px] font-bold">{30} </div>
          <div className="text-[12px] leading-[24px] font-medium">Max: </div>
          <div className="text-blue text-[14px] leading-[24px] font-bold">{3000}</div>
          <div className="text-[14px] leading-[24px] font-bold">{'WCRO'}</div>
        </div>
      </div>
      <div className="rounded border border-[#2172E5] w-full h-[60px] bg-[#0D0C2B] mt-[8px] flex flex-row items-center">
        <div className="relative inline-block w-[181px] h-full group">
          <button className="flex items-center w-full h-full px-[18px] pl-4 font-semibold rounded-l text-[16px] leading-[16px]">
            <CurrencyLogo currency={inputCurrency} size={'24px'} />
            <span className="ml-2">{gameFiTokens[selectedToken].symbol}</span>
            <ChevronDownIcon className="ml-3" width={16} height={16} />
          </button>
          <ul className="hidden pt-1 group-hover:block">
            {tokenList.map((token) => {
              return (
                <li
                  className={selectedToken === token.address ? 'hidden' : 'w-full'}
                  onClick={() => {
                    onSelectToken(token.address)
                  }}
                  key={token.address}
                >
                  <a
                    className={
                      'flex items-center px-4 py-2 whitespace-no-wrap bg-dark-800 hover:bg-gray-900 text-[16px] leading-[16px] align-middle font-semibold text-center' +
                      (tokenList[tokenList.length - 1].address === token.address ? ' rounded-b' : '')
                    }
                    href="#"
                  >
                    <CurrencyLogo currency={token} size={'24px'} />
                    <span className="ml-2">{token.symbol}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="h-[40px] w-[1px] bg-[#AFAFC5] mr-10 align-middle"></div>

        <Input.Numeric
          id="token-amount-input"
          value={inputValue}
          onUserInput={(val) => {
            onInputValue(val)
          }}
        />
        <button
          className="bg-[#2172E51A] w-[73px] text-[#2172E5] h-full font-semibold text-[16px] leading-[16px] rounded-r"
          onClick={() => {
            onMax()
          }}
        >
          MAX
        </button>
      </div>
    </div>
  )
}
