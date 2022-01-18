import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  Heading,
  Skeleton,
} from '@cronaswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCronaUSDC } from 'state/farms/hooks'
import Balance from 'components/Balance'
import { usePurchased, useClaimable } from '../hooks/useSeedSaleInfo'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const PreSaleInfo = () => {
  const { t } = useTranslation()
  // const {
  //   estimatedCronaBountyReward,
  //   fees: { callFee },
  // } = useCronaVault()

  const userClaimable = useClaimable()
  const userPurchased = usePurchased()
  const cronaPriceUSDC = usePriceCronaUSDC()

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(userPurchased).multipliedBy(cronaPriceUSDC)
  }, [cronaPriceUSDC, userPurchased])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCronaAmount = userPurchased ? userPurchased.gte(0) : false
  const cronaAmountToDisplay = hasFetchedCronaAmount ? getBalanceNumber(userPurchased, 18) - getBalanceNumber(userClaimable, 18) : 0
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0

  return (
    <>
      {/* {tooltipVisible && tooltip} */}
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="15px" bold color="textSubtle" mr="4px">
                {t('Your UnClaimed CRONAs')}
              </Text>
              {/* <Box ref={targetRef}>
                <HelpIcon color="textSubtle" />
              </Box> */}
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" mr="12px">
              <Heading>
                {hasFetchedCronaAmount ? (
                  <Balance fontSize="20px" bold value={cronaAmountToDisplay} decimals={3} />
                ) : (
                  <Skeleton height={20} width={96} mb="2px" />
                )}
              </Heading>
              {hasFetchedDollarBounty ? (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  value={dollarBountyToDisplay}
                  decimals={2}
                  unit=" USD"
                  prefix="~"
                />
              ) : (
                <Skeleton height={16} width={62} />
              )}
            </Flex>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default PreSaleInfo
