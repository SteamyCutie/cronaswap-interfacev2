import React, { CSSProperties, useCallback, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { BigNumber } from '@ethersproject/bignumber'
import { CoinTossReview, CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
import { Currency } from '@cronaswap/core-sdk'
import { shortenAddress, shortenString } from 'app/functions'
interface BetHistory {
  index: BigNumber
  txn: BigNumber
  player: string
  token: string
  amount: BigNumber
  playerOption: CoinTossStatus
  resultOption: CoinTossStatus
  wasSuccess: boolean
  rewards: BigNumber
}
interface TopGamer {
  // index: BigNumber
  player: string
  rewardsAmount: BigNumber
  count: BigNumber
}
interface GameReviewPanelProps {
  selectedToken: Currency | undefined
  activeTab: number | 0
  betsByIndex: Array<BetHistory> | []
  betsByPlayer: Array<BetHistory> | []
  topGamers: Array<TopGamer> | []
}

function GameReviewPanel({ selectedToken, activeTab, betsByIndex, topGamers, betsByPlayer }: GameReviewPanelProps) {
  const fixedListRef = useRef<FixedSizeList>()
  const itemData = useMemo(() => {
    switch (activeTab) {
      case CoinTossReview.ALLBETS:
        return betsByIndex
      case CoinTossReview.YOURBETS:
        return betsByPlayer
      case CoinTossReview.LEADERBOARD:
        return topGamers
      default:
        break
    }
  }, [activeTab, betsByIndex])

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    return index
  }, [])

  const hoverStyle = 'hover:bg-[#0D0C2B] hover:cursor-pointer hover:rounded'
  return (
    <div className="w-full h-[756px] bg-[#1C1B38] rounded flex flex-col">
      <div className="h-[64px]"></div>
      <div className="h-[1px] bg-[#AFAFC5] bg-opacity-30"></div>
      <div className="h-full pt-4 pb-6 pl-6 pr-4">
        <AutoSizer disableWidth>
          {({ height }) => (
            <FixedSizeList
              height={height}
              ref={fixedListRef as any}
              width="100%"
              itemData={itemData ?? []}
              itemCount={(itemData && itemData.length) ?? 0}
              itemSize={56}
              itemKey={itemKey}
            >
              {activeTab == CoinTossReview.ALLBETS
                ? ({ data, index, style }: { data: Array<BetHistory>; index: number; style: CSSProperties }) => (
                    <div style={style} key={index}>
                      {data[index] && selectedToken && (
                        <div className={`pl-2 relative flex flex-row ${hoverStyle}`}>
                          <div className="">{shortenAddress(data[index]?.player)}</div>
                          <div className="absolute ml-[200px]">{shortenString(data[index]?.txn.toString(), 8)}</div>

                          <div className="absolute ml-[420px]">
                            <div className="relative flex flex-row ">
                              <div>
                                {data[index]?.amount.div(BigNumber.from(10).pow(selectedToken?.decimals)).toFixed(2)}{' '}
                              </div>
                              <div className="absolute ml-10">{selectedToken?.symbol}</div>
                            </div>
                          </div>

                          <div className="absolute ml-[630px]">
                            {data[index]?.playerOption == CoinTossStatus.HEAD ? 'Head' : 'Tail'}
                          </div>
                          <div className="absolute ml-[820px]">
                            {data[index]?.resultOption == CoinTossStatus.HEAD ? 'Head' : 'Tail'}
                          </div>

                          <div className="absolute ml-[980px]">
                            <div className="relative flex flex-row ">
                              <div className="">
                                {data[index]?.rewards.div(BigNumber.from(10).pow(selectedToken?.decimals)).toFixed(2)}{' '}
                              </div>
                              <div className="absolute ml-10">{selectedToken?.symbol}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                : activeTab == CoinTossReview.LEADERBOARD
                ? ({ data, index, style }: { data: Array<TopGamer>; index: number; style: CSSProperties }) => (
                    <div style={style} key={index}>
                      {data[index] && selectedToken && (
                        <div className={`pl-2 relative flex flex-row ${hoverStyle}`}>
                          <div className="">{shortenAddress(data[index]?.player)}</div>
                          <div className="absolute ml-[454px]">{data[index]?.count.toNumber()}</div>
                          <div className="absolute ml-[860px]">
                            <div className="relative flex flex-row ">
                              <div className="">
                                {data[index]?.rewardsAmount
                                  .div(BigNumber.from(10).pow(selectedToken?.decimals))
                                  .toFixed(2)}{' '}
                              </div>
                              <div className="absolute ml-10">{selectedToken?.symbol}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                : activeTab == CoinTossReview.YOURBETS
                ? ({ data, index, style }: { data: Array<BetHistory>; index: number; style: CSSProperties }) => (
                    <div style={style} key={index}>
                      {data[index] && selectedToken && (
                        <div className={`pl-2 relative flex flex-row ${hoverStyle}`}>
                          <div className="">{shortenAddress(data[index]?.player)}</div>
                          <div className="absolute ml-[200px]">{shortenString(data[index]?.txn.toString(), 8)}</div>
                          <div className="absolute ml-[420px]">
                            <div className="relative flex flex-row ">
                              <div className="">
                                {data[index]?.amount.div(BigNumber.from(10).pow(selectedToken?.decimals)).toFixed(2)}{' '}
                              </div>
                              <div className="absolute ml-10">{selectedToken?.symbol}</div>
                            </div>
                          </div>
                          <div className="absolute ml-[630px]">
                            {data[index]?.playerOption == CoinTossStatus.HEAD ? 'Head' : 'Tail'}
                          </div>
                          <div className="absolute ml-[820px]">
                            {data[index]?.resultOption == CoinTossStatus.HEAD ? 'Head' : 'Tail'}
                          </div>
                          <div className="absolute ml-[980px]">
                            <div className="relative flex flex-row ">
                              <div className="">
                                {data[index]?.rewards.div(BigNumber.from(10).pow(selectedToken?.decimals)).toFixed(2)}{' '}
                              </div>
                              <div className="absolute ml-10">{selectedToken?.symbol}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                : ({ data, index, style }) => (
                    <div style={style} key={index}>
                      {data[index] && (
                        <div className="flex flex-row gap-2">
                          {Object.keys(data[index]).map((e) => (
                            <div className="" key={e}>
                              {data[index][e]?.toString()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default GameReviewPanel
