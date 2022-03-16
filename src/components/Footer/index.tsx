import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DiscordIcon, MediumIcon, TwitterIcon } from '../Icon'
import Image from 'next/image'
import React from 'react'
import { useActiveWeb3React } from '../../services/web3'
import Polling from '../Polling'

const Footer = () => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()

  const navigation = {
    aboutus: [
      { name: `${i18n._(t`Contact`)}`, href: 'https://docs.cronaswap.org/' },
      { name: `${i18n._(t`Careers`)}`, href: 'https://docs.cronaswap.org/hiring/careers' },
      { name: `${i18n._(t`Nomics`)}`, href: 'https://nomics.com/assets/crona-cronaswap' },
      { name: `${i18n._(t`Defi Llama`)}`, href: 'https://defillama.com/protocol/cronaswap' },
      { name: `${i18n._(t`Coingecko`)}`, href: 'https://www.coingecko.com/en/coins/cronaswap' },
      { name: `${i18n._(t`CoinMarketCap`)}`, href: 'https://coinmarketcap.com/currencies/cronaswap/' },
    ],
    exchanges: [
      { name: `${i18n._(t`Mexc.com`)}`, href: 'https://www.mexc.com/exchange/CRONA_USDT' },
      { name: `${i18n._(t`MultiChain`)}`, href: 'https://app.multichain.org/#/router' },
      { name: `${i18n._(t`Cronos Bridge`)}`, href: 'https://cronos.crypto.org/docs/bridge/cdcex.html' },
      {
        name: `${i18n._(t`EVOdefi Bridge`)}`,
        href: 'https://bridge.evodefi.com?utm_source=cronaswap&utm_medium=link&utm_campaign=1',
      },
    ],

    developers: [
      { name: `${i18n._(t`Vote`)}`, href: 'https://snapshot.org/#/cronachef.eth' },
      { name: `${i18n._(t`Chart`)}`, href: 'https://appv1.cronaswap.org/info' },
      { name: `${i18n._(t`Audit`)}`, href: 'https://docs.cronaswap.org/security-audits' },
      { name: `${i18n._(t`DexScreener`)}`, href: 'https://dexscreener.com/cronos/cronaswap' },
      { name: `${i18n._(t`Documentation`)}`, href: 'https://docs.cronaswap.org' },
    ],
    business: [
      { name: `${i18n._(t`Token Listing`)}`, href: 'https://github.com/cronaswap/default-token-list' },
      { name: `${i18n._(t`Support#Discord`)}`, href: 'https://discord.gg/Ue9yWgC5dE' },
      { name: `${i18n._(t`Apply For Farm/IFO`)}`, href: 'https://forms.gle/6QpGGpFZhkFhGCqg8' },
    ],
    social: [
      {
        name: 'Twitter',
        href: 'https://twitter.com/cronaswap',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        ),
      },
      {
        name: 'Medium',
        href: 'https://cronaswap.medium.com/',
        icon: (props) => (
          <svg {...props} viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.6725 1.91836L13.75 0.883008V0.65625H10.0182L7.35859 7.30781L4.3334 0.65625H0.420508V0.883008L1.6791 2.40527C1.80215 2.51777 1.86543 2.68301 1.84961 2.84824V8.83008C1.88828 9.04629 1.81973 9.26602 1.66855 9.42246L0.25 11.1504V11.3736H4.26836V11.1469L2.85156 9.42422C2.77565 9.34715 2.71855 9.2536 2.68471 9.15085C2.65087 9.0481 2.64119 8.93893 2.65645 8.83184V3.65684L6.18438 11.3771H6.59395L9.62793 3.65684V9.80742C9.62793 9.96914 9.62793 10.0025 9.52246 10.1098L8.43086 11.1697V11.3965H13.7254V11.1697L12.6725 10.1344C12.5811 10.0641 12.5336 9.94629 12.5529 9.83203V2.2207C12.5438 2.16422 12.5501 2.10632 12.5712 2.05311C12.5922 1.9999 12.6272 1.95335 12.6725 1.91836Z"
              fill="currentColor"
            />
          </svg>
        ),
      },
      {
        name: 'Discord',
        href: 'https://discord.gg/QBEmcuamwp',
        icon: (props) => (
          <svg
            viewBox="0 0 256 199"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            {...props}
          >
            <g>
              <path
                d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                fill="currentColor"
                fillRule="nonzero"
              ></path>
            </g>
          </svg>
        ),
      },
      {
        name: 'GitHub',
        href: 'https://github.com/cronaswap',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
  }

  return (
    <footer className="z-10 w-full bg-dark-900/30 px-6 mt-20" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
            <Image src="/logo.png" alt="CronaSwap logo" width="150px" height="28px" />
            <p className="text-gray-500 text-base">
              {i18n._(
                t`CronaSwap aims to become a benchmark for DEX platforms. We want to take on the mantle in becoming the leading DEX platform on the market for token swaps.`
              )}
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
              <Polling />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{i18n._(t`About Us`)}</h3>
                <ul role="list" className="mt-4 space-y-1">
                  {navigation.aboutus.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  {i18n._(t`Developers`)}
                </h3>
                <ul role="list" className="mt-4 space-y-1">
                  {navigation.developers.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{i18n._(t`Business`)}</h3>
                <ul role="list" className="mt-4 space-y-1">
                  {navigation.business.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{i18n._(t`Bridge`)}</h3>
                <ul role="list" className="mt-4 space-y-1">
                  {navigation.exchanges.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-gray-500 hover:text-gray-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
