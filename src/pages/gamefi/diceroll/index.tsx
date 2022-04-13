import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import Container from 'app/components/Container'
import SwapCroToWCro from 'app/components/SwapCroToWCro'
import GameRewardClaimPanel from 'app/components/GameRewardClaimPanel'
import { useRouter } from 'next/router'
import NavLink from 'app/components/NavLink'
import GameReviewPanel from 'app/components/GameReviewPanel'
import { DiceRollVolumePanel } from 'app/components/DiceRollVolumePanel'
import { DiceRollBetPanel } from 'app/components/DiceRollBetPanel'
import { DiceRollOption } from 'app/constants/gamefi'
import { DiceRollClaimRewardStatus, DiceRollStatus } from 'app/features/gamefi/diceroll/enum'
import { useCurrency, useGameFiTokens } from 'app/hooks/Tokens'
import { CRONA_ADDRESS, Currency, CurrencyAmount, Token } from '@cronaswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import { maxAmountSpend } from 'app/functions'
import { getBalanceAmount } from 'app/functions/formatBalance'
import {
  useDiceRollCallback_GameReview,
  useDiceRollCallback_PlaceBet,
  useDiceRollCallback_Volume,
  useEIP712BetSignMessageGenerator,
} from 'app/hooks/useDiceRollCallback'
import { ApprovalState } from 'app/hooks'
import BigNumber from 'bignumber.js'
import DiceRollBetModal from 'app/components/DiceRollBetModal'
import AnimationDice from 'app/components/AnimationDice'
import { GameType, GameReview, GameBetStatus } from 'app/features/gamefi'
const { default: axios } = require('axios')

const DiceRoll = () => {
  const { account, chainId, library } = useActiveWeb3React()

  const { i18n } = useLingui()

  const router = useRouter()
  const type = router.query.filter == null ? '' : (router.query.filter as string)
  const tabStyle = 'px-[27px] py-[8px] rounded text-base font-normal cursor-pointer'
  const activeTabStyle = `${tabStyle} bg-[#0D0C2B]`
  const inactiveTabStyle = `${tabStyle}`
  const [activeTab, setActiveTab] = useState<GameReview>(GameReview.ALLBETS)
  const [{ diceRollOption, diceRollResult, diceRollBetStatus, diceRollAfterBetError }, setDiceRollBetState] = useState<{
    diceRollOption: DiceRollOption
    diceRollResult: DiceRollStatus
    diceRollBetStatus: GameBetStatus
    diceRollAfterBetError: string
  }>({
    diceRollOption: {
      [DiceRollStatus.D1]: false,
      [DiceRollStatus.D2]: false,
      [DiceRollStatus.D3]: false,
      [DiceRollStatus.D4]: false,
      [DiceRollStatus.D5]: false,
      [DiceRollStatus.D6]: false,
    },
    diceRollResult: DiceRollStatus.NONE,
    diceRollBetStatus: GameBetStatus.NOTPLACED,
    diceRollAfterBetError: '',
  })

  const winningChance = useMemo(() => {
    let chance = 0
    Object.keys(diceRollOption).forEach((key) => {
      diceRollOption[key] && (chance += 100 / 6)
    })

    return chance
  }, [diceRollOption])

  const handleDiceSelect = (selection: DiceRollOption) => {
    setDiceRollBetState({
      diceRollOption: selection,
      diceRollAfterBetError,
      diceRollBetStatus,
      diceRollResult,
    })
  }
  //const defaultToken = useMemo(() => CRONA_ADDRESS[chainId], [chainId])
  const [selectedToken, setselectedToken] = useState<string>(CRONA_ADDRESS[chainId])
  useEffect(() => {
    setselectedToken(CRONA_ADDRESS[chainId])
  }, [chainId])

  const selectedCurrency = useCurrency(selectedToken)
  const selectedTokenBalance = useCurrencyBalance(account ?? undefined, selectedCurrency ?? undefined)
  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(selectedTokenBalance)

  const handleSelectToken = (token: string) => {
    setselectedToken(token)
  }

  const handleMax = () => {
    selectedTokenBalance.greaterThan(maxBetAmount?.toString())
      ? setinputValue(getBalanceAmount(new BigNumber(maxBetAmount?.toString()), selectedCurrency?.decimals).toString())
      : setinputValue(selectedTokenBalance.toExact())
  }

  const [inputValue, setinputValue] = useState<string>('0.0')
  const handleInputValue = (value) => {
    setinputValue(value)
  }
  const { totalBetsAmount, totalBetsCount } = useDiceRollCallback_Volume(selectedCurrency)
  // const selectedCurrencyAmount = tryParseAmount(inputValue, selectedCurrency)
  const {
    error: dicerollBetError,
    rewards,
    claimRewards,
    approvalState,
    approveCallback,
    contract: dicerollContract,
    betsCountByPlayer,
    multiplier,
    minBetAmount,
    maxBetAmount,
  } = useDiceRollCallback_PlaceBet(selectedCurrency, inputValue, totalBetsCount)

  const { betsByToken, betsByPlayer, topGamers } = useDiceRollCallback_GameReview(selectedCurrency, totalBetsCount)

  const [claimRewardStatus, setClaimRewardStatus] = useState<DiceRollClaimRewardStatus>(
    DiceRollClaimRewardStatus.NOTCLAIMED
  )
  const handleClaim = () => {
    setClaimRewardStatus(DiceRollClaimRewardStatus.PENDING)
    claimRewards(() => {
      setClaimRewardStatus(DiceRollClaimRewardStatus.NOTCLAIMED)
    })
  }

  const handleApprove = useCallback(async () => {
    approveCallback()
  }, [approveCallback])
  const showApproveFlow =
    !dicerollBetError && (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)
  const handleBetModalDismiss = () => {
    diceRollBetStatus !== GameBetStatus.PENDING &&
      setDiceRollBetState({
        diceRollAfterBetError,
        diceRollBetStatus: GameBetStatus.NOTPLACED,
        diceRollOption,
        diceRollResult,
      })
  }
  const placebet = async (signature) => {
    try {
      let diceRollOptionStr = ''
      for (let i = 0; i < 6; i++) {
        diceRollOptionStr += diceRollOption[i] ? '1' : '0'
      }
      const response = await axios.get('https://162.33.179.28/placebet', {
        params: {
          game: 'DiceRoll',
          player: account,
          amount: inputValue.toBigNumber(selectedCurrency?.decimals).toString(),
          choice: diceRollOptionStr,
          token: selectedToken,
          nonce: betsCountByPlayer.toString(),
          deadline: '0',
          signature: signature,
        },
      })

      console.log(response)
      const betPlaceResponse = response?.data
      router.push('#')
      if (betPlaceResponse?.error) throw new Error(betPlaceResponse?.error)

      setDiceRollBetState({
        diceRollResult: betPlaceResponse?.result,
        diceRollBetStatus: GameBetStatus.PLACED,
        diceRollAfterBetError,
        diceRollOption,
      })

      setinputValue('')
    } catch {
      setDiceRollBetState({
        diceRollResult,
        diceRollBetStatus: GameBetStatus.FATAL,
        diceRollAfterBetError: 'Network Error! Please check connection!',
        diceRollOption,
      })
    }
  }
  const { onSign: handleBet } = useEIP712BetSignMessageGenerator(
    'DiceRoll',
    '1',
    chainId,
    dicerollContract,
    account,
    inputValue.toBigNumber(selectedCurrency?.decimals),
    diceRollOption,
    selectedToken,
    betsCountByPlayer,
    0,
    () => {
      setDiceRollBetState({
        diceRollAfterBetError,
        diceRollBetStatus: GameBetStatus.PENDING,
        diceRollOption,
        diceRollResult,
      })
    },
    placebet,
    () => {},
    () => {
      setDiceRollBetState({
        diceRollAfterBetError: 'User rejected sign!',
        diceRollBetStatus: GameBetStatus.FATAL,
        diceRollOption,
        diceRollResult,
      })
    }
  )

  return (
    <Container id="diceroll-page" maxWidth="full" className="">
      <Head>
        <title key="title">DiceRoll | CronaSwap</title>
        <meta key="description" name="description" content="Welcome to CronaSwap" />
      </Head>
      <div className="relative flex flex-col items-center w-full">
        {/* <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-10 bg-red top-4 w-3/5 rounded-full z-0  filter blur-[150px]" /> */}
        <div className="flex flex-col items-center">
          <DiceRollBetModal
            isOpen={diceRollBetStatus !== GameBetStatus.NOTPLACED}
            onDismiss={handleBetModalDismiss}
            diceRollBetStatus={diceRollBetStatus}
            diceRollOption={diceRollOption}
            diceRollResult={diceRollResult}
            diceRollAfterBetError={diceRollAfterBetError}
          />
          {/* <div className="text-[5vw] font-bold text-white font-sans leading-[89.3px]">Coin Toss Game</div>
            <div className="max-w-[469px] text-center text-white text-[18px] leading-[24px] mt-[14px]"></div> */}

          <div className="mt-[64px] w-full">
            <DiceRollVolumePanel
              token={selectedCurrency}
              totalBetsCount={totalBetsCount}
              totalBetsAmount={totalBetsAmount}
              houseEdge={100 - multiplier}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex lg:flex-row flex-col items-center gap-10 mt-[64px]">
              <DiceRollBetPanel
                diceRollOption={diceRollOption}
                onDiceRollSelect={handleDiceSelect}
                winningChance={winningChance}
                onSelectToken={handleSelectToken}
                selectedToken={selectedCurrency}
                onMax={handleMax}
                inputValue={inputValue}
                onInputValue={handleInputValue}
                error={dicerollBetError}
                approvalState={approvalState}
                onApprove={handleApprove}
                showApproveFlow={showApproveFlow}
                onBet={handleBet}
                minBetAmount={minBetAmount}
                maxBetAmount={maxBetAmount}
                balance={selectedTokenBalance}
                multiplier={multiplier}
              />
              <div className="flex flex-col gap-10">
                <SwapCroToWCro />
                <GameRewardClaimPanel
                  rewards={rewards}
                  selectedCurrency={selectedCurrency}
                  onClaim={handleClaim}
                  claimRewardStatus={claimRewardStatus}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="w-[fit-content] h-[56px] mt-[64px] py-[8px] px-[8px] rounded bg-[#1C1B38]">
                <div className="flex flex-row">
                  <div
                    onClick={() => {
                      setActiveTab(GameReview.ALLBETS)
                    }}
                  >
                    <div className={activeTab === GameReview.ALLBETS ? activeTabStyle : inactiveTabStyle}>All Bets</div>
                    {/* <NavLink href="/cointoss?filter=allbets"></NavLink> */}
                  </div>
                  <div
                    onClick={() => {
                      setActiveTab(GameReview.YOURBETS)
                    }}
                  >
                    <div className={activeTab === GameReview.YOURBETS ? activeTabStyle : inactiveTabStyle}>
                      Your Bets
                    </div>
                    {/* <NavLink href="/cointoss?filter=yourbets"></NavLink> */}
                  </div>
                  <div
                    onClick={() => {
                      setActiveTab(GameReview.LEADERBOARD)
                    }}
                  >
                    <div className={activeTab === GameReview.LEADERBOARD ? activeTabStyle : inactiveTabStyle}>
                      Leaderboard
                    </div>
                    {/* <NavLink href="/cointoss?filter=leaderboard"></NavLink> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[22px] w-full">
              <GameReviewPanel
                game={GameType.DICEROLL}
                selectedToken={selectedCurrency}
                activeTab={activeTab}
                betsByToken={betsByToken}
                betsByPlayer={betsByPlayer}
                topGamers={topGamers}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
export default DiceRoll
