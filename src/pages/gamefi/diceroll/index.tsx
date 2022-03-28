import React, { useState } from 'react'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import Container from 'app/components/Container'

export default function DiceRoll() {
  const { i18n } = useLingui()
  return (
    <Container id="diceroll-page" maxWidth="full" className="py-4 md:py-8 lg:py-24">
      <Head>
        <title key="title">Landing | CronaSwap</title>
        <meta key="description" name="description" content="Welcome to CronaSwap" />
      </Head>
      <div className="relative flex flex-col items-center w-full">
        <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-10 bg-red top-4 w-3/5 rounded-full z-0  filter blur-[150px]" />
        <div className="relative filter drop-shadow">
          <div className="mt-[100px] flex flex-col items-center">
            <div className="text-[5vw] font-bold text-white font-sans leading-[89.3px]">Dice Roll Game</div>
            <div className="max-w-[469px] text-center text-white text-[18px] leading-[24px] mt-[14px]"></div>
          </div>
        </div>
      </div>
    </Container>
  )
}
