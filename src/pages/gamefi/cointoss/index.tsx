import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import Container from 'app/components/Container'
import { CoinTossBetPanel } from 'app/components/CoinTossBetPanel'
import { CoinTossVolumePanel } from 'app/components/CoinTossVolumePanel'
import SwapCroToWCro from 'app/components/SwapCroToWCro'
import GameRewardClaimPanel from 'app/components/GameRewardClaimPanel'
import { useRouter } from 'next/router'
import NavLink from 'app/components/NavLink'
import { CoinTossBetStatus, CoinTossClaimRewardStatus, CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
import GameReviewPanel from 'app/components/GameReviewPanel'
import { useCurrency, useGameFiTokens } from 'app/hooks/Tokens'
import { CRONA_ADDRESS, Currency, CurrencyAmount } from '@cronaswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import { maxAmountSpend, tryParseAmount } from 'app/functions'
import {
  useCoinTossCallback_GameReview,
  useCoinTossCallback_PlaceBet,
  useCoinTossCallback_Volume,
  useEIP712BetSignMessageGenerator,
} from 'app/hooks/useCoinTossCallback'
import { ApprovalState, useCoinTossContract } from 'app/hooks'
import { splitSignature } from '@ethersproject/bytes'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'app/functions/formatBalance'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import CoinTossBetModal from 'app/components/CoinTossBetModal'
import { GameType, GameReview } from 'app/features/gamefi'
const { default: axios } = require('axios')

export default function CoinToss() {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const router = useRouter()
  const type = router.query.filter == null ? 'allbet' : (router.query.filter as string)
  const tabStyle = 'px-[27px] py-[8px] rounded text-base font-normal cursor-pointer'
  const activeTabStyle = `${tabStyle} bg-[#0D0C2B]`
  const inactiveTabStyle = `${tabStyle}`

  const FILTER = {
    allbets: GameReview.ALLBETS,
    yourbets: GameReview.YOURBETS,
    leaderboard: GameReview.LEADERBOARD,
  }
  const [activeTab, setActiveTab] = useState<GameReview>(0)
  const [coinTossStatus, setCoinTossStatus] = useState<CoinTossStatus>(CoinTossStatus.NONE)
  const [coinTossResult, setcoinTossResult] = useState<CoinTossStatus>(CoinTossStatus.NONE)

  const handleCoinTossSelect = (selection: CoinTossStatus) => {
    setCoinTossStatus(selection)
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
  const { totalBetsAmount, totalBetsCount, headsCount, tailsCount } = useCoinTossCallback_Volume(selectedCurrency)
  // const selectedCurrencyAmount = tryParseAmount(inputValue, selectedCurrency)
  const {
    error: cointossBetError,
    rewards,
    claimRewards,
    approvalState,
    approveCallback,
    contract: cointossContract,
    betsCountByPlayer,
    multiplier,
    minBetAmount,
    maxBetAmount,
  } = useCoinTossCallback_PlaceBet(selectedCurrency, inputValue, totalBetsCount)

  const { betsByToken, betsByPlayer, topGamers } = useCoinTossCallback_GameReview(selectedCurrency, totalBetsCount)

  const [claimRewardStatus, setClaimRewardStatus] = useState<CoinTossClaimRewardStatus>(
    CoinTossClaimRewardStatus.NOTCLAIMED
  )
  const handleClaim = () => {
    setClaimRewardStatus(CoinTossClaimRewardStatus.PENDING)
    claimRewards(() => {
      setClaimRewardStatus(CoinTossClaimRewardStatus.NOTCLAIMED)
    })
  }

  const handleApprove = useCallback(async () => {
    approveCallback()
  }, [approveCallback])
  const showApproveFlow =
    !cointossBetError && (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING)
  const [betStatus, setbetStatus] = useState<CoinTossBetStatus>(CoinTossBetStatus.NOTPLACED)
  const handleBetModalDismiss = () => {
    betStatus !== CoinTossBetStatus.PENDING && setbetStatus(CoinTossBetStatus.NOTPLACED)
  }
  const placebet = async (signature) => {
    try {
      //http://162.33.179.28/placebetcointoss
      const response = await axios.get('http://162.33.179.28/placebet', {
        params: {
          game: 'CoinToss',
          player: account,
          amount: inputValue.toBigNumber(selectedCurrency?.decimals).toString(),
          choice: coinTossStatus.toString(),
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

      setcoinTossResult(betPlaceResponse?.result)

      setbetStatus(CoinTossBetStatus.PLACED)
      setinputValue('')
    } catch {
      setbetStatus(CoinTossBetStatus.NOTPLACED)
    }
  }
  const { onSign: handleBet } = useEIP712BetSignMessageGenerator(
    'CoinToss',
    '1',
    chainId,
    cointossContract,
    account,
    inputValue.toBigNumber(selectedCurrency?.decimals),
    coinTossStatus,
    selectedToken,
    betsCountByPlayer,
    0,
    () => {
      setbetStatus(CoinTossBetStatus.PENDING)
    },
    placebet,
    () => {},
    () => {
      setbetStatus(CoinTossBetStatus.NOTPLACED)
    }
  )

  return (
    <Container id="cointoss-page" maxWidth="full" className="">
      <Head>
        <title key="title">CoinToss | CronaSwap</title>
        <meta key="description" name="description" content="Welcome to CronaSwap" />
      </Head>
      <div className="relative flex flex-col items-center w-full">
        {/* <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-10 bg-red top-4 w-3/5 rounded-full z-0  filter blur-[150px]" /> */}
        <div className="flex flex-col items-center">
          <CoinTossBetModal
            isOpen={betStatus !== CoinTossBetStatus.NOTPLACED}
            onDismiss={handleBetModalDismiss}
            coinTossBetStatus={betStatus}
            coinTossStatus={coinTossStatus}
            coinTossResult={coinTossResult}
          />
          {/* <div className="text-[5vw] font-bold text-white font-sans leading-[89.3px]">Coin Toss Game</div>
            <div className="max-w-[469px] text-center text-white text-[18px] leading-[24px] mt-[14px]"></div> */}

          <div className="mt-[64px] w-full">
            <CoinTossVolumePanel
              token={selectedCurrency}
              totalBetsCount={totalBetsCount}
              totalBetsAmount={totalBetsAmount}
              headWinRate={headsCount + tailsCount === 0 ? 0 : (100.0 * headsCount) / (headsCount + tailsCount)}
              tailWinRate={headsCount + tailsCount === 0 ? 0 : (100.0 * tailsCount) / (headsCount + tailsCount)}
              houseEdge={100 - multiplier}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex lg:flex-row flex-col items-center gap-10 mt-[64px]">
              <CoinTossBetPanel
                coinTossStatus={coinTossStatus}
                onCoinTossSelect={handleCoinTossSelect}
                onSelectToken={handleSelectToken}
                selectedToken={selectedCurrency}
                onMax={handleMax}
                inputValue={inputValue}
                onInputValue={handleInputValue}
                error={cointossBetError}
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
                game={GameType.COINTOSS}
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
