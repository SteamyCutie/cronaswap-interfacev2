import { NETWORK_ICON, NETWORK_LABEL } from '../../config/networks'

import Image from 'next/image'
import React from 'react'
import { useActiveWeb3React } from 'app/services/web3'
import { useNetworkModalToggle } from 'app/state/application/hooks'
import { ChainId } from '@cronaswap/core-sdk'
import { BscNetworkModal } from 'app/modals/NetworkModal/indexBsc'

export default function Tools() {
  const { account, chainId, library } = useActiveWeb3React()
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null
  return (
    <div
      className="flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
      onClick={() => toggleNetworkModal()}
    >
      {ChainId.CRONOS === chainId ? (
        <div className="grid items-center grid-flow-col px-3 py-2 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-dark-1000 text-secondary">
          <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" />
          <div className="text-primary">{NETWORK_LABEL[chainId]}</div>
        </div>
      ) : (
        <div className="grid items-center grid-flow-col px-3 py-2 space-x-2 text-sm rounded-lg pointer-events-auto auto-cols-max bg-blue/50">
          <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" />
          <div className="text-white">{NETWORK_LABEL[chainId]}</div>
        </div>
      )}

      <BscNetworkModal />
    </div>
  )
}
