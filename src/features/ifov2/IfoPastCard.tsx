import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import NumericalInput from 'app/components/NumericalInput'
import QuestionHelper from 'app/components/QuestionHelper'
import { useState } from 'react'
import Image from 'next/image'
import { DiscordIcon, MediumIcon, TwitterIcon } from 'app/components/Icon'
import { PublicIfoData, WalletIfoData } from './hooks/types'
import { Ifo } from 'app/constants/types'
import { useGetPublicIfoData, useGetWalletIfoData } from 'app/features/ifov2/hooks'
import IfoCardData from './IfoCardData'

export const IfoPastCard = ({ inactiveIfo }: { inactiveIfo: Ifo[] }) => {
  const { i18n } = useLingui()
  const [depositValue, setDepositValue] = useState('')

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="w-full rounded">
        <div className="max-w-[800px] m-auto w-full">
          {inactiveIfo.map((ifo) => (
            <IfoCardData key={ifo.id} ifo={ifo} />
          ))}
        </div>
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-6 rounded-lg md:mt-4 md:mb-4 md:ml-4 bg-dark-800">
            <div className="flex flex-row justify-between p-6 rounded-t item-center bg-dark-600">
              <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
                Base Sale
                <QuestionHelper text="Every person can only commit a limited amount, but may expect a higher return per token committed." />
              </div>
              <div className="bg-gray-700 text-pink h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
                Finished
              </div>
            </div>
            <div className="flex gap-3 px-4">
              <div className="relative min-w-[48px] h-[48px] shadow-md rounded-full bg-pink"></div>
              <div className="flex flex-col overflow-hidden">
                <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
                  750000 CROSS
                </div>
                <div className="text-sm font-bold leading-5 text-secondary">30% of total sale</div>
              </div>
            </div>

            <div className="col-span-2 px-4 text-center md:col-span-1">
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
            </div>

            <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Your committed:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">$91.09</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Total committed:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">~$261,951 (173.32%)</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Funds to raise:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">$150,000</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Price per CROSS:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">$0.2</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-lg md:mt-4 md:mb-4 bg-dark-800">
            <div className="flex flex-row justify-between p-6 rounded-t item-center bg-dark-600">
              <div className="flex flex-row items-center text-2xl font-bold text-high-emphesis">
                Unlimited Sale
                <QuestionHelper text="Every person can only commit a limited amount, but may expect a higher return per token committed." />
              </div>
              <div className="bg-gray-700 text-pink h-[24px] pr-3 whitespace-nowrap inline-flex rounded-[12px] pl-3 font-bold text-xs items-center justify-center">
                Finished
              </div>
            </div>
            <div className="flex gap-3 px-4">
              <div className="relative min-w-[48px] h-[48px] shadow-md rounded-full bg-pink"></div>
              <div className="flex flex-col overflow-hidden">
                <div className="text-2xl leading-7 tracking-[-0.01em] font-bold truncate text-high-emphesis">
                  750000 CROSS
                </div>
                <div className="text-sm font-bold leading-5 text-secondary">30% of total sale</div>
              </div>
            </div>

            <div className="col-span-2 px-4 text-center md:col-span-1">
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
            </div>

            <div className="flex flex-col flex-grow px-4 pb-4 space-y-2">
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Your committed:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">$91.09</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Additional fee:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">1%</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Total committed:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">~$261,951 (173.32%)</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Funds to raise:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">$150,000</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Price per CROSS:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">$0.2</div>
              </div>
              <div className="flex justify-between gap-0.5">
                <div className="text-xs font-medium leading-4 currentColor">Price per CROSS with fee:</div>
                <div className="text-xs font-medium leading-4 text-high-emphesis">~$0.21</div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col px-4 pt-8 space-y-8 rounded-r bg-dark-800">
            <div className="absolute inset-0 opacity-50 filter saturate-0 ">
              <Image src="/images/ifo/mifo-bg.png" className="object-cover w-full" layout="fill" alt="IFO Background image" />
            </div>
            <div className="mx-auto">
              <Image src="/images/ifo/crona.png" alt="CronaSwap" width="285px" height="55px" />
            </div>
            <div className="flex gap-1 mx-auto mt-10 text-high-emphesis">
              <div className="flex items-baseline gap-1">
                <div className="text-[32px] leading-4 font-medium">00D</div>
                <div className="text-[32px] leading-[1.2] font-medium text-mono text-secondary">:</div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-[32px] leading-4 font-medium text-mono">00H</div>
                <div className="text-[32px] leading-[1.2] font-medium text-mono text-secondary">:</div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-[32px] leading-4 font-medium text-mono">00M</div>
                <div className="text-[32px] leading-[1.2] font-medium text-mono text-secondary">:</div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-[32px] leading-[1.2] font-medium text-mono">00S</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xl font-bold">Introduction</div>
              <div className="text-[14px] text-high-emphesis">
                CronaSwap is the first decentralized exchange platform on the Cronos Chain to offer the lowest
                transaction fees (0.25%). You can swap CRC-20 tokens easily on the Cronos Chain network that guarantees
                superior speed and much lower network transaction costs.
              </div>
              <div className="flex items-center gap-4 pb-4">
                <a href="https://twitter.com/cronaswap" target="_blank" rel="noreferrer">
                  <TwitterIcon width={16} className="text-low-emphesis" />
                </a>
                <a href="https://twitter.com/cronaswap" target="_blank" rel="noreferrer">
                  <TwitterIcon width={16} className="text-low-emphesis" />
                </a>
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
          </div>
        </div> */}
      </div>
    </div>
  )
}
