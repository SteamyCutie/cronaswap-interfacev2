import { SUPPORTED_WALLETS, injected } from '../../config/wallets'

import { AbstractConnector } from '@web3-react/abstract-connector'
import Dots from '../../components/Dots'
import Option from './Option'
import React from 'react'

export default function PendingView({
  id,
  connector,
  error = false,
  setPendingError,
  tryActivation,
}: {
  id: string
  connector?: AbstractConnector
  error?: boolean
  setPendingError: (error: boolean) => void
  tryActivation: (connector: AbstractConnector, id: string) => void
}) {
  const isMetamask = window?.ethereum?.isMetaMask

  return (
    <div>
      <div className="p-4 mb-5">
        <div>
          {error ? (
            <div>
              <div>Error connecting.</div>
              <div
                className="p-2 ml-4 text-xs font-semibold select-none hover:cursor-pointer"
                onClick={() => {
                  setPendingError(false)
                  connector && tryActivation(connector, id)
                }}
              >
                Try Again
              </div>
            </div>
          ) : (
            <Dots>Initializing</Dots>
          )}
        </div>
      </div>
      {Object.keys(SUPPORTED_WALLETS).map((_key) => {
        const option = SUPPORTED_WALLETS[_key]
        if (id === _key) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              id={`connect-${_key}`}
              key={_key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={'/images/wallets/' + option.iconName}
            />
          )
        }
        return null
      })}
    </div>
  )
}
