import { useState } from 'react'
import { useDashboardV1Contract } from 'app/hooks/useContract'
import { getBalanceAmount } from 'functions/formatBalance'

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
