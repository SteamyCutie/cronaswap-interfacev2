import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import Button from 'app/components/Button'
import NavLink from 'app/components/NavLink'
import { Ifo } from 'app/constants/types'
import { PublicIfoData } from './hooks/types'

const faqs = [
  {
    question: 'What’s the difference between a CRONA OFFERING and USDC OFFERING?',
    answer:
      'In the CRONA OFFERING, every user can commit a maximum of about 1000 USD worth of USDC Tokens. We calculate the maximum USDC amount about 30 minutes before each IFO. The CRONA OFFERING has no participation fee. In the USDC OFFERING, there’s no limit to the amount of USDC Tokens you can commit. However, there’s a fee for participation: see below.',
  },
  {
    question: 'Which sale should I commit to? Can I do both?',
    answer:
      'You can choose one or both at the same time! If you’re only committing a small amount, we recommend the CRONA OFFERING first.',
  },
  {
    question: 'How much is the participation fee?',
    answer:
      'There’s only a participation fee for the USDC OFFERING. There’s no fee for the CRONA OFFERING. The fee will start at 1%. The 1% participation fee decreases in cliffs, based on the percentage of overflow from the “Unlimited” portion of the sale.',
  },

  {
    question: 'What is Overflow Sale Model?',
    answer:
      'Both sales (CRONA OFFERING and USDC OFFERING) will be conducted using the Overflow Sale Model. For CRONA OFFERING, in order to ensure CRONA OFFERING participants have meaningful IFO allocation in the event of oversubscription, we will implement the Max Overflow mechanism. The CRONA OFFERING pool will stop accepting further deposit commitment once the overflow reaches 5x / 500% of the amount to raise. Please note that the final allocation you receive will still be subject to the total amount raised in this sale method. However, you will not be battling any whales.For USDC OFFERING, users are able to allocate as much or as little as they want to the IFO, their final allocation will be based on the amount of funds they put in as a percentage of all funds provided by other users at the time the IFO sale ends. Users will then receive back any leftover funds when claiming their tokens after the sale.In essence, the more a user commits, the more allocation they may receive based on their percent commitment over the total committed amount. Any unspent amount is returned to users.',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const IfoQuestions = ({ ifo, publicIfoData }: { ifo: Ifo; publicIfoData: PublicIfoData }) => {
  const raiseTokenBasic = publicIfoData['poolBasic'].raiseToken
  const raiseTokenUnlimited = publicIfoData['poolUnlimited'].raiseToken

  return (
    <div className="px-4 py-6 mx-auto rounded sm:py-8 sm:px-6 lg:px-8 bg-dark-900">
      {/* step */}
      <h2 className="mb-8 text-3xl font-extrabold text-center text-high-emphesis sm:text-4xl">How to take part</h2>
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3 auto-cols-max">
        <div className="p-4 rounded-lg bg-dark-800">
          <h1 className="text-lg">1. Get CRONA</h1>
          <h2 className="flex flex-row items-center mb-2 text-sm">
            Lock your CRONA in the Boost Locker to get CRONA. You’ll spend them to buy IFO sale tokens
          </h2>

          {/* <NavLink href={'/boost'}>
                <a className="p-2 mt-4 text-white rounded-md" >
                  Get veCRONA
                </a>
              </NavLink> */}
          <Button id="btn-create-new-pool" color="gradient" size="sm">
            <a href="/swap">Get CRONA</a>
          </Button>
        </div>
        <div className="p-4 rounded-lg bg-dark-800">
          <h1 className="text-lg">
            2. Commit {raiseTokenBasic.symbol}/{raiseTokenUnlimited.symbol} Tokens
          </h1>
          <h2 className="flex flex-row items-center text-sm">
            When the IFO sales are live, you can “commit” your {raiseTokenBasic.symbol}/{raiseTokenUnlimited.symbol}{' '}
            tokens to buy the tokens being sold. We recommend committing to the CRONA OFFERING first, but you can do
            both if you like.
          </h2>
        </div>
        <div className="p-4 rounded-lg bg-dark-800">
          <h1 className="text-lg">3. Claim Your Tokens</h1>
          <h2 className="flex flex-row items-center text-sm">
            After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent{' '}
            {raiseTokenBasic.symbol}/{raiseTokenUnlimited.symbol} tokens will be returned to your wallet.
          </h2>
        </div>
      </div>

      <div className="mx-auto divide-y-2 divide-dark-800">
        <h2 className="text-3xl font-extrabold text-center text-high-emphesis sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <dl className="mt-6 space-y-6 divide-y-2 divide-dark-800">
          {faqs.map((faq) => (
            <Disclosure as="div" key={faq.question} className="pt-6">
              {({ open }) => (
                <>
                  <dt className="text-lg">
                    <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-600">
                      <span className="font-medium text-white">{faq.question}</span>
                      <span className="flex items-center ml-6 h-7">
                        <ChevronDownIcon
                          className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="pr-12 mt-2">
                    <p className="text-base text-gray-400">{faq.answer}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  )
}
