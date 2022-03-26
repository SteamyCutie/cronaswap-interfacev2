import { Disclosure } from '@headlessui/react'
import Button from 'app/components/Button'
import NavLink from 'app/components/NavLink'
import { Ifo } from 'app/constants/types'
import { PublicIfoData } from './hooks/types'
import {
  ChevronDownIcon,
  AdjustmentsIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  ScaleIcon,
  TerminalIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/outline'

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
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-2 auto-cols-max">
        <div className="relative p-6 rounded-lg bg-dark-800">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <AdjustmentsIcon className="h-8" />
            </div>
            <p className="ml-16 text-lg font-bold">TWO WAYS TO PARTICIPATE</p>
          </dt>
          <dd className="ml-16 text-base text-gray-500">
            Option 1: Commit with CRONA. <br /> Option 2: Commit with USDC.{' '}
          </dd>
        </div>

        <div className="relative p-6 rounded-lg bg-dark-800">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <TerminalIcon className="h-8" />
            </div>
            <p className="ml-16 text-lg font-bold">OVERFLOW MODEL</p>
          </dt>
          <dd className="ml-16 text-base text-gray-500">
            Your token allocation is based on your percentage of the total raise. All overflow contributions will be
            returned post-raise.
          </dd>
        </div>

        <div className="relative p-6 rounded-lg bg-dark-800">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <ClockIcon className="h-8" />
            </div>
            <p className="ml-16 text-lg font-bold">CONTRIBUTION WINDOW</p>
          </dt>
          <dd className="ml-16 text-base text-gray-500">
            IFOs run anywhere from 12-24 hours to ensure everyone across the globe has time to enter with ease.
          </dd>
        </div>

        <div className="relative p-6 rounded-lg bg-dark-800">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <CalendarIcon className="h-8" />
            </div>
            <p className="ml-16 text-lg font-bold">VESTING SCHEDULE</p>
          </dt>
          <dd className="ml-16 text-base text-gray-500">
            25% of tokens unlock immediately. The remaining 75% vest linearly over a timeframe specific to each IFO.
          </dd>
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
