import { useActiveWeb3React } from 'app/services/web3'
import InformationHelper from '../InformationHelper'
import Web3Connect from '../Web3Connect'
import { DiceRollOption } from 'app/constants/gamefi'
import { DiceRollStatus } from 'app/features/gamefi/diceroll/enum'
import BetAmountInputPanel from '../BetAmountInputPanel'
import Loader from '../Loader'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { BigNumber as BN } from '@ethersproject/bignumber'
import BigNumber from 'bignumber.js'
import { Currency, CurrencyAmount } from '@cronaswap/core-sdk'
import { ApprovalState } from 'app/hooks'
import { ButtonConfirmed } from '../Button'
import { useMemo } from 'react'

interface DiceRollBetPanelProps {
  diceRollOption: DiceRollOption
  onDiceRollSelect: (value: DiceRollOption) => void
  winningChance: number | 0
  selectedToken: Currency | undefined
  onSelectToken: (value: string) => void
  onMax
  inputValue: string | ''
  onInputValue: (value: string) => void
  error: string | ''
  onBet: () => void
  approvalState: ApprovalState | undefined
  onApprove: () => void
  showApproveFlow: boolean | 'false'
  minBetAmount: BN | undefined
  maxBetAmount: BN | undefined
  balance: CurrencyAmount<Currency>
  multiplier: number | 0
}

const Dice = ({ diceSide, isSelected, onDiceSelect }) => {
  const dotBGStyle = useMemo(() => (isSelected ? ' bg-white' : ' bg-[#3089D6]'), [isSelected])
  return (
    <div
      className={`cursor-pointer w-[64px] h-[64px] px-3 py-3 border border-[#AFAFC5] rounded grid hover:bg-slate-800 active:bg-slate-700 ${
        isSelected && 'bg-[#3089D6]'
      }`}
      onClick={() => {
        onDiceSelect(diceSide, !isSelected)
      }}
    >
      {diceSide == DiceRollStatus.D1 ? (
        <div className={'rounded w-[10px] h-[10px] place-self-center' + dotBGStyle}></div>
      ) : diceSide == DiceRollStatus.D2 ? (
        <>
          <div className={'rounded w-[10px] h-[10px] place-self-start' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px] place-self-end' + dotBGStyle}></div>
        </>
      ) : diceSide == DiceRollStatus.D3 ? (
        <>
          <div className={'rounded w-[10px] h-[10px] place-self-start' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px] place-self-center' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px] place-self-end' + dotBGStyle}></div>
        </>
      ) : diceSide == DiceRollStatus.D4 ? (
        <>
          <div className="grid grid-cols-2 grid-rows-2 gap-5">
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          </div>
        </>
      ) : diceSide == DiceRollStatus.D5 ? (
        <>
          <div className="absolute rounded w-[10px] h-[10px] place-self-center"></div>
          <div className="grid grid-cols-2 grid-rows-2 gap-5">
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
            <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          </div>
        </>
      ) : diceSide == DiceRollStatus.D6 ? (
        <div className="grid grid-cols-2 grid-rows-3 gap-x-5 gap-y-1">
          <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
          <div className={'rounded w-[10px] h-[10px]' + dotBGStyle}></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export const DiceRollBetPanel = ({
  diceRollOption,
  onDiceRollSelect,
  winningChance,
  onSelectToken,
  selectedToken,
  onMax,
  inputValue,
  onInputValue,
  error,
  onBet,
  approvalState,
  onApprove,
  showApproveFlow,
  minBetAmount,
  maxBetAmount,
  balance,
  multiplier,
}: DiceRollBetPanelProps) => {
  const { account, chainId, library } = useActiveWeb3React()
  const IsAnyChoiceSelected = (opt: DiceRollOption) =>
    opt[DiceRollStatus.D1] ||
    opt[DiceRollStatus.D2] ||
    opt[DiceRollStatus.D3] ||
    opt[DiceRollStatus.D4] ||
    opt[DiceRollStatus.D5] ||
    opt[DiceRollStatus.D6]

  const handleDiceSelect = (diceSide: DiceRollStatus, isSelected: boolean) => {
    onDiceRollSelect({ ...diceRollOption, [diceSide]: isSelected })
  }

  return (
    <div className="w-[605px] h-[834px] bg-[#1C1B38] rounded relative">
      <div className="h-[69px] absolute top-[40px] left-[40px]">
        <h4 className="text-[36px] leading-[44.65px] font-bold text-white">Dice Roll</h4>
        <p className="text-[14px] leading-[16px] font-normal text-[#AFAFC5] mt-[8px]">
          6 different sides of dice. Guess the right one and vwala!
        </p>
      </div>
      <div className="w-[139px] h-[40px] absolute top-[40px] right-[64px] bg-[#0D0C2B] rounded">
        <div className="mt-[12px] ml-[16px] font-normal text-[14px] leading-[16px] flex">
          How it works
          <InformationHelper
            text={
              'Coin Toss is a single game, the user flips the coin and calls “heads” or “tails.” If the call matches the result, the player wins the flip. Otherwise, the player loses the flip. If the bet is correct, the user earns 1.96x.\nGame Play\n1. Start by setting your Bet Amount.\n2. Select your coin, guess what will come up: heads or tails.\n 3. After you are ALL set, place your bet and press the BET button to start the game.'
            }
          />
        </div>
      </div>
      <div className="flex flex-col mx-[64px] top-[173px] items-center relative">
        <div className="text-base font-bold text-center text-white">Select dice side</div>
        <div className="mt-[64px] w-[474px] h-[64px] flex flex-row gap-[18px]">
          {[0, 1, 2, 3, 4, 5].map((e) => (
            <Dice diceSide={e} isSelected={diceRollOption[e]} onDiceSelect={handleDiceSelect} key={e}></Dice>
          ))}
        </div>
        <div className="mt-[100px] w-full">
          <BetAmountInputPanel
            onSelectToken={onSelectToken}
            selectedToken={selectedToken}
            onMax={onMax}
            inputValue={inputValue}
            onInputValue={onInputValue}
            maxBetAmount={maxBetAmount}
            minBetAmount={minBetAmount}
            balance={balance}
          />
        </div>

        <div className="w-full h-[65px] mt-[40px]">
          <div className="flex flex-col gap-[17px]">
            <div className="flex flex-row justify-between">
              <div className="text-base font-normal align-middle">Your odds:</div>
              <div className="text-[14px] leading-[24px] font-bold">{((multiplier * 6) / 100).toFixed(2)} x</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="text-base font-normal align-middle">Winning Chance:</div>
              <div className="text-[14px] leading-[24px] font-bold">{winningChance.toFixed(2)} %</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="text-base font-normal align-middle">Winning Payout:</div>
              <div className="text-[14px] leading-[24px] font-bold flex flex-row gap-2">
                <div>{(((multiplier * 6) / 100) * parseFloat(inputValue)).toFixed(2)}</div>
                <div>{selectedToken?.symbol}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="items-stretch w-[474px] h-[60px] mt-[64px]">
          {!account ? (
            <Web3Connect color="blue" className="w-full h-full text-base text-white" />
          ) : !IsAnyChoiceSelected(diceRollOption) ? (
            <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
              Choose more than one choice
            </button>
          ) : winningChance > 83.4 ? (
            <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
              100 % Chance - You just loose edge amount
            </button>
          ) : showApproveFlow && approvalState !== ApprovalState.APPROVED ? (
            <div>
              {
                <ButtonConfirmed onClick={onApprove} disabled={approvalState !== ApprovalState.NOT_APPROVED} size="lg">
                  {approvalState === ApprovalState.PENDING ? (
                    <div className="flex items-center justify-center h-full space-x-2">
                      <div>Approving</div>
                      <Loader stroke="white" />
                    </div>
                  ) : (
                    i18n._(t`Approve ${selectedToken?.symbol}`)
                  )}
                </ButtonConfirmed>
              }
            </div>
          ) : Boolean(error) ? (
            <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
              {error}
            </button>
          ) : (
            <button
              className="w-full h-full bg-[#2172E5] rounded hover:bg-light-blue"
              onClick={() => {
                onBet()
              }}
            >
              Bet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
