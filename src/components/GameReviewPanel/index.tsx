import React, { useCallback, useRef } from 'react'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

function GameReviewPanel() {
  const fixedListRef = useRef<FixedSizeList>()
  const itemData = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ]

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index]
    return data[index]?.id
  }, [])
  return (
    <div className="w-full h-[756px] bg-[#1C1B38] rounded flex flex-col">
      <div className="h-[64px]"></div>
      <div className="h-[1px] bg-[#AFAFC5] bg-opacity-30"></div>
      <div className="pl-6 pr-4 pt-4 pb-6 h-full">
        <AutoSizer disableWidth>
          {({ height }) => (
            <FixedSizeList
              height={height}
              ref={fixedListRef as any}
              width="100%"
              itemData={itemData}
              itemCount={itemData.length}
              itemSize={56}
              itemKey={itemKey}
            >
              {({ data, index, style }) => (
                <div style={style} key={index}>
                  {' '}
                  Item {index}
                </div>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default GameReviewPanel
