import { BATCHES } from 'app/constants/batches'
import { useActiveWeb3React } from 'app/services/web3'

import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'

// Todo: Rewrite in terms of web3 as opposed to subgraph
const useBatches = () => {
  const { chainId } = useActiveWeb3React()

  const [batches, setBatches] = useState<any | undefined>()

  const fetchAllBatches = useCallback(async () => {
    const batches = Object.keys(BATCHES[chainId]).map((key) => {
      return { ...BATCHES[chainId][key], smartChef: key }
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
