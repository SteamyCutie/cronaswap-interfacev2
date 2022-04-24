import { NewspaperIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { TwitterIcon, MediumIcon, DiscordIcon, TelegramIcon } from 'app/components/Icon'
import NumericalInput from 'app/components/NumericalInput'
import QuestionHelper from 'app/components/QuestionHelper'
import { Ifo } from 'app/constants/types'
import { useState } from 'react'
import { useGetPublicIfoData, useGetWalletIfoData } from './hooks'
import { getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'app/functions/formatBalance'
import { formatBalance, formatCurrencyAmount, formatNumber, formatNumberScale, tryParseAmount } from 'app/functions'

interface Props {
  ifo: Ifo
}

const IfoCardData: React.FC<Props> = ({ ifo }) => {
  const publicIfoData = useGetPublicIfoData(ifo)
  const walletIfoData = useGetWalletIfoData(ifo)

  const { status, offerToken } = publicIfoData
  const basicRaiseToken = publicIfoData['poolBasic'].raiseToken
  const unLimitedRaiseToken = publicIfoData['poolUnlimited'].raiseToken
  const basicRaiseTokenPriceInUSD = publicIfoData['poolBasic'].raiseTokenPriceInUSD
  const unLimitedRaiseTokenPriceInUSD = publicIfoData['poolUnlimited'].raiseTokenPriceInUSD

  const basicPoolCharacteristic = publicIfoData['poolBasic']
  const unLimitedPoolCharacteristic = publicIfoData['poolUnlimited']
  const basicWalletCharacteristic = walletIfoData['poolBasic']
  const unLimitedWalletCharacteristic = walletIfoData['poolUnlimited']
  const basicTaxRate = `${basicPoolCharacteristic.taxRate}%`
  const unLimitedTaxRate = `${unLimitedPoolCharacteristic.taxRate}%`

  const basicTotalCommittedPercent = basicPoolCharacteristic.totalAmountPool
    .div(basicPoolCharacteristic.raisingAmountPool)
    .times(100)
    .toFixed(2)
  const unLimitedTotalCommittedPercent = unLimitedPoolCharacteristic.totalAmountPool
    .div(unLimitedPoolCharacteristic.raisingAmountPool)
    .times(100)
    .toFixed(2)

  // totalCommited
  const basicTotalLPCommitted = getBalanceNumber(basicPoolCharacteristic.totalAmountPool, basicRaiseToken.decimals)
  const unLimitedTotalLPCommitted = getBalanceNumber(
    unLimitedPoolCharacteristic.totalAmountPool,
    unLimitedRaiseToken.decimals
  )
  const basicTotalLPCommittedInUSD = basicRaiseTokenPriceInUSD.times(basicTotalLPCommitted)
  const unLimitedTotalLPCommittedInUSD = unLimitedRaiseTokenPriceInUSD.times(unLimitedTotalLPCommitted)
  const basicTotalCommitted = `~$${formatNumber(
    basicTotalLPCommittedInUSD.toNumber()
  )} (${basicTotalLPCommitted} CRONA) (${basicTotalCommittedPercent === 'NaN' ? 0 : basicTotalCommittedPercent}%)`
  const unLimitedTotalCommitted = `~$${formatNumber(unLimitedTotalLPCommittedInUSD.toNumber())} (${
    unLimitedTotalCommittedPercent === 'NaN' ? 0 : unLimitedTotalCommittedPercent
  }%)`

  // yourCommited
  const basicYourLPCommitted = getBalanceNumber(
    basicWalletCharacteristic.amountTokenCommittedInLP,
    basicRaiseToken.decimals
  )
  const unLimitedYourLPCommitted = getBalanceNumber(
    unLimitedWalletCharacteristic.amountTokenCommittedInLP,
    unLimitedRaiseToken.decimals
  )
  const basicYourLPCommittedInUSD = basicRaiseTokenPriceInUSD.times(basicYourLPCommitted)
  const unLimitedYourLPCommittedInUSD = unLimitedRaiseTokenPriceInUSD.times(unLimitedYourLPCommitted)
  const basicYourCommitted = `~$${formatNumber(basicYourLPCommittedInUSD.toNumber())} (${basicYourLPCommitted} CRONA)`
  const unLimitedYourCommitted = `~$${formatNumber(unLimitedYourLPCommittedInUSD.toNumber())}`

  // pricePerTokenWithFee
  const basicSumTaxesOverflow = basicPoolCharacteristic.totalAmountPool
    .times(basicPoolCharacteristic.taxRate)
    .times(0.01)
  const unLimitedSumTaxesOverflow = unLimitedPoolCharacteristic.totalAmountPool
    .times(unLimitedPoolCharacteristic.taxRate)
    .times(0.01)
  const basicPricePerTokenWithFeeToOriginalRatio = basicSumTaxesOverflow
    .plus(basicPoolCharacteristic.raisingAmountPool)
    .div(basicPoolCharacteristic.offeringAmountPool)
    .div(basicPoolCharacteristic.raisingAmountPool.div(basicPoolCharacteristic.offeringAmountPool))
  const unLimitedPricePerTokenWithFeeToOriginalRatio = unLimitedSumTaxesOverflow
    .plus(unLimitedPoolCharacteristic.raisingAmountPool)
    .div(unLimitedPoolCharacteristic.offeringAmountPool)
    .div(unLimitedPoolCharacteristic.raisingAmountPool.div(unLimitedPoolCharacteristic.offeringAmountPool))

  const basicPricePerTokenWithFee = `~$${formatNumber(
    basicPricePerTokenWithFeeToOriginalRatio.times(ifo.tokenOfferingPrice).toNumber()
  )}`
  const unLimitedPricePerTokenWithFee = `~$${formatNumber(
    unLimitedPricePerTokenWithFeeToOriginalRatio.times(ifo.tokenOfferingPrice).toNumber()
  )}`

  const [isOpen, setOpen] = useState(false)

  const { i18n } = useLingui()
  const [depositValue, setDepositValue] = useState('')

  return (
    <div className="grid my-8 border-[2px] border-b-[3px] border-[#383241] text-[#f4eeff] rounded-[32px] animate-fade">
      <div
        className={`flex items-center justify-end w-full h-[112px] bg-no-repeat bg-cover bg-center rounded-[30px] ${
          isOpen ? 'rounded-b-none' : 'rounded-b-[30px]'
        } p-6 `}
        style={{ backgroundImage: `url('/images/ifo/${ifo.id}-bg.svg'), url('/images/ifo/${ifo.id}-bg.png')` }}
      >
        <Button
          color="pink"
          variant="filled"
          size="sm"
          className="transition-all duration-150 ease-out flex items-center justify-center w-[48px] h-[48px]"
          onClick={() => setOpen(!isOpen)}
        >
          {!isOpen ? (
            <ChevronDownIcon className="scale-[1.6]" width={48} height={48} />
          ) : (
            <ChevronUpIcon className="scale-[1.6]" width={48} height={48} />
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="grid w-full bg-[#1e1d20] rounded-b-[28px] animate-fade">
          <div className="flex-row items-center w-full overflow-hidden">
            <div className="flex rounded-[50%] w-[100%] -translate-y-[50%] scale-150 bg-[#372f47] h-[100px] justify-center items-end pb-3 text-[18px] font-extrabold text-white/70">
              Sale Finished!
            </div>
          </div>
          <div className="grid items-center gap-4 mx-4 mt-0 mb-6">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-6 rounded-3xl bg-dark-800">
                <div className="flex flex-row justify-between px-6 py-4 items-center rounded-t-3xl item-center bg-gradient-to-b from-[#6c4999] to-[#6d4db2]">
                  <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
                    Base Sale
                    <div className="mt-1 ml-1">
                      <QuestionHelper text="Every person can only commit a limited amount, but may expect a higher return per token committed." />
                    </div>
                  </div>
                  <div className="bg-gray-700/80 text-yellow h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
                    Finished
                  </div>
                </div>
                <div className="flex gap-3 px-4">
                  <div
                    className="relative min-w-[48px] h-[48px] shadow-md rounded-full bg-transparent bg-contain"
                    style={{ backgroundImage: `url('/images/ifo/${ifo.id}.svg')` }}
                  ></div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
                      {ifo.poolBasic.saleAmount}
                    </div>
                    <div className="text-sm font-bold leading-5 text-secondary">
                      {ifo.poolBasic.distributionRatio * 100} % of total sale
                    </div>
                  </div>
                </div>

                {/* <div className="col-span-2 px-4 text-center md:col-span-1">
                  <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                    {i18n._(t`Wallet Balance`)}: 182.99
                  </div>

                  <div className="relative flex items-center w-full mb-4">
                    <NumericalInput
                      className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                      value={depositValue}
                      onUserInput={setDepositValue}
                    />
                    <Button
                      variant="outlined"
                      color="blue"
                      size="xs"
                      className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                    >
                      {i18n._(t`MAX`)}
                    </Button>
                  </div>
                  <Button className="w-full" color="blue">
                    {i18n._(t`Commit`)}
                  </Button>
                </div> */}

                <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Your committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">{basicYourCommitted}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Total committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">{basicTotalCommitted}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Funds to raise:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">{ifo.poolBasic.raiseAmount}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Price per {ifo.name}:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">${ifo.tokenOfferingPrice}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 rounded-3xl bg-dark-800">
                <div className="flex flex-row justify-between px-6 py-4 items-center rounded-t-3xl item-center bg-gradient-to-b from-[#00707f] to-[#19778c]">
                  <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
                    Unlimited Sale
                    <div className="mt-1 ml-1">
                      <QuestionHelper text="Every person can only commit a limited amount, but may expect a higher return per token committed." />
                    </div>
                  </div>
                  <div className="bg-gray-700/80 text-yellow h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
                    Finished
                  </div>
                </div>
                <div className="flex gap-3 px-4">
                  <div
                    className="relative min-w-[48px] h-[48px] shadow-md rounded-full bg-transparent bg-contain"
                    style={{ backgroundImage: `url('/images/ifo/${ifo.id}.svg')` }}
                  ></div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
                      {ifo.poolUnlimited.saleAmount}
                    </div>
                    <div className="text-sm font-bold leading-5 text-secondary">
                      {ifo.poolUnlimited.distributionRatio * 100} % of total sale
                    </div>
                  </div>
                </div>

                {/* <div className="col-span-2 px-4 text-center md:col-span-1">
                  <div className="pr-4 mb-2 text-left cursor-pointer text-secondary">
                    {i18n._(t`Wallet Balance`)}: 182.99
                  </div>

                  <div className="relative flex items-center w-full mb-4">
                    <NumericalInput
                      className="w-full px-4 py-4 pr-20 rounded bg-dark-700 focus:ring focus:ring-light-purple"
                      value={depositValue}
                      onUserInput={setDepositValue}
                    />
                    <Button
                      variant="outlined"
                      color="blue"
                      size="xs"
                      className="absolute border-0 right-4 focus:ring focus:ring-light-purple"
                    >
                      {i18n._(t`MAX`)}
                    </Button>
                  </div>
                  <Button className="w-full" color="blue">
                    {i18n._(t`Commit`)}
                  </Button>
                </div> */}

                <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Your committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">{unLimitedYourLPCommitted}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Additional fee:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">{unLimitedTaxRate}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Total committed:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">{unLimitedTotalCommitted}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Funds to raise:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">
                      {ifo.poolUnlimited.raiseAmount}
                    </div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Price per {ifo.name}:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">${ifo.tokenOfferingPrice}</div>
                  </div>
                  <div className="flex justify-between gap-0.5">
                    <div className="text-xs font-medium leading-4 currentColor">Price per {ifo.name} with fee:</div>
                    <div className="text-xs font-medium leading-4 text-high-emphesis">
                      {unLimitedPricePerTokenWithFee}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center px-4 space-x-4">
              <div className="flex items-center space-x-2">
                {ifo.twitterUrl && (
                  <a
                    href={ifo.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="duration-100 ease-in transform-all hover:scale-[1.05] active:scale-[0.98]"
                  >
                    <TwitterIcon width={24} className="text-low-emphesis" />
                  </a>
                )}
                {ifo.articleUrl && (
                  <a
                    href={ifo.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="duration-100 ease-in transform-all hover:scale-[1.05] active:scale-[0.98]"
                  >
                    <NewspaperIcon width={24} className="text-low-emphesis" />
                  </a>
                )}
                {ifo.telegramUrl && (
                  <a
                    href={ifo.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="duration-100 ease-in transform-all hover:scale-[1.05] active:scale-[0.98]"
                  >
                    <TelegramIcon width={24} className="text-low-emphesis" />
                  </a>
                )}
                {ifo.discordUrl && (
                  <a
                    href={ifo.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="duration-100 ease-in transform-all hover:scale-[1.05] active:scale-[0.98]"
                  >
                    <DiscordIcon width={24} className="text-low-emphesis" />
                  </a>
                )}
              </div>
              <div className="text-justify text-[12px] text-gray-400">{ifo.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default IfoCardData
