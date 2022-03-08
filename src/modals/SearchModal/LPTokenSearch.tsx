import { ChainId, Currency, NATIVE, Pair, Token } from '@cronaswap/core-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { filterTokens, useSortedTokensByQuery } from '../../functions/filtering'
import { useAllTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from '../../hooks/Tokens'

import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import ModalHeader from '../../components/ModalHeader'
import { useActiveWeb3React } from '../../services/web3'
import { useRouter } from 'next/router'
import useFarms from '../../features/farms/useFarms'
import useFuse from '../../hooks/useFuse'
import useSortableData from '../../hooks/useSortableData'
import LPTokenList from './LPTokenList'
import Search from 'app/components/Search'
import useFarmsV2 from 'app/features/farms/useFarmsV2'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'app/state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'app/state/wallet/hooks'
import { useV2Pairs } from 'app/hooks/useV2Pairs'

interface LPTokenSearchProps {
  onDismiss: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
  hideBalance: boolean
  onLPTokenSelect: (lpToken: Object) => void
}

export function LPTokenSearch({
  onDismiss,
  showImportView,
  setImportToken,
  hideBalance = false,
  onLPTokenSelect,
}: LPTokenSearchProps) {
  const { chainId, account } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const router = useRouter()
  const type = router.query.filter == null ? 'zapOut' : (router.query.filter as string)

  const query = useFarmsV2()

  let tokenPrice = 0
  let totalTvlInUSD = 0

  query?.farms.map((farm: any) => {
    tokenPrice = farm.tokenPrice
    totalTvlInUSD = farm.totalTvlInUSD
  })

  const FILTER = {
    all: (farm) => farm.multiplier !== 0,
    inactive: (farm) => farm.multiplier == 0,
    zapOut: (farm) => farm.isZap == true,
  }

  const datas = query?.farms.filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
  })

  // Search Setup
  const options = { keys: ['symbol', 'name', 'lpToken'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: datas && datas.length > 0 ? datas : [],
    options,
  })

  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  // Sorting Setup
  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)

  const handleLPTokenSelect = useCallback(
    (lpToken: Object) => {
      onLPTokenSelect(lpToken)
      onDismiss()
    },
    [onDismiss, onLPTokenSelect]
  )

  return (
    <div className="flex flex-col max-h-[inherit]">
      <ModalHeader className="h-full" onClose={onDismiss} title="Select a token" />
      <Search
        search={search}
        term={term}
        inputProps={{
          className:
            'relative w-full bg-transparent border border-transparent focus:border-gradient-r-blue-red-dark-900 rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5',
        }}
      />

      <div className="h-screen">
        <AutoSizer disableWidth>
          {({ height }) => (
            <LPTokenList
              height={height}
              fixedListRef={fixedList}
              showImportView={showImportView}
              setImportToken={setImportToken}
              hideBalance={hideBalance}
              lpTokenList={items}
              onLPTokenSelect={handleLPTokenSelect}
              otherListLPTokens={null}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  )
}
