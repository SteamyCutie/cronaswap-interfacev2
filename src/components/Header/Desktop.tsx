import { NATIVE } from '@cronaswap/core-sdk'
import Container from 'app/components/Container'
import { NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import LanguageSwitch from 'app/components/LanguageSwitch'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Image from 'next/image'
import React, { FC } from 'react'
import More from './More'
import TokenStats from '../TokenStats'
import { NavigationItem } from './NavigationItem'

const HEADER_HEIGHT = 80

const Desktop: FC = () => {
  const menu = useMenu()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  return (
    <>
      <header className="fixed z-20 hidden w-full lg:block" style={{ height: HEADER_HEIGHT }}>
        <nav className={NAV_CLASS}>
          <Container maxWidth="full" className="mx-auto">
            <div className="flex items-center justify-between gap-4 px-6">
              <div className="flex gap-4">
                <div className="flex items-center mr-4">
                  <Image src="/logo.png" alt="CronaSwap" width="171px" height="32px" />
                </div>
                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center w-auto mr-1 text-xs font-bold rounded shadow-sm cursor-pointer pointer-events-auto select-none bg-dark-800 text-primary hover:bg-dark-700 whitespace-nowrap sm:block">
                    <TokenStats token="CRONA" />
                  </div>

                  {library && library.provider.isMetaMask && (
                    <div className="hidden sm:inline-block">
                      <Web3Network />
                    </div>
                  )}

                  <div className="flex items-center w-auto text-sm font-bold border-2 rounded shadow cursor-pointer pointer-events-auto select-none border-dark-800 hover:border-dark-700 bg-dark-900 whitespace-nowrap">
                    {account && chainId && userEthBalance && (
                      <>
                        <div className="px-3 py-2 text-primary text-bold">
                          {userEthBalance?.toSignificant(4)} {NATIVE[chainId].symbol}
                        </div>
                      </>
                    )}
                    <Web3Status />
                  </div>
                  {/* <div className="hidden lg:flex">
                  <LanguageSwitch />
                </div> */}
                </div>
                <More />
              </div>
            </div>
          </Container>
        </nav>
      </header>
      <div style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }} />
    </>
  )
}

export default Desktop
