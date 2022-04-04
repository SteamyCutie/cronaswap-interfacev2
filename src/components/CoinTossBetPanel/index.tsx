import { CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
import { useActiveWeb3React } from 'app/services/web3'
import InformationHelper from '../InformationHelper'
import Web3Connect from '../Web3Connect'
import Image from 'next/image'
import BetAmountInputPanel from '../BetAmountInputPanel'
import { splitSignature } from '@ethersproject/bytes'
import { useState } from 'react'
import { tryParseAmount } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useCoinTossContract } from 'app/hooks'
import { ButtonConfirmed } from '../Button'
import Loader from '../Loader'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { BigNumber as BN } from '@ethersproject/bignumber'
import BigNumber from 'bignumber.js'

interface CoinTossBetPanelProps {
  coinTossStatus: CoinTossStatus
  onCoinTossSelect: (value: CoinTossStatus) => void
  selectedToken: string | ''
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
}

export const CoinTossBetPanel = ({
  coinTossStatus,
  onCoinTossSelect,
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
}: CoinTossBetPanelProps) => {
  const { account, chainId, library } = useActiveWeb3React()
  const selectedCurrency = useCurrency(selectedToken)

  return (
    <div className="w-[605px] h-[834px] bg-[#1C1B38] rounded relative">
      <div className="w-[252px] h-[69px] absolute top-[40px] left-[40px]">
        <h4 className="text-[36px] leading-[44.65px] font-bold text-white">Coin Toss</h4>
        <p className="text-[14px] leading-[16px] font-normal text-[#AFAFC5] mt-[8px]">
          Guess corrctly and double your money
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
      <div className="absolute top-[173px] w-full text-center font-bold text-base text-white">Select Head or Tail</div>
      <div className="absolute top-[231px] left-[150px] w-[304px] h-[120px] flex justify-between">
        <button
          onClick={() => {
            onCoinTossSelect(CoinTossStatus.HEAD)
          }}
        >
          {coinTossStatus == CoinTossStatus.HEAD ? (
            <Image
              src="/images/pages/gamefi/cointoss/coin-head-active.png"
              width="120px"
              height="120px"
              alt="Coin Head Active"
            />
          ) : (
            <Image
              src="/images/pages/gamefi/cointoss/coin-head-inactive.png"
              width="120px"
              height="120px"
              alt="Coin Head Inactive"
            />
          )}
        </button>
        <button
          onClick={() => {
            onCoinTossSelect(CoinTossStatus.TAIL)
          }}
        >
          {coinTossStatus == CoinTossStatus.TAIL ? (
            <Image
              src="/images/pages/gamefi/cointoss/coin-tail-active.png"
              width="120px"
              height="120px"
              alt="Coin Tail Active"
            />
          ) : (
            <Image
              src="/images/pages/gamefi/cointoss/coin-tail-inactive.png"
              width="120px"
              height="120px"
              alt="Coin Tail Inactive"
            />
          )}
        </button>
      </div>
      <div className="absolute top-[453px] left-[64px] right-[64px]">
        <BetAmountInputPanel
          onSelectToken={onSelectToken}
          selectedToken={selectedCurrency}
          onMax={onMax}
          inputValue={inputValue}
          onInputValue={onInputValue}
          maxBetAmount={maxBetAmount}
          minBetAmount={minBetAmount}
        />
        <div className="w-[476px] h-[65px] mt-[40px]">
          <div className="flex flex-col gap-[17px]">
            <div className="flex flex-row justify-between">
              <div className="text-base font-normal align-middle">Your odds:</div>
              <div className="text-[14px] leading-[24px] font-bold">{'-'}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="text-base font-normal align-middle">Winning Payout:</div>
              <div className="text-[14px] leading-[24px] font-bold">
                {'0'}
                {'WCRO'}
              </div>
            </div>
          </div>
        </div>
        <div className="items-stretch w-[474px] h-[60px] mt-[64px]">
          {!account ? (
            <Web3Connect color="blue" className="w-full h-full text-base text-white" />
          ) : coinTossStatus === CoinTossStatus.NONE ? (
            <button className="w-full h-full bg-black rounded cursor-not-allowed" disabled={true}>
              Choose Head or Tail
            </button>
          ) : showApproveFlow ? (
            <div>
              {approvalState !== ApprovalState.APPROVED && (
                <ButtonConfirmed onClick={onApprove} disabled={approvalState !== ApprovalState.NOT_APPROVED} size="lg">
                  {approvalState === ApprovalState.PENDING ? (
                    <div className="flex items-center justify-center h-full space-x-2">
                      <div>Approving</div>
                      <Loader stroke="white" />
                    </div>
                  ) : (
                    i18n._(t`Approve ${selectedCurrency?.symbol}`)
                  )}
                </ButtonConfirmed>
              )}
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
              Bet {coinTossStatus === CoinTossStatus.HEAD ? 'Head' : 'Tail'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
