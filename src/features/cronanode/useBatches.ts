import { BATCHES } from 'app/constants/batches'
import { useActiveWeb3React } from 'app/services/web3'
import { useBatchNodeContract } from 'app/hooks'

import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useBatches = () => {
  const { chainId } = useActiveWeb3React()

  const [batches, setBatches] = useState<any | undefined>()

  const fetchAllBatches = useCallback(async () => {
    const batches = Object.keys(BATCHES[chainId]).map((key) => {
      return { ...BATCHES[chainId][key], batchNode: key }
    })

    const sorted = _.orderBy(batches, ['apr'], ['desc'])

    setBatches({ batches: sorted })
  }, [])

  useEffect(() => {
    fetchAllBatches()
  }, [fetchAllBatches])

  return batches
}

export default useBatches

export const buy = async (contract, amount: string) => {
  try {
    return await contract.buy(amount.toBigNumber(18).toString())
  } catch (err) {
    return console.warn(err)
  }
}

export const harvest = async (contract) => {
  try {
    return await contract.harvest()
  } catch (err) {
    return console.warn(err)
  }
}

export const useBuyBatch = () => {
  const nodeContract = useBatchNodeContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      try {
        return await buy(nodeContract, amount)
      } catch (e) {
        return false
      }
    },
    [nodeContract]
  )

  return { handleBuy }
}

export const useHarvestBatch = () => {
  const nodeContract = useBatchNodeContract()

  const handleHarvest = useCallback(
    async () => {
      try {
        return await handleHarvest(nodeContract)
      } catch (e) {
        return false;
      }
    },
    [nodeContract]
  )

  return { handleHarvest }
}
