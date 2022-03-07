import { Currency, CurrencyAmount, Token } from '@cronaswap/core-sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo, useState } from 'react'
import { RowBetween, RowFixed } from '../../components/Row'

import Card from '../../components/Card'
import Column from '../../components/Column'
import { CurrencyLogo, CurrencyLogoArray } from '../../components/CurrencyLogo'
import { FixedSizeList } from 'react-window'
import ImportRow from './ImportRow'
import Loader from '../../components/Loader'
import { MouseoverTooltip } from '../../components/Tooltip'
import QuestionHelper from '../../components/QuestionHelper'
import Typography from '../../components/Typography'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import { i18n } from '@lingui/core'
import { isTokenOnList } from '../../functions/validate'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../services/web3'
import { useCombinedActiveList } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useCurrency, useIsUserAddedToken } from '../../hooks/Tokens'
import { useLingui } from '@lingui/react'
import { classNames, formatNumber } from '../../functions'
import { usePendingCrona } from 'app/features/farms/hooks'
import { getAddress } from '@ethersproject/address'
import { useUserInfo } from 'app/features/staking/IncentivePool/hooks'

function lpTokenKey(currency: Object): string {
  return currency.lpToken ? currency.lpToken : 'ETHER'
}

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  // color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <div className="whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis" title={balance.toExact()}>
      {balance.toSignificant(4)}
    </div>
  )
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const TokenListLogoWrapper = styled.img`
  height: 20px;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function LPTokenRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  hideBalance = false,
  lpToken,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  hideBalance: boolean
  style: CSSProperties
  lpToken: Object
}) {
  const { account, chainId } = useActiveWeb3React()
  const key = lpTokenKey(lpToken)

  let token0 = useCurrency(lpToken.token0?.id)
  let token1 = useCurrency(lpToken.token1?.id)

  const pendingCrona = usePendingCrona(lpToken)

  const [showCalc, setShowCalc] = useState(false)
  const MyLpBalance = (lpToken) => {
    const liquidityToken = new Token(
      chainId,
      getAddress(lpToken.lpToken),
      lpToken.token1 ? 18 : lpToken.token0 ? lpToken.token0.decimals : 18,
      lpToken.token1 ? lpToken.symbol : lpToken.token0.symbol,
      lpToken.token1 ? lpToken.name : lpToken.token0.name
    )

    // const balance = useTokenBalance(account, liquidityToken)
    const { amount } = useUserInfo(lpToken, liquidityToken)
    return Number(amount?.toFixed(liquidityToken?.decimals))
  }

  const Lpbalance = { account } ? MyLpBalance(lpToken) : 0

  // only show add or remove buttons if not on selected list
  return (
    <RowBetween
      id={`token-item-${key}`}
      style={style}
      className="px-5 py-1 rounded cursor-pointer hover:bg-dark-800"
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <div className="flex flex-row items-center space-x-4">
        <div className="flex items-center">
          {token0 && token1 && (
            <CurrencyLogoArray currencies={[token0, token1]} dense size={window.innerWidth > 968 ? 40 : 28} />
          )}
          <div className="flex flex-col justify-center">
            <div className="pl-4 text-xs font-bold md:text-base">{lpToken?.name}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex flex-col justify-center w-2/12 space-y-1">
          <div className="text-xs font-bold md:text-base">{formatNumber(pendingCrona?.toFixed(18))}</div>
        </div>
      </div>
    </RowBetween>
  )
}

const BREAK_LINE = 'BREAK'
type BreakLine = typeof BREAK_LINE
function isBreakLine(x: unknown): x is BreakLine {
  return x === BREAK_LINE
}

function BreakLineComponent({ style }: { style: CSSProperties }) {
  const { i18n } = useLingui()
  return (
    <FixedContentRow style={style}>
      <RowBetween>
        <RowFixed>
          <TokenListLogoWrapper src="/tokenlist.svg" />
          <Typography variant="sm" className="ml-3">
            {i18n._(t`Expanded results from inactive Token Lists`)}
          </Typography>
        </RowFixed>
        <QuestionHelper
          text={i18n._(t`Tokens from inactive lists. Import specific tokens below or
            click Manage to activate more lists.`)}
        />
      </RowBetween>
    </FixedContentRow>
  )
}

export default function LPTokenList({
  height,
  fixedListRef,
  showImportView,
  setImportToken,
  hideBalance = false,
  lpTokenList,
  otherListLPTokens,
  selectedLPToken,
  onLPTokenSelect,
  otherLPToken,
}: {
  height: number
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showImportView: () => void
  setImportToken: (token: Token) => void
  hideBalance: boolean
  lpTokenList: Object[]
  otherListLPTokens?: Object[]
  selectedLPToken?: Object | null
  onLPTokenSelect: (lpToken: Object) => void
  otherLPToken?: Object | null
}) {
  const itemData: (Object | BreakLine)[] = useMemo(() => {
    if (otherListLPTokens && otherListLPTokens?.length > 0) {
      return [...lpTokenList, BREAK_LINE, ...otherListLPTokens]
    }
    return lpTokenList
  }, [lpTokenList, otherListLPTokens])

  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      const row: Object | BreakLine = data[index]

      if (isBreakLine(row)) {
        return <BreakLineComponent style={style} />
      }

      const lpToken = row

      const isSelected = Boolean(lpToken && selectedLPToken && selectedLPToken.equals(lpToken))
      const otherSelected = Boolean(lpToken && otherLPToken && otherLPToken.equals(lpToken))
      const handleSelect = () => lpToken && onLPTokenSelect(lpToken)

      const token = lpToken?.wrapped

      const showImport = index > lpTokenList.length

      if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        )
      } else if (lpToken) {
        return (
          <LPTokenRow
            style={style}
            lpToken={lpToken}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            hideBalance={hideBalance}
          />
        )
      } else {
        return null
      }
    },
    [lpTokenList.length, hideBalance, onLPTokenSelect, otherLPToken, selectedLPToken, setImportToken, showImportView]
  )

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index]
    if (isBreakLine(currency)) return BREAK_LINE
    return lpTokenKey(currency)
  }, [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
