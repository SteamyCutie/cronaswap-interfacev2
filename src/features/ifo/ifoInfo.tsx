export const OnSaleInfo = ({ ifo, poolId }) => {
  const saleAmount = ifo[poolId].saleAmount
  const distributionRatio = ifo[poolId].distributionRatio * 100
  return { saleAmount, distributionRatio }
}
