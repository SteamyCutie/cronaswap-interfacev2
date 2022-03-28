import React, { useState } from 'react'
import { useLingui } from '@lingui/react'
import Head from 'next/head'
import Container from 'app/components/Container'
import { map } from 'lodash'
import QuestionHelper from 'app/components/QuestionHelper'
import InformationHelper from 'app/components/InformationHelper'

export default function CoinToss() {
  const { i18n } = useLingui()
  enum CoinTossStatus {
    HEAD,
    TAIL,
    NONE,
  }

  const [coinTossStatus, setCoinTossStatus] = useState<CoinTossStatus>(CoinTossStatus.NONE)
  const selectHeadOrTail = (selection: CoinTossStatus) => {
    setCoinTossStatus(selection)
  }
  return (
    <Container id="cointoss-page" maxWidth="full" className="">
      <Head>
        <title key="title">Landing | CronaSwap</title>
        <meta key="description" name="description" content="Welcome to CronaSwap" />
      </Head>
      <div className="relative flex flex-col items-center w-full">
        <div className="absolute top-1/4 -left-10 bg-blue bottom-4 w-3/5 rounded-full z-0 filter blur-[150px]" />
        <div className="absolute bottom-1/4 -right-10 bg-red top-4 w-3/5 rounded-full z-0  filter blur-[150px]" />
        <div className="relative">
          <div className="flex flex-col items-center">
            {/* <div className="text-[5vw] font-bold text-white font-sans leading-[89.3px]">Coin Toss Game</div>
            <div className="max-w-[469px] text-center text-white text-[18px] leading-[24px] mt-[14px]"></div> */}

            <div className="grid grid-flow-col-dense divide-x-2 divide-white divide-opacity-20 mx-[6.94vw] py-[45px] mt-[64px] min-w-full h-[172px] bg-[#2172E5] rounded text-white text-left">
              {[
                {
                  desc: 'Total WCRO Bets',
                  hasInfo: false,
                  unit: '',
                  value: '243149',
                },
                {
                  desc: 'All time WCRO Volume',
                  hasInfo: false,
                  unit: 'WCRO',
                  value: '17,968,155',
                },
                {
                  desc: 'Head Win Rate',
                  hasInfo: true,
                  unit: '%',
                  value: '50.08',
                  info: 'Head Win Rate',
                },
                {
                  desc: 'Tail Win Rate',
                  hasInfo: true,
                  unit: '%',
                  value: '49.92',
                  info: 'Tail Win Rate',
                },
                {
                  desc: 'House Edge',
                  hasInfo: true,
                  unit: '%',
                  value: '1',
                  info: 'House Edge',
                },
              ].map((e) => (
                <React.Fragment>
                  <div className="pl-[3.33vw]">
                    <div className="flex items-center">
                      <div className="text-base font-medium">{e.desc} </div>
                      {e.hasInfo && <InformationHelper text={e.info} />}
                    </div>
                    <h4 className="mt-3 text-[2.5vw] leading-[3.1vw] font-bold">
                      {e.value} {e.unit}
                    </h4>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-row gap-10 mt-[64px]">
              <div className="w-[605px] h-[834px] bg-[#1C1B38] rounded relative">
                <div className="w-[252px] h-[69px] absolute top-[40px] left-[40px]">
                  <h4 className="text-[36px] leading-[44.65px] font-bold text-white">Coin Toss</h4>
                  <p className="text-[14px] leading-[16px] font-normal text-[#AFAFC5] mt-[8px]">
                    Guess corrctly and double your money
                  </p>
                </div>
                <div className="w-[139px] h-[40px] absolute top-[40px] right-[64px] bg-[#0D0C2B] rounded">
                  <div className="mt-[12px] ml-[16px] font-normal text-[14px] leading-[16px] flex">
                    How it works
                    <InformationHelper text={'How it works'} />
                  </div>
                </div>
                <div className="absolute top-[173px] w-full text-center font-bold text-base text-white">
                  Select Head or Tail
                </div>
                <div className="absolute top-[231px] left-[150px] w-[304px] h-[120px] flex justify-between">
                  <button
                    onClick={() => {
                      selectHeadOrTail(CoinTossStatus.HEAD)
                    }}
                  >
                    {coinTossStatus == CoinTossStatus.HEAD ? (
                      <img src="images\pages\gamefi\cointoss\coin-head-active.png" />
                    ) : (
                      <img src="images\pages\gamefi\cointoss\coin-head-inactive.png" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      selectHeadOrTail(CoinTossStatus.TAIL)
                    }}
                  >
                    {coinTossStatus == CoinTossStatus.TAIL ? (
                      <img src="images\pages\gamefi\cointoss\coin-tail-active.png" />
                    ) : (
                      <img src="images\pages\gamefi\cointoss\coin-tail-inactive.png" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <div className="w-[532px] h-[429px] bg-[#1C1B38] rounded"></div>
                <div className="w-[532px] h-[365px] bg-[#1C1B38] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
