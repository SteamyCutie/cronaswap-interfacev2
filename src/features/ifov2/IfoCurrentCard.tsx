import Image from 'next/image'
import { BlocksIcon, DiscordIcon, TelegramIcon, TokenomicsIcon, TwitterIcon } from 'app/components/Icon'
import { PublicIfoData, WalletIfoData } from './hooks/types'
import { Ifo, PoolIds } from 'app/constants/types'
import { useActiveWeb3React } from 'app/services/web3'
import IfoPoolCard from './IfoPoolCard'
import { getExplorerLink } from 'app/functions'
import IfoActivityTimer from './IfoActivityTimer'
import Typography from 'app/components/Typography'

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

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="bg-dark-900 rounded w-full">
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
            className="flex flex-col px-4 pt-14 space-y-8 rounded-r bg-dark-800"
            {...{
              style: {
                backgroundImage: `url("/images/ifo/${ifo.id}-bg.png")`,
              },
            }}
          >
            <div className="mx-auto">
              <Image src={`/images/ifo/${ifo.id}.png`} alt={ifo.name} width="285px" height="55px" />
            </div>

            <div className="flex mx-auto gap-1 text-high-emphesis rounded-md bg-dark-700 p-4">
              {publicIfoData.status === 'finished' && (
                <Typography variant="h2" className="opacity-80 text-yellow">
                  IFO FINISHED
                </Typography>
              )}

              {(publicIfoData.status === 'coming_soon' || publicIfoData.status === 'live') && (
                <IfoActivityTimer remainingTime={remainingTime(ifo, publicIfoData)} />
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
              <div className="text-[14px]">Start: 12th Feb, 2:00pm UTC</div>
              <div className="text-[14px]">End: 13th Feb, 2:00pm UTC</div>
              {/* <div className="text-[14px]">Duration: 24H (Claim Time: 13th Feb, 4:00pm UTC)</div> */}

              <div className="text-xl font-bold">Introduction</div>
              <div className="text-[14px] text-high-emphesis">{ifo.description}</div>
              <div className="flex gap-4 items-center pb-4">
                <a href={ifo.articleUrl} target="_blank" rel="noreferrer">
                  <TokenomicsIcon width={16} className="text-low-emphesis" />
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
