import React from 'react'
import { useModalOpen, useTokenStatsModalToggle } from '../../state/application/hooks'

import { ApplicationModal } from '../../state/application/actions'
import ExternalLink from '../../components/ExternalLink'
import Image from 'next/image'
import Modal from '../../components/Modal'
import ModalHeader from '../../components/ModalHeader'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from '../../components/Typography'
import { useTokenInfo } from '../../features/farms/hooks'
import { formatNumberScale, getExplorerLink } from '../../functions'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useCronaContract } from '../../hooks/useContract'
import Button from '../../components/Button'
import { RowFixed } from '../../components/Row'
import { ChainId, CRONA_ADDRESS } from '@cronaswap/core-sdk'
import { useActiveWeb3React } from '../../services/web3'

export default function TokenStatsModal({ token, price }: { token: any; price: any }) {
  const { i18n } = useLingui()
  const { chainId, library } = useActiveWeb3React()

  let tokenInfo = useTokenInfo(useCronaContract())

  const cronaPrice = formatNumberScale(price, true)

  const modalOpen = useModalOpen(ApplicationModal.CRONA)

  const toggleWalletModal = useTokenStatsModalToggle()

  function getSummaryLine(title, value) {
    return (
      <div className="flex flex-col gap-2 bg-dark-800 rounded py-1 px-3 w-full">
        <div className="flex items-center justify-between">
          {title}
          <Typography variant="sm" className="flex items-center font-bold py-0.5">
            {value}
          </Typography>
        </div>
      </div>
    )
  }

  function getModalContent() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <ModalHeader title={i18n._(t`${token['name']}`)} onClose={toggleWalletModal} />
          <div className="flex flex-row w-full py-4">
            {token.icon && (
              <Image
                src={token['icon']}
                alt={token['name']}
                width="64px"
                height="64px"
                objectFit="contain"
                className="items-center"
              />
            )}
            <div className="flex flex-1 flex-col">
              <div className="flex flex-row">
                <div className="text-primary text-2xl">{token['symbol']}</div>
              </div>
              <div className="flex items-center justify-between space-x-3 gap-2">
                {token?.address && (
                  <ExternalLink
                    color="blue"
                    startIcon={<LinkIcon size={16} />}
                    href={getExplorerLink(chainId, token['address'][chainId], 'address')}
                  >
                    <Typography variant="sm">{i18n._(t`View Contract`)}</Typography>
                  </ExternalLink>
                )}
              </div>
            </div>
            <div className="flex items-center  text-primary text-bold">
              <div className="ml-2 text-primary text-2xl">{`${cronaPrice}`}</div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Typography weight={700}>{i18n._(t`Supply & Market Cap`)}</Typography>
          </div>
          <div className="flex flex-col flex-nowrap gap-1 -m-1">
            {getSummaryLine(
              <Typography variant="sm" className="flex items-center py-0.5">
                {i18n._(t`Total Supply`)}
              </Typography>,
              formatNumberScale(tokenInfo.totalSupply, false)
            )}
            {getSummaryLine(
              <Typography variant="sm" className="flex items-center py-0.5">
                {i18n._(t`Burnt`)}
              </Typography>,
              formatNumberScale(tokenInfo.burnt, false)
            )}
            {getSummaryLine(
              <Typography variant="sm" className="flex items-center py-0.5">
                {i18n._(t`Circulating Supply`)}
              </Typography>,
              formatNumberScale(tokenInfo.circulatingSupply, false)
            )}
            {getSummaryLine(
              <Typography variant="sm" className="flex items-center py-0.5">
                {i18n._(t`Market Cap`)}
              </Typography>,
              formatNumberScale(Number(tokenInfo.circulatingSupply) * Number(price), true)
            )}
          </div>
        </div>

        {/* Add CRONA to metamask */}
        {chainId && [ChainId.CRONOS].includes(chainId) && library && library.provider.isMetaMask && (
          <Button
            color="gradient"
            className="mt-4 item-center"
            onClick={() => {
              const params: any = {
                type: 'ERC20',
                options: {
                  address: CRONA_ADDRESS[chainId],
                  symbol: 'CRONA',
                  decimals: 18,
                  image:
                    'https://raw.githubusercontent.com/cronaswap/default-token-list/main/assets/tokens/cronos/0xadbd1231fb360047525BEdF962581F3eee7b49fe/logo.png',
                },
              }
              if (library && library.provider.isMetaMask && library.provider.request) {
                library.provider
                  .request({
                    method: 'wallet_watchAsset',
                    params,
                  })
                  .then((success) => {
                    if (success) {
                      console.log('Successfully added CRONA to MetaMask')
                    } else {
                      throw new Error('Something went wrong.')
                    }
                  })
                  .catch(console.error)
              }
            }}
          >
            <RowFixed className="mx-auto space-x-2">
              <span>{i18n._(t`Add ${token['symbol']} to MetaMask`)}</span>
              <Image
                src="/images/wallets/metamask.png"
                alt={i18n._(t`Add ${token['symbol']} to MetaMask`)}
                width={24}
                height={24}
                className="ml-1"
              />
            </RowFixed>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Modal isOpen={modalOpen} onDismiss={toggleWalletModal} minHeight={0} maxHeight={90}>
      {getModalContent()}
    </Modal>
  )
}
