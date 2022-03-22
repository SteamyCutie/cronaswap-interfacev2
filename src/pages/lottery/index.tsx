import React, { useState } from 'react'
import Container from 'app/components/Container'
import Head from 'next/head'
import { useLingui } from '@lingui/react'
import Image from 'next/image'
import { t } from '@lingui/macro'
import MultiGlowShadow from 'app/components/MultiGlowShadow'
import { StatBox } from 'app/features/lottery/StatBox'
import { StageBox } from 'app/features/lottery/StageBox'

export default function Lottery() {
  const { i18n } = useLingui()
  const [roundTab, setRoundTab] = useState(0)

  return (
    // <Container id="lottery">
    //   <Head>
    //     <title>{i18n._(t`CronaSwap`)} | CronaSwap</title>
    //     <meta
    //       key="description"
    //       name="description"
    //       content="CronaSwap allows for swapping of ERC20 compatible tokens across multiple networks"
    //     />
    //   </Head>
    // {/* <MultiGlowShadow> */}
    <div className="w-10/12">
      <div className="justify-between md:flex">
        <div className="">
          <div className="absolute mt-[24rem] ml-[8.06rem]">
            <Image src="/coin1.png" height="59px" width="78px" />
          </div>
          <div className="absolute mt-[8.93rem] ml-[29.44rem]">
            <Image src="/coin2.png" height="60px" width="73px" />
          </div>
          <div className="absolute mt-[21.14rem] ml-[31.62rem]">
            <Image src="/coin3.png" height="67px" width="69px" />
          </div>
          <div className="w-1/2 mt-32 text-white mb-80">
            <div className="font-bold leading-[90px] text-7xl font-Kumbh">Catch the great winning spirit!</div>
            <div className="w-2/3 mt-4 text-lg text-gray-400">
              Join million others in playing in the crona lottery and winning while doing it.
            </div>
            <button className="px-10 py-4 mt-10 text-base rounded bg-blue">Buy tickets</button>
          </div>
        </div>
        <div className="w-2/5">
          <Image src="/coins.png" height="446px" width="472px" />
        </div>
      </div>

      <div className="grid items-center justify-center gap-12 justify-items-center gird-cols-1 mb-44 md:grid-cols-4">
        <StatBox content="Playing now" stat="127" />
        <StatBox content="JACKPOT" stat="$125,985" />
        <StatBox content="Playing now" stat="127" />
        <StatBox content="Playing now" stat="127" />
      </div>

      <div className="mb-48">
        <div className="flex items-center justify-between px-4 mb-6">
          <div className="flex gap-16">
            <div className="space-y-3 hover:cursor-pointer" onClick={() => setRoundTab(0)}>
              <div className="text-4xl font-bold text-center text-white font-Kumbh">Next Draw</div>
              {roundTab == 0 && (
                <svg width="196" height="6" viewBox="0 0 196 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H193" stroke="#2172E5" strokeWidth="6" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="space-y-3 hover:cursor-pointer" onClick={() => setRoundTab(1)}>
              <div className="text-4xl font-bold text-center text-white font-Kumbh">Finished Round</div>
              {roundTab == 1 && (
                <svg width="255" height="6" viewBox="0 0 255 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H252" stroke="#2172E5" strokeWidth="6" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
          {roundTab == 0 && <div className="text-lg text-gray-400">#354 | Draw: 4 Mar 2022, 20:59</div>}
        </div>
        {/* Lottery Box */}
        <div className="rounded bg-dark-900 h-80"></div>
      </div>

      {/* How to Play Lottery */}
      <div className="flex gap-16 mb-52">
        <div className="w-2/5">
          <div className="text-5xl leading-[60px] mb-4 text-white font-bold">How to Play Crona Lottery</div>
          <div className="text-lg leading-6">
            If the digits on your tickets match the winning numbers in the correct order, you win a portion of the prize
            pool. <span className="font-bold text-blue">Simple!</span>
          </div>
          <button className="px-10 py-4 mt-10 text-base text-white rounded bg-blue">Buy tickets</button>
        </div>
        <div className="w-2/5">
          <StageBox
            count="01"
            title="Buy Tickets"
            content="Prices are set when the round starts, equal to 5 USD in CRONA per ticket."
            classNames="z-10 absolute"
          />
          <StageBox
            count="03"
            title="Check for Prizes"
            content="Once the round’s over, come back to the page and check to see if you’ve won!"
            classNames="z-30 absolute ml-[369px] mt-[9px]"
          />
          <StageBox
            count="02"
            title="Wait for the draw"
            content="There is one draw every day alternating between 0 AM UTC and 12 PM UTC."
            classNames="z-20 absolute mt-[186px] ml-[133px]"
          />
        </div>
      </div>

      {/* Winning Criteriat */}
      <div className="justify-between space-y-4 md:flex md:items-center mb-28">
        <div className="md:w-2/5 text-grey">
          <div className="text-5xl leading-[60px] text-white font-Kumbh mb-4">Winning Criteriat</div>
          <div className="mb-6 text-lg leading-6">
            The digits on your ticket must match in the correct order to win.
          </div>
          <div className="mb-4 text-lg font-normal leading-6 font-Kumbh">
            Here’s an example of a lottery draw, with two tickets, A and B.
          </div>
          <ul className="pl-4 mb-6 list-disc">
            <li>
              Ticket A: The first 3 digits and the last 2 digits match, but the 4th digit is wrong, so this ticket only
              wins a “Match first 3” prize.
            </li>
            <li>
              Ticket B: Even though the last 5 digits match, the first digit is wrong, so this ticket doesn’t win a
              prize.
            </li>
          </ul>
          <div className="leading-6">
            Prize brackets don’t ‘stack’: if you match the first 3 digits in order, you’ll only win prizes from the
            ‘Match 3’ bracket, and not from ‘Match 1’ and ‘Match 2’.
          </div>
        </div>
        <div className="md:w-5/12 bg-dark-900 h-[421px]"></div>
      </div>

      {/* Prize Funds */}
      <div className="mb-32 md:gap-16 md:flex md:items-center">
        <div className="px-28 py-10 items-center justify-center w-full md:w-5/12 h-[578px] bg-dark-900 rounded"></div>
        <div className="md:w-6/12">
          <div className="text-5xl font-bold leading-[60px] text-white mb-4">Prize Funds</div>
          <div className="mb-6 text-lg font-bold leading-6 text-grey">
            The prizes for each lottery round come from two sources:
          </div>
          <div className="text-2xl font-bold leading-[30px] text-white mb-4">Ticket Purchases</div>
          <div className="mb-6 text-base font-normal leading-6 text-grey">
            80% of the CRONA paid by people buying tickets that round goes back into the prize pools.
          </div>
          <div className="text-2xl font-bold leading-[30px] text-white mb-4">Rollover Prizes</div>
          <div className="mb-10 text-base font-normal leading-6 md:mb-6 text-grey">
            After every round, if nobody wins in one of the prize brackets, the unclaimed CRONA tokens for that bracket
            will roll over into the next round and will be redistributed among the prize pools.
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="w-full py-16 pl-16 text-white rounded-[7.5px] bg-dark-900">
        <div className="font-Kumbh font-bold text-5xl leading-[60px] mb-4">Still got questions?</div>
        <div className="w-2/3 mb-6 text-base font-normal leading-8 font-Kumbh">
          Incase you got any question about the lottery or you’re finding it difficult on how best to start, we invite
          you to go over our detailed explanation in the docs section.
        </div>
        <button className="px-10 py-4 text-base font-normal rounded bg-blue">See more details</button>
      </div>
    </div>
    //   {/* </MultiGlowShadow> */}
    // </Container>
  )
}
