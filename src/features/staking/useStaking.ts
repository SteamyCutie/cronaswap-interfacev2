import { useState } from 'react'
import { useDashboardV1Contract } from 'app/hooks/useContract'
import { getBalanceAmount, getBalanceNumber, getDecimalAmount, getFullDisplayBalance } from 'functions/formatBalance'
import { useCronaUsdcPrice } from '../farms/hooks'
import BigNumber from 'bignumber.js'
import { formatBalance } from 'app/functions'

export function getAPY() {
  const aprToApy = (apr: number, compoundFrequency = 1, days = 365, performanceFee = 0) => {
    const daysAsDecimalOfYear = days / 365
    const aprAsDecimal = apr / 100
    const timesCompounded = 365 * compoundFrequency
    let apyAsDecimal = (apr / 100) * daysAsDecimalOfYear
    if (timesCompounded > 0) {
      apyAsDecimal = (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - 1
    }
    if (performanceFee) {
      const performanceFeeAsDecimal = performanceFee / 100
      const takenAsPerformanceFee = apyAsDecimal * performanceFeeAsDecimal
      apyAsDecimal -= takenAsPerformanceFee
    }
    return apyAsDecimal * 100
  }

  const [apr, setAPR] = useState(0)
  const dashboardContract = useDashboardV1Contract()
  const getManualAPR = async () => {
    const aprofManual = await dashboardContract.apyOfPool(0)
    const aprManual = getBalanceAmount(aprofManual._hex, 18)
    setAPR(aprManual.toNumber() * 100)
  }
  getManualAPR()
  const apy = aprToApy(apr)
  return { manualAPY: apr, autoAPY: apy }
}

export function getCronaPrice() {
  const cronaPriceInBigNumber = useCronaUsdcPrice()
  // console.log(formatBalance(cronaPriceInBigNumber ? cronaPriceInBigNumber : 0))
  const cronaPrice = formatBalance(cronaPriceInBigNumber ? cronaPriceInBigNumber : 0)
  return Number(cronaPrice)
}

export function convertSharesToCrona(
  shares: BigNumber,
  cronaPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3
) {
  const sharePriceNumber = getBalanceNumber(cronaPerFullShare, decimals)
  const amountInCrona = new BigNumber(shares.multipliedBy(sharePriceNumber))
  const cronaAsNumberBalance = getBalanceNumber(amountInCrona, decimals)
  const cronaAsBigNumber = getDecimalAmount(new BigNumber(cronaAsNumberBalance), decimals)
  const cronaAsDisplayBalance = getFullDisplayBalance(amountInCrona, decimals, decimalsToRound)
  return { cronaAsNumberBalance, cronaAsBigNumber, cronaAsDisplayBalance }
}
