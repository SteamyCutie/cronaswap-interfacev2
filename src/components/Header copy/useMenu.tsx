import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CRONA_ADDRESS } from '@cronaswap/core-sdk'
import { PoolIcon, RocketIcon, WalletIcon } from 'app/components/Icon'
// import { Feature } from 'app/enums'
import { Feature, featureEnabled } from 'app/functions/feature'
import { useActiveWeb3React } from 'app/services/web3'
import { ReactNode, useMemo } from 'react'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let mainMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Swap`),
      link: '/swap',
      // icon: <SwitchVerticalIcon width={20} />,
    }

    const mainItems: Menu = [mainMenu]

    mainItems.push({
      key: 'pool',
      title: i18n._(t`Pool`),
      link: '/pool',
      // icon: <WalletIcon width={20} />,
    })

    if (featureEnabled(Feature.FARMV1, chainId)) {
      mainItems.push({
        key: 'farmv1',
        title: i18n._(t`Farm V1`),
        link: '/farmv1',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.FARMV2, chainId)) {
      mainItems.push({
        key: 'farmv2',
        title: i18n._(t`Farm V2`),
        link: '/farmv2',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.LENDING, chainId)) {
      mainItems.push({
        key: 'lending',
        title: i18n._(t`Lending`),
        link: '/lending',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.IFO, chainId)) {
      mainItems.push({
        key: 'ifo',
        title: i18n._(t`IFO`),
        link: '/ifo',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.LAUNCH, chainId)) {
      mainItems.push({
        key: 'launchpad',
        title: i18n._(t`LaunchPad`),
        link: '/launchPad',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.STAKING, chainId)) {
      mainItems.push({
        key: 'stake',
        title: i18n._(t`Stake`),
        link: '/stake',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.BOOST, chainId)) {
      mainItems.push({
        key: 'boost',
        title: i18n._(t`Boost`),
        link: '/boost',
        // icon: <WalletIcon width={20} />,
      })
    }

    if (featureEnabled(Feature.GAMEFI, chainId)) {
      const gamefiItems = {
        key: 'gameFi',
        title: i18n._(t`GameFi`),
        // icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'agame',
            title: i18n._(t`aGame`),
            link: '/agame',
          },
          {
            key: 'bgame',
            title: i18n._(t`bGame`),
            link: '/bgame',
          },
          {
            key: 'cgame',
            title: i18n._(t`cGame`),
            link: '/cgame',
          },
        ],
      }
      mainItems.push(gamefiItems)
    }

    if (featureEnabled(Feature.AMMV1, chainId)) {
      mainItems.push({
        key: 'ammv1',
        title: i18n._(t`V1 (old)`),
        link: 'http://appv1.cronaswap.org',
        // icon: <WalletIcon width={20} />,
      })
    }
    // if (featureEnabled(Feature.GAMEFI, chainId)) {
    //   const gamefiMenu: MenuItem = {

    //   }
    // }

    // let analyticsMenu: MenuItem = {
    //   key: 'analytics',
    //   title: i18n._(t`Analytics`),
    //   icon: <TrendingUpIcon width={20} />,
    //   items: [
    //     {
    //       key: 'dashboard',
    //       title: 'Dashboard',
    //       link: '/analytics/dashboard',
    //     },
    //     {
    //       key: 'xsushi',
    //       title: 'xSUSHI',
    //       link: '/analytics/xsushi',
    //     },
    //     {
    //       key: 'tokens',
    //       title: 'Tokens',
    //       link: '/analytics/tokens',
    //     },
    //     {
    //       key: 'pairs',
    //       title: 'Pairs',
    //       link: '/analytics/pairs',
    //     },
    //   ],
    // }

    // if (featureEnabled(Feature.BENTOBOX, chainId)) {
    //   analyticsMenu.items.push({
    //     key: 'bentobox',
    //     title: 'Bentobox',
    //     link: '/analytics/bentobox',
    //   })
    // }

    // if (featureEnabled(Feature.ANALYTICS, chainId)) {
    //   mainItems.push(analyticsMenu)
    // }

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu
