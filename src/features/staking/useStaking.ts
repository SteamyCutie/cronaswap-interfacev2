import { useState } from 'react'
import { useDashboardV1Contract } from 'app/hooks/useContract'
import { getBalanceAmount } from 'functions/formatBalance'

export function getManualAPY() {
  const [apy, setAPY] = useState(0)
  const dashboardContract = useDashboardV1Contract()
  const getManualAPY = async () => {
    const apyofManual = await dashboardContract.apyOfPool(0)
    const apyManual = getBalanceAmount(apyofManual._hex, 18)
    setAPY(apyManual.toNumber() * 100)
  }
  getManualAPY()
  return apy
}
