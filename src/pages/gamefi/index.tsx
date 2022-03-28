import React, { useState } from 'react'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import Container from '../../components/Container'
import { t } from '@lingui/macro'
import Image from 'app/components/Image'
import NavLink from 'app/components/NavLink'

const games = [
  {
    name: 'Dice Roll',
    role: 'Guess the dice face that comes up. Payouts are up to 5.94x',
    logoImageUrl: `url('/images/pages/gamefi/landing/diceroll/logo.png')`,
    backImageUrl: `url('/images/pages/gamefi/landing/diceroll/back.png')`,
    gameFiUrl: 'https://croissant.games/dice-roll/CRONA',
    gameFiTitle: 'Dice Roll',
    description: 'Guess the dice face that comes up. Payouts are up to 5.94x',
  },
  {
    name: 'Coin Toss',
    role: 'Choose numbers from from 0 to 36. Payouts are up to 34.65X',
    logoImageUrl: `url('/images/pages/gamefi/landing/cointoss/logo.png')`,
    backImageUrl: `url('/images/pages/gamefi/landing/cointoss/back.png')`,
    gameFiUrl: 'https://croissant.games/coin-toss/CRONA',
    gameFiTitle: 'Coin Toss',
    description: 'Choose numbers from from 0 to 36. Payouts are up to 34.65X',
  },
  {
    name: 'Lottery(Comming Soon)',
    role: 'CRONA lottery is coming soon. We will let you know immediately it’s out.',
    logoImageUrl: `url('/images/pages/gamefi/landing/lottery/logo.png')`,
    backImageUrl: `url('/images/pages/gamefi/landing/lottery/back.png')`,
    gameFiUrl: '/gamefi',
    gameFiTitle: 'Lottery',
    description: 'CRONA lottery is coming soon. We will let you know immediately it’s out.',
  },
]

export default function GameFi() {
  const { i18n } = useLingui()
  return (
    <Container id="gamefi-page" maxWidth="full" className="">
      <Head>
        <title key="title">GameFi | CronaSwap</title>
        <meta key="description" name="description" content="Welcome to CronaSwap" />
      </Head>
      <div className="relative flex flex-col items-center w-full">
        <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-10 bg-red top-4 w-3/5 rounded-full z-0  filter blur-[150px]" />
        {/* <img src="images/pages/gamefi/landing/center-ellipse.png" className="" /> */}
        <div className="relative filter drop-shadow">
          <div className="mt-[100px] flex flex-col items-center">
            <div className="text-[5vw] font-bold text-white font-sans leading-[89.3px]">Welcome to Crona Game</div>
            <div className="max-w-[469px] text-center text-white text-[18px] leading-[24px] mt-[14px]">
              GameFi partner - user playing any of the games will not require any gas fees from the player end
            </div>
            <NavLink
              href={{
                pathname: 'diceroll',
              }}
            >
              <button className="mt-[40px] text-white bg-blue rounded px-[48px] py-[18px] hover:bg-light-blue">
                Play Now
              </button>
            </NavLink>
          </div>
          <div className="px-32 pt-[100px]">
            <ul role="list" className="grid sm:grid-cols-1 sm:gap-6 lg:grid-cols-3 lg:gap-10">
              {games.map((game) => (
                <li key={game.name}>
                  <NavLink
                    href={{
                      pathname: game.gameFiUrl,
                    }}
                  >
                    <button
                      className="w-[368px] h-[373px] hover:border rounded-2xl"
                      style={{
                        backgroundImage: game.backImageUrl,
                      }}
                    >
                      <div className="px-[37px] pt-[54px] text-white text-center h-full bg-[#0D0C2B80] rounded-2xl">
                        <div
                          className="w-[184px] h-[187px] mx-[54px]"
                          style={{
                            backgroundImage: game.logoImageUrl,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                          }}
                        ></div>
                        <p className="font-bold text-[24px] leading-[29.77px]">{game.gameFiTitle}</p>
                        <p className="font-[500]">{game.description}</p>
                      </div>
                    </button>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  )
}
