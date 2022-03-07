import { ChainId, Currency, NATIVE, Pair, Token } from '@cronaswap/core-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { filterTokens, useSortedTokensByQuery } from '../../functions/filtering'
import { useAllTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from '../../hooks/Tokens'

import AutoSizer from 'react-virtualized-auto-sizer'
import Button from '../../components/Button'
import CHAINLINK_TOKENS from '@sushiswap/chainlink-whitelist'
import Column from '../../components/Column'
import CurrencyList from './CurrencyList'
import { FixedSizeList } from 'react-window'
import ImportRow from './ImportRow'
import ModalHeader from '../../components/ModalHeader'
import ReactGA from 'react-ga'
import { isAddress } from '../../functions/validate'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../services/web3'
import useDebounce from '../../hooks/useDebounce'
import { useLingui } from '@lingui/react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useRouter } from 'next/router'
import useToggle from '../../hooks/useToggle'
import { useTokenComparator } from './sorting'
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
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
  currencyList?: string[]
  includeNativeCurrency?: boolean
  allowManageTokenList?: boolean
  hideBalance: boolean
  showSearch: boolean
  onLPTokenSelect: (lpToken: Object) => void
}

export function LPTokenSearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
  currencyList,
  includeNativeCurrency = true,
  allowManageTokenList = true,
  hideBalance = false,
  showSearch = true,
  onLPTokenSelect,
}: LPTokenSearchProps) {
  const { i18n } = useLingui()

  const { chainId, account } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  let allTokens = useAllTokens()

  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

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
  //user liquidity
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const userV2Pairs = allV2PairsWithLiquidity.map((v2Pair) => {
    return {
      lpToken: v2Pair.liquidityToken.address,
      name: v2Pair.liquidityToken.name,
      symbol: v2Pair.liquidityToken.symbol,
      token0: {
        id: v2Pair.token0.address,
        name: v2Pair.token0.name,
        symbol: v2Pair.token0.symbol,
      },
      token1: {
        id: v2Pair.token1.address,
        name: v2Pair.token1.name,
        symbol: v2Pair.token1.symbol,
      },
    }
  })

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
              otherListLPTokens={userV2Pairs}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  )
}
