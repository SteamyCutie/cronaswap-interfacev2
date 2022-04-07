import Image from 'next/image'
import { BlocksIcon, DiscordIcon, TelegramIcon, TokenomicsIcon, TwitterIcon } from 'app/components/Icon'
import { PublicIfoData, WalletIfoData } from './hooks/types'
import { Ifo, PoolIds } from 'app/constants/types'
import { useActiveWeb3React } from 'app/services/web3'
import IfoPoolCard from './IfoPoolCard'
import { getExplorerLink } from 'app/functions'
import IfoActivityTimer from './IfoActivityTimer'
import Typography from 'app/components/Typography'
import { ClockIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { GiftIcon } from '@heroicons/react/solid'
import CloseIcon from 'app/components/CloseIcon'

// Calac remainingTimes
export function remainingTime(
  ifo: Ifo,
  publicIfoData: PublicIfoData
): { days: number; hours: number; minutes: number; seconds: number } | undefined {
  const now = Date.parse(new Date().toString()) / 1000

  if (publicIfoData.status === 'coming_soon') {
    const interval = publicIfoData.startTimeNum - now

    let days = Math.floor(interval / (60 * 60 * 24))
    let hours = Math.floor((interval % (60 * 60 * 24)) / (60 * 60))
    let minutes = Math.floor((interval % (60 * 60)) / 60)
    let seconds = Math.floor(interval % 60)

    return { days, hours, minutes, seconds }
  }

  if (publicIfoData.status === 'live') {
    // const now = Date.now()
    const interval = publicIfoData.endTimeNum - now
    let days = Math.floor(interval / (60 * 60 * 24))
    let hours = Math.floor((interval % (60 * 60 * 24)) / (60 * 60))
    let minutes = Math.floor((interval % (60 * 60)) / 60)
    let seconds = Math.floor(interval % 60)

    return { days, hours, minutes, seconds }
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

export const IfoCurrentCard = ({
  ifo,
  publicIfoData,
  walletIfoData,
}: {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}) => {
  const { chainId } = useActiveWeb3React()
  const now = Date.parse(new Date().toString()) / 1000

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="w-full rounded bg-dark-900">
        <div
          className={
            !publicIfoData.poolBasic || !walletIfoData.poolBasic
              ? `grid grid-cols-1 gap-4 md:grid-cols-2`
              : `grid grid-cols-1 gap-4 md:grid-cols-3`
          }
        >
          {/* Base sale */}
          {publicIfoData.poolBasic && walletIfoData.poolBasic && (
            <IfoPoolCard
              poolId={PoolIds.poolBasic}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
            />
          )}

          {/* Unlimited Sale */}
          <IfoPoolCard
            poolId={PoolIds.poolUnlimited}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
          />

          {/* ifo info */}

          <div
            className="flex flex-col px-4 space-y-8 rounded-r pt-14 bg-dark-800"
            {...{
              style: {
                backgroundImage: `url("/images/ifo/${ifo.id}-bg.png")`,
              },
            }}
          >
            <div className="mx-auto">
              <Image src={`/images/ifo/${ifo.id}.png`} alt={ifo.name} width="285px" height="55px" />
            </div>

            <div className="flex items-center gap-1 p-4 mx-auto rounded-md text-high-emphesis bg-dark-700">
              {publicIfoData.status === 'coming_soon' && (
                <>
                  {/* <CloseIcon className="h-8 text-red " /> */}
                  <ClockIcon className="h-8 text-yellow " />
                  <Typography variant="h2" className="opacity-80 text-yellow">
                    IFO UPCOMING
                  </Typography>
                </>
              )}

              {publicIfoData.status === 'live' && (
                <>
                  <ClockIcon className="h-8 text-yellow " />
                  <IfoActivityTimer remainingTime={remainingTime(ifo, publicIfoData)} />
                </>
              )}

              {publicIfoData.status === 'finished' && (
                <>
                  {/* <CloseIcon className="h-8 text-red " /> */}
                  <GiftIcon className="h-8 text-green " />
                  <Typography variant="h2" className="opacity-80 text-green">
                    IFO FINISHED
                  </Typography>
                </>
              )}
            </div>

            {publicIfoData.status === 'live' && (
              <div className="w-full bg-gray-600 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-cyan-blue h-2.5 rounded-full"
                  {...{
                    style: {
                      width: `${publicIfoData.progress}%`,
                    },
                  }}
                />
              </div>
            )}

            <div className="space-y-2">
              {/* <div className="text-[14px]">Start: TBH</div>
              <div className="text-[14px]">End: TBH</div> */}

              <div className="text-[14px]">Start: 06th Apr, 12:00pm UTC</div>
              <div className="text-[14px]">End: 07th Apr, 12:00pm UTC</div>
              <div className="text-[14px] text-pink-red">Duration: 25% unlock immediately. 75% vesting in 90 days.</div>

              {/* <div className="text-[14px] text-pink-red">
                IFO has been cancelled. We will arrange for refunds in the next 48 hours.
              </div> */}

              <div className="text-xl font-bold">Introduction</div>
              <div className="text-[14px] text-high-emphesis">{ifo.description}</div>
              <div className="flex items-center gap-4 pb-4">
                <a href={ifo.articleUrl} target="_blank" rel="noreferrer">
                  <GlobeAltIcon width={16} className="text-low-emphesis" />
                </a>
                <a href={getExplorerLink(chainId, ifo.address[chainId], 'address')} target="_blank" rel="noreferrer">
                  <BlocksIcon width={16} className="text-low-emphesis" />
                </a>
                <a href={ifo.telegramUrl} target="_blank" rel="noreferrer">
                  <TelegramIcon width={16} className="text-low-emphesis" />
                </a>
                <a href={ifo.twitterUrl} target="_blank" rel="noreferrer">
                  <TwitterIcon width={16} className="text-low-emphesis" />
                </a>
                <a href={ifo.discordUrl} target="_blank" rel="noreferrer">
                  <DiscordIcon width={16} className="text-low-emphesis" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
