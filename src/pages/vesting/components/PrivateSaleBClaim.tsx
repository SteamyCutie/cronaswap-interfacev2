import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  Button,
  Heading,
  Skeleton,
} from '@cronaswap/uikit'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCronaUSDC } from 'state/farms/hooks'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { usePrivateSaleB } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

import { useClaimable } from '../hooks/usePrivateSaleBInfo'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const PreSaleInfo = () => {
  const { t } = useTranslation()
  
  const cronaPriceUSDC = usePriceCronaUSDC()
  const { callWithGasPrice } = useCallWithGasPrice()
  const privateSaleBContract = usePrivateSaleB()
  const userClaimable = useClaimable()

  const { toastError, toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(userClaimable).multipliedBy(cronaPriceUSDC)
  }, [cronaPriceUSDC, userClaimable])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCronaAmount = userClaimable ? userClaimable.gte(0) : false
  const cronaAmountToDisplay = hasFetchedCronaAmount ? getBalanceNumber(userClaimable, 18) : 0
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0

  const handleClaim = async () => {
    setPendingTx(true)
    try {
      const tx = await callWithGasPrice(privateSaleBContract, 'claim', undefined, { gasLimit: DEFAULT_GAS_LIMIT })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(
          t('Pre-sale claimed!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('CRONAs has been sent to your wallet.')}
          </ToastDescriptionWithTx>,
        )
        setPendingTx(false)
      }
    } catch (error) {
      console.error(error)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  return (
    <>
      {/* {tooltipVisible && tooltip} */}
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="16px" bold color="textSubtle" mr="4px">
                {t('Your Claimable CRONAs')}
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
            <Button
              isLoading={pendingTx}
              disabled={!dollarBountyToDisplay || !cronaAmountToDisplay}
              onClick={handleClaim}
              scale="sm"
              id="clickClaimVaultBounty"
            >
              {pendingTx ? t('Claiming') : t('Claim')}
            </Button>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default PreSaleInfo
