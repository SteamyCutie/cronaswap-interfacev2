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
import { CoinTossBetStatus, CoinTossReview, CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
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
} from 'app/hooks/useCoinTossCallback'
import { ApprovalState, useCoinTossContract } from 'app/hooks'
import { splitSignature } from '@ethersproject/bytes'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'app/functions/formatBalance'
import { useSingleCallResult } from 'app/state/multicall/hooks'
import CoinTossBetModal from 'app/components/CoinTossBetModal'
const { default: axios } = require('axios')

export default function CoinToss() {
  const { account, chainId, library } = useActiveWeb3React()
  const { i18n } = useLingui()

  const router = useRouter()
  const type = router.query.filter == null ? 'allbet' : (router.query.filter as string)
  const tabStyle = 'px-[27px] py-[8px] rounded text-base font-normal cursor-pointer'
  const activeTabStyle = `${tabStyle} bg-[#0D0C2B]`
  const inactiveTabStyle = `${tabStyle}`

  const FILTER = {
    allbets: CoinTossReview.ALLBETS,
    yourbets: CoinTossReview.YOURBETS,
    leaderboard: CoinTossReview.LEADERBOARD,
  }
  const [activeTab, setActiveTab] = useState<CoinTossReview>(0)
  const [coinTossStatus, setCoinTossStatus] = useState<CoinTossStatus>(CoinTossStatus.NONE)
  const [coinTossResult, setcoinTossResult] = useState<CoinTossStatus>(CoinTossStatus.NONE)

  const handleCoinTossSelect = (selection: CoinTossStatus) => {
    setCoinTossStatus(selection)
  }

  const [selectedToken, setselectedToken] = useState<string>(CRONA_ADDRESS[chainId])
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

  const selectedCurrencyAmount = tryParseAmount(inputValue, selectedCurrency)
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

  const { betsByIndex, betsByPlayer, topGamers } = useCoinTossCallback_GameReview(selectedCurrency, totalBetsCount)

  const handleClaim = () => {
    claimRewards()
  }
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])
  const showApproveFlow =
    !cointossBetError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED))
  const [signatureData, setSignatureData] = useState(null)
  const [betStatus, setbetStatus] = useState<CoinTossBetStatus>(CoinTossBetStatus.NOTPLACED)
  const handleBetModalDismiss = () => {
    betStatus !== CoinTossBetStatus.PENDING && setbetStatus(CoinTossBetStatus.NOTPLACED)
  }
  const handleBet = () => {
    const msgParams = JSON.stringify({
      domain: {
        // Give a user friendly name to the specific contract you are signing for.
        name: 'CoinToss',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: chainId,
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: cointossContract.address,
      },

      // Defining the message signing data content.
      message: {
        player: account,
        amount: inputValue.toBigNumber(selectedCurrency?.decimals).toString(),
        choice: coinTossStatus.toString(),
        token: selectedToken,
        nonce: betsCountByPlayer,
        deadline: 0,
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'PlaceBet',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Refer to PrimaryType
        PlaceBet: [
          { name: 'player', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'choice', type: 'uint256' },
          { name: 'token', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
    })

    const placebet = async (signature) => {
      const response = await axios.get('http://localhost:8080/placebet', {
        params: {
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
      setbetStatus(CoinTossBetStatus.PLACED)
      router.push('#')
      setinputValue('')
    }

    setbetStatus(CoinTossBetStatus.PENDING)
    library
      .send('eth_signTypedData_v4', [account, msgParams])
      .then(
        (signature) => {
          placebet(signature)
          return splitSignature(signature)
        },
        (reason) => {
          setbetStatus(CoinTossBetStatus.NOTPLACED)
        }
      )
      .then(
        (signature) => {
          setSignatureData(signature)
        },
        (reason) => {}
      )
  }

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
            coinTossResult={coinTossStatus}
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
              houseEdge={1}
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
                <GameRewardClaimPanel rewards={rewards} selectedCurrency={selectedCurrency} onClaim={handleClaim} />
              </div>
            </div>
            <div className="w-full">
              <div className="w-[fit-content] h-[56px] mt-[64px] py-[8px] px-[8px] rounded bg-[#1C1B38]">
                <div className="flex flex-row">
                  <div
                    onClick={() => {
                      setActiveTab(CoinTossReview.ALLBETS)
                    }}
                  >
                    <div className={activeTab === CoinTossReview.ALLBETS ? activeTabStyle : inactiveTabStyle}>
                      All Bets
                    </div>
                    {/* <NavLink href="/cointoss?filter=allbets"></NavLink> */}
                  </div>
                  <div
                    onClick={() => {
                      setActiveTab(CoinTossReview.YOURBETS)
                    }}
                  >
                    <div className={activeTab === CoinTossReview.YOURBETS ? activeTabStyle : inactiveTabStyle}>
                      Your Bets
                    </div>
                    {/* <NavLink href="/cointoss?filter=yourbets"></NavLink> */}
                  </div>
                  <div
                    onClick={() => {
                      setActiveTab(CoinTossReview.LEADERBOARD)
                    }}
                  >
                    <div className={activeTab === CoinTossReview.LEADERBOARD ? activeTabStyle : inactiveTabStyle}>
                      Leaderboard
                    </div>
                    {/* <NavLink href="/cointoss?filter=leaderboard"></NavLink> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[22px]">
              <GameReviewPanel
                selectedToken={selectedCurrency}
                activeTab={activeTab}
                betsByIndex={betsByIndex}
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
