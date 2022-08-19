import React from 'react'
import Link from 'next/link'

const GronaFlow = () => {
  const styleCell =
    'p-2 md:p-4 rounded-xl bg-dark-1000/50 items-center text-center grid align-middle text-sm md:text-base font-medium'
  const styleCard = `${styleCell} grid gap-1 items-center justify-center justify-items-center w-full text-center text-sm md:text-base`
  const styleCellBordered = `border-dark-800  p-4 flex items-center justify-center text-sm md:text-base font-medium`
  const styleCellHead = `${styleCellBordered} border-b-2 mb-2 -ml-4`
  const styleCellBody = `${styleCellBordered} border-r-2 mr-2 -mt-4 p-4`

  return (
    <div className="grid items-start justify-center grid-cols-1 gap-2 p-2 md:p-4">
      <div className="mb-4 text-2xl font-semibold text-center">Golden CRONA Breakdown</div>
      <div className="grid grid-cols-12 gap-1 md:gap-2">
        <div className={`${styleCellHead} ${styleCellBody} col-span-2`}></div>
        <div className={`${styleCellHead} col-span-3`}>
          <p className="font-extrabold">Converting</p>
        </div>
        <div className={`${styleCellHead} col-span-4`}>
          <p className="font-extrabold">Staking / Committing</p>
        </div>
        <div className={`${styleCellHead} col-span-3`}>
          <p className="font-extrabold">Returning</p>
        </div>

        <div className={`${styleCellBody} col-span-2`}>
          <p>Fee</p>
        </div>
        <div className={`${styleCell} col-span-3 gap-1`}>
          <p>28% Burn Fee</p>
          <p>2% Reflect Fee</p>
        </div>
        <div className={`${styleCell} col-span-4`}>
          <p>2% Reflect Fee (Both in and out)</p>
        </div>
        <div className={`${styleCell} col-span-3`}>
          <p>2% Reflect Fee</p>
        </div>
        <div className={`${styleCellBody} col-span-2`}>
          <p>Value</p>
        </div>
        <div className={`${styleCell} col-span-3`}>
          <p>.7 GRONA per CRONA</p>
        </div>
        <div className={`${styleCell} col-span-4`}>
          <p>1 GRONA calculated as 1.389 CRONA</p>
        </div>
        <div className={`${styleCell} col-span-3`}>
          <p>.98 CRONA per GRONA</p>
        </div>
      </div>
      <div className="mb-4 mt-12 text-2xl font-semibold text-center capitalize">Key Disclaimers</div>
      <div className={`${styleCard} !text-lg`}>
        The 2% reflect fee applies to all $GRONA transactions, including transfer, staking, unstaking, and participation
        in IFOs.
      </div>
      <div className={`${styleCard} !text-lg`}>
        You do not accumulate reflect fees when your GRONA is staked in a pool.
      </div>
      <div className="flex justify-center mt-4">
        {/* <Link href="/" passHref>
          <a target="_blank" rel="norefferer noopenner" className="text-blue text-lg font-semibold">
            Learn More
          </a>
        </Link> */}
        <a
          href="https://docs.cronaswap.org/tokenomics/grona"
          target="_blank"
          rel="noreferrer"
          className="text-blue text-lg font-semibold"
        >
          Learn More
        </a>
      </div>
    </div>
  )
}

export default GronaFlow
