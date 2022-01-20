import React from 'react'
import Image from 'next/image'
import { formatNumberScale } from '../../functions/format'
import { useTokenStatsModalToggle } from '../../state/application/hooks'
import TokenStatsModal from '../../modals/TokenStatsModal'
import { ChainId } from '@cronaswap/core-sdk'

const supportedTokens = {
  CRONA: {
    name: 'CronaSwap Token',
    symbol: 'CRONA',
    icon: '/mstile-70x70.png',
    address: {
      [ChainId.CRONOS]: '0xadbd1231fb360047525BEdF962581F3eee7b49fe',
      [ChainId.CRONOS_TESTNET]: '0x7Ac4564724c99e129F79dC000CA594B4631acA81',
    },
  },
}

interface TokenStatsProps {
  token: string
}

function TokenStatusInner({ token }) {
  const toggleModal = useTokenStatsModalToggle()
  return (
    <div
      className="flex items-center px-4 py-2 text-sm rounded-lg bg-dark-900 hover:bg-dark-800  text-secondary"
      onClick={toggleModal}
    >
      {token.icon && (
        <Image
          src={token['icon']}
          alt={token['symbol']}
          width="24px"
          height="24px"
          objectFit="contain"
          className="rounded-md"
        />
      )}
      <div className="text-primary">{formatNumberScale(Number('0.545'), true)}</div>
    </div>
  )
}

export default function TokenStats({ token, ...rest }: TokenStatsProps) {
  const selectedToken = supportedTokens[token]

  return (
    <>
      <TokenStatusInner token={selectedToken} />
      <TokenStatsModal token={selectedToken} />
    </>
  )
}
