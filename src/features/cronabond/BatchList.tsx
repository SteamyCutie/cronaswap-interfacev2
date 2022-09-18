import useFuse from '../../hooks/useFuse'
import { useRouter } from 'next/router'

import React, { useState } from 'react'
import { useLingui } from '@lingui/react'
import useSortableData from '../../hooks/useSortableData'
import Dots from '../../components/Dots'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteScroll } from '../farms/hooks'
import useBatches from './useBatches'
import BatchListItem from './BatchListItem'

export default function BatchList(): JSX.Element {
  const { i18n } = useLingui()

  const router = useRouter()
  const type = router.query.filter == null ? 'all' : (router.query.filter as string)

  const batches = useBatches()

  const options = { keys: ['symbol', 'name'], threshold: 0.4 }
  const { result, search, term } = useFuse({
    data: batches?.batches && batches?.batches.length > 0 ? batches?.batches : [],
    options,
  })

  const flattenSearchResults = result.map((a: { item: any }) => (a.item ? a.item : a))

  const { items, requestSort, sortConfig } = useSortableData(flattenSearchResults)
  const [numDisplayed, setNumDisplayed] = useInfiniteScroll(items)

  return (
    <div className="w-full col-span-4 space-y-6 lg:col-span-3">
      {items && items.length > 0 ? (
        <InfiniteScroll
          dataLength={numDisplayed}
          next={() => setNumDisplayed(numDisplayed + 5)}
          hasMore={true}
          loader={null}
        >
          <div className="space-y-2">
            {items.slice(0, numDisplayed).map((batch, index) => (
              <BatchListItem key={index} batch={batch} />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="w-full py-6 text-center">{term ? <span>No Results.</span> : <Dots>Loading</Dots>}</div>
      )}
    </div>
  )
}
