import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, MediumIcon, TwitterIcon } from '../Icon'
import Image from 'next/image'
import React from 'react'
import { useActiveWeb3React } from '../../services/web3'

import Container from '../Container'
import Typography from '../Typography'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  return (
    <div className="z-10 w-full py-20 bg-dark-900/30 px-6 mt-20">
      <Container maxWidth="7xl" className="mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:grid-cols-6 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex justify-start items-center gap-2">
              <div className="">
                <Image src="/logo.png" alt="CronaSwap logo" width="150px" height="28px" />
              </div>
              {/* <Typography variant="h2" weight={700} className="tracking-[0.02em] scale-y-90">
                CronaSwap
              </Typography> */}
            </div>
            <Typography variant="sm" className="text-low-emphesis">
              {i18n._(
                t`CronaSwap aims to become a benchmark for DEX platforms. We want to take on the mantle in becoming the leading DEX platform on the market for token swaps.`
              )}
            </Typography>
            <div className="flex gap-4 items-center">
              <a href="https://twitter.com/cronaswap" target="_blank" rel="noreferrer">
                <TwitterIcon width={16} className="text-low-emphesis" />
              </a>
              <a href="https://cronaswap.medium.com/" target="_blank" rel="noreferrer">
                <MediumIcon width={16} className="text-low-emphesis" />
              </a>
              <a href="https://discord.gg/QBEmcuamwp" target="_blank" rel="noreferrer">
                <DiscordIcon width={16} className="text-low-emphesis" />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="lg" weight={700} className="my-2.5">
              {i18n._(t`About Us`)}
            </Typography>
            <a href="https://docs.cronaswap.org/" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Contact`)}
              </Typography>
            </a>
            <a href="https://docs.cronaswap.org/hiring/careers" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Careers`)}
              </Typography>
            </a>
            <a href="https://defillama.com/protocol/cronaswap" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Defi Llama`)}
              </Typography>
            </a>
            <a href="https://www.coingecko.com/en/coins/cronaswap" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Coingecko`)}
              </Typography>
            </a>
            <a href="https://coinmarketcap.com/currencies/cronaswap/" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`CoinMarketCap`)}
              </Typography>
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <Typography variant="lg" weight={700} className="my-2.5">
              {i18n._(t`Exchanges`)}
            </Typography>
            <a href="https://www.mexc.com/exchange/CRONA_USDT" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Mexc.com`)}
              </Typography>
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="lg" weight={700} className="my-2.5">
              {i18n._(t`Developers`)}
            </Typography>
            <a href="https://docs.cronaswap.org" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Documentation`)}
              </Typography>
            </a>

            <a href="https://github.com/cronaswap" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`GitHub`)}
              </Typography>
            </a>
            <a href="https://snapshot.org/#/cronachef.eth" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Vote`)}
              </Typography>
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <Typography variant="lg" weight={700} className="my-2.5">
              {i18n._(t`Auditors`)}
            </Typography>
            <a href="https://www.certik.com/projects/cronaswap" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Cerkit`)}
              </Typography>
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <Typography variant="lg" weight={700} className="my-2.5">
              {i18n._(t`Business`)}
            </Typography>
            <a href="mailto:chef@cronaswap.org" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Contact Us`)}
              </Typography>
            </a>
            <a href="https://github.com/cronaswap/default-token-list" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Token Listing`)}
              </Typography>
            </a>

            <a href="https://forms.gle/6QpGGpFZhkFhGCqg8" target="_blank" rel="noreferrer">
              <Typography variant="sm" className="text-low-emphesis">
                {i18n._(t`Apply For Farm/IFO`)}
              </Typography>
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Footer
