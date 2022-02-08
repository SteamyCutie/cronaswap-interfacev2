import React, { useState, useRef } from 'react'
import Container from '../../components/Container'
import Dots from '../../components/Dots'
import Head from 'next/head'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useCronaVaultContract } from 'hooks/useContract'
import { ArrowRightIcon } from '@heroicons/react/outline'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { formatNumber, getBalanceAmount } from 'functions/formatBalance'
import { getCronaPrice } from 'features/staking/useStaking'
import AutoPoolCard from 'app/features/staking/AutoPoolCard'
import ManualPoolCard from 'app/features/staking/ManualPoolCard'
import Typography from 'app/components/Typography'
import { formatNumberScale } from 'app/functions'
import Button from 'app/components/Button'
import IncentivePool from 'app/features/staking/IncentivePool/IncentivePool'

const buttonStyle =
  'flex justify-center items-center w-full h-14 rounded font-bold md:font-medium md:text-lg mt-5 text-sm focus:outline-none focus:ring'

export default function Stake() {
  const { i18n } = useLingui()
  const addTransaction = useTransactionAdder()

  const cronavaultContract = useCronaVaultContract()

  const autocronaBountyValue = useRef(0)

  const getCronaVault = async () => {
    const autocronaBounty = await cronavaultContract.calculateHarvestCronaRewards()
    autocronaBountyValue.current = getBalanceAmount(autocronaBounty._hex, 18).toNumber()
  }
  getCronaVault()

  const cronaPrice = getCronaPrice()
  const [pendingBountyTx, setPendingBountyTx] = useState(false)
  const handleBountyClaim = async () => {
    setPendingBountyTx(true)
    try {
      const gasLimit = await cronavaultContract.estimateGas.harvest()
      const tx = await cronavaultContract.harvest({ gasLimit: gasLimit.mul(120).div(100) })
      addTransaction(tx, {
        summary: `${i18n._(t`Claim`)} CRONA`,
      })
      setPendingBountyTx(false)
    } catch (error) {
      console.error(error)
      setPendingBountyTx(false)
    }
  }

  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
      <Head>
        <title key="title">Stake | CronaSwap</title>
        <meta key="description" name="description" content="Stake CronaSwap" />
      </Head>
      <div className="w-11/12 m-auto">
        {/* Hero */}
        <div className="flex-row items-center justify-between w-full px-8 py-6 space-y-2 rounded md:flex bg-cyan-blue bg-opacity-20">
          <div className="w-8/12 mb-5 space-y-2 gap-y-10 md:mb-0">
            <Typography variant="h2" className="mb-2 text-high-emphesis" weight={700}>
              {i18n._(t`Crona Stake`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Looking for a less resource-intensive alternative to mining?`)}
            </Typography>
            <Typography variant="sm" weight={400}>
              {i18n._(t`Use your CRONA tokens to earn more tokens,for Free.`)}
            </Typography>
            <a href="https://forms.gle/Y9mpAJGVisxU3JyG8" target="_blank" rel="noreferrer">
              <div className="flex items-center gap-2 mt-2 text-sm font-bold font-Poppins">
                <div className="text-light-blue">{i18n._(t`Apply to Launch`)}</div>
                <ArrowRightIcon height={14} className="" />
              </div>
            </a>
          </div>

          <div className="w-full px-4 py-4 m-auto rounded-lg md:w-4/12 md:px-6 bg-cyan-blue bg-opacity-30">
            <div className="text-lg font-bold text-white">{i18n._(t`Auto Crona Bounty`)}</div>
            <div className="flex items-center justify-between space-x-10">
              <div>
                <div className="text-xl font-bold text-white">{Number(autocronaBountyValue.current).toFixed(3)}</div>
                <div className="text-base text-light-blue">
                  {' '}
                  {Number(autocronaBountyValue.current * cronaPrice).toFixed(3)} USD
                </div>
              </div>
              <div>
                <Button
                  id="btn-create-new-pool"
                  color="gradient"
                  variant="outlined"
                  size="sm"
                  disabled={!autocronaBountyValue.current || pendingBountyTx}
                  onClick={handleBountyClaim}
                >
                  {pendingBountyTx ? <Dots>{i18n._(t`Claiming`)} </Dots> : i18n._(t`Claim`)}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full gap-4 mt-6 md:flex">
          <AutoPoolCard />
          <ManualPoolCard />
        </div>

        {/* Incentive pool */}

        <div className="w-full mt-6 md:flex">
          {/* <div>Incentive pool</div> */}
          <IncentivePool />
        </div>
      </div>
    </Container>
  )
}
