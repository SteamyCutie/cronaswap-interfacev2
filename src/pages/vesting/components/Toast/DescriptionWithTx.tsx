import React from 'react'
// import { Link, Text } from '@cronaswap/uikit'
import Link from 'next/link'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
}

enum ChainId {
  MAINNET = 25,
  TESTNET = 338
}

const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://cronos.crypto.org/explorer',
  [ChainId.TESTNET]: 'https://cronos.crypto.org/explorer/testnet3',
}

function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId: ChainId = ChainId.MAINNET,
): string {
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[chainId]}/address/${data}`
    }
  }
}

const truncateHash = (address: string, startLength = 4, endLength = 4) => {
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`
}

const DescriptionWithTx: React.FC<DescriptionWithTxProps> = ({ txHash, children }) => {
  const { i18n } = useLingui()

  return (
    <>
      {/* {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getBscScanLink(txHash, 'transaction', ChainId.MAINNET)}>
          {i18n._(t`View on CronosChain`)}: {truncateHash(txHash, 8, 0)}
        </Link>
      )} */}
      {typeof children === 'string' ? <p>{children}</p> : children}
      {txHash && (
        <Link href={getBscScanLink(txHash, 'transaction', ChainId.MAINNET)}>
          {i18n._(t`View on CronosChain`)}: {truncateHash(txHash, 8, 0)}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
