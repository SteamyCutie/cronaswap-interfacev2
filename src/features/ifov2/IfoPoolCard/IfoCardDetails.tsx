import { Ifo, PoolIds } from 'app/constants/types'
import { formatNumber } from 'app/functions'
import { getBalanceNumber } from 'app/functions/formatBalance'
import { PublicIfoData, WalletIfoData } from '../hooks/types'

export interface IfoCardDetailsProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const { status, offerToken } = publicIfoData
  const raiseToken = publicIfoData[poolId].raiseToken
  const raiseTokenPriceInUSD = publicIfoData[poolId].raiseTokenPriceInUSD

  const poolCharacteristic = publicIfoData[poolId]
  const walletCharacteristic = walletIfoData[poolId]
  const taxRate = `${poolCharacteristic.taxRate}%`

  const totalCommittedPercent = poolCharacteristic.totalAmountPool
    .div(poolCharacteristic.raisingAmountPool)
    .times(100)
    .toFixed(2)

  // totalCommited
  const totalLPCommitted = getBalanceNumber(poolCharacteristic.totalAmountPool, raiseToken.decimals)
  const totalLPCommittedInUSD = raiseTokenPriceInUSD.times(totalLPCommitted)
  const totalCommitted = `~$${formatNumber(totalLPCommittedInUSD.toNumber())} ${
    poolId == 'poolBasic' ? `(${totalLPCommitted} CRONA)` : ''
  } (${totalCommittedPercent}%)`

  // yourCommited
  const yourLPCommitted = getBalanceNumber(walletCharacteristic.amountTokenCommittedInLP, raiseToken.decimals)
  const yourLPCommittedInUSD = raiseTokenPriceInUSD.times(yourLPCommitted)
  const yourCommitted = `~$${formatNumber(yourLPCommittedInUSD.toNumber())} ${
    poolId == 'poolBasic' ? `(${yourLPCommitted} CRONA)` : ''
  }`

  // pricePerTokenWithFee
  const sumTaxesOverflow = poolCharacteristic.totalAmountPool.times(poolCharacteristic.taxRate).times(0.01)
  const pricePerTokenWithFeeToOriginalRatio = sumTaxesOverflow
    .plus(poolCharacteristic.raisingAmountPool)
    .div(poolCharacteristic.offeringAmountPool)
    .div(poolCharacteristic.raisingAmountPool.div(poolCharacteristic.offeringAmountPool))

  const pricePerTokenWithFee = `~$${formatNumber(
    pricePerTokenWithFeeToOriginalRatio.times(ifo.tokenOfferingPrice).toNumber()
  )}`

  const renderBasedOnIfoStatus = () => {
    if (status === 'idle') {
      return (
        <>
          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Funds to raise:</div>
            <div className="text-xs text-high-emphesis">{ifo[poolId].raiseAmount}</div>
          </div>
          <div className="flex justify-between gap-0.5">
            <div className="text-xs text-pink-red">CRONA to burn:</div>
            <div className="text-xs text-pink-red">{ifo[poolId].cronaToBurn}</div>
          </div>
        </>
      )
    }

    if (status === 'coming_soon') {
      return (
        <>
          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Funds to raise:</div>
            <div className="text-xs text-high-emphesis">{ifo[poolId].raiseAmount}</div>
          </div>

          {ifo[poolId].cronaToBurn !== '$0' && (
            <div className="flex justify-between gap-0.5">
              <div className="text-xs text-pink-red">CRONA to burn:</div>
              <div className="text-xs text-pink-red">{ifo[poolId].cronaToBurn}</div>
            </div>
          )}
          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Price per {offerToken.symbol}:</div>
            <div className="text-xs text-high-emphesis">${ifo.tokenOfferingPrice}</div>
          </div>
        </>
      )
    }

    if (status === 'live') {
      return (
        <>
          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Funds to raise:</div>
            <div className="text-xs text-high-emphesis">{ifo[poolId].raiseAmount}</div>
          </div>

          {ifo[poolId].cronaToBurn !== '$0' && (
            <div className="flex justify-between gap-0.5">
              <div className="text-xs text-pink-red">CRONA to burn:</div>
              <div className="text-xs text-pink-red">{ifo[poolId].cronaToBurn}</div>
            </div>
          )}

          {poolId === PoolIds.poolBasic && (
            <div className="flex justify-between gap-0.5">
              <div className="text-xs">Price per {offerToken.symbol}:</div>
              <div className="text-xs text-high-emphesis">${ifo.tokenOfferingPrice}</div>
            </div>
          )}

          {poolId === PoolIds.poolUnlimited && (
            <>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs">Additional fee:</div>
                <div className="text-xs text-high-emphesis">{taxRate}</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs">Price per {offerToken.symbol} with fee:</div>
                <div className="text-xs text-high-emphesis">{pricePerTokenWithFee}</div>
              </div>
            </>
          )}

          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Your committed:</div>
            <div className="text-xs text-high-emphesis">{raiseTokenPriceInUSD.gt(0) ? yourCommitted : null}</div>
          </div>

          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Total committed:</div>
            <div className="text-xs text-high-emphesis">{raiseTokenPriceInUSD.gt(0) ? totalCommitted : null}</div>
          </div>
        </>
      )
    }

    if (status === 'finished') {
      return (
        <>
          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Funds to raise:</div>
            <div className="text-xs text-high-emphesis">{ifo[poolId].raiseAmount}</div>
          </div>

          {ifo[poolId].cronaToBurn !== '$0' && (
            <div className="flex justify-between gap-0.5">
              <div className="text-xs text-pink-red">CRONA to burn:</div>
              <div className="text-xs text-pink-red">{ifo[poolId].cronaToBurn}</div>
            </div>
          )}

          {poolId === PoolIds.poolUnlimited && (
            <>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs">Additional fee:</div>
                <div className="text-xs text-high-emphesis">{taxRate}</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs">Price per {offerToken.symbol} with fee:</div>
                <div className="text-xs text-high-emphesis">{pricePerTokenWithFee}</div>
              </div>
            </>
          )}

          {poolId === PoolIds.poolBasic && (
            <div className="flex justify-between gap-0.5">
              <div className="text-xs">Price per {offerToken.symbol}:</div>
              <div className="text-xs text-high-emphesis">${ifo.tokenOfferingPrice}</div>
            </div>
          )}

          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Your committed:</div>
            <div className="text-xs text-high-emphesis">{raiseTokenPriceInUSD.gt(0) ? yourCommitted : null}</div>
          </div>

          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Total committed:</div>
            <div className="text-xs text-high-emphesis">{raiseTokenPriceInUSD.gt(0) ? totalCommitted : null}</div>
          </div>
          <div className="flex justify-between gap-0.5">
            <div className="text-xs">Total vesting time:</div>
            <div className="text-xs text-high-emphesis">3 Months (Remaining 75%)</div>
          </div>
        </>
      )
    }
    // return <SkeletonCardDetails />
  }

  return <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">{renderBasedOnIfoStatus()}</div>
}

export default IfoCardDetails
