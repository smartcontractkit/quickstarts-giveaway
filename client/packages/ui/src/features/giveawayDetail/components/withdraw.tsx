import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { withdrawLink, getClaimableLink } from '@ui/features/giveawayDetail'

/* @Non-FunctionalImprovement
 * Would be good to write some tests for this component to check the various statuses.
 */
export const Withdraw = ({ id, reset, asyncManager, store }) => {
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const onWithdraw = () => {
    withdrawLink({
      id,
      asyncManager,
      success: setWithdrawSuccess,
      update: store.update
    })
  }

  const componentDidMount = () => {
    getClaimableLink({ id, asyncManager, update: store.update })
    return () => setWithdrawSuccess(false)
  }
  useEffect(componentDidMount, [])

  const { claimableLink } = store.state
  const didFetchClaimable = claimableLink !== null

  return (
    <>
      <Heading size="md" mb="6">
        Withdraw LINK
      </Heading>
      {!didFetchClaimable && (
        <Text>Checking how much excess LINK is available to withdraw.</Text>
      )}
      {didFetchClaimable && !withdrawSuccess && (
        <>
          <Text>You have {claimableLink} LINK available to withdraw.</Text>
          <Flex mt="2" justify="end">
            <Button
              variant="default"
              isDisabled={asyncManager.loading || asyncManager.pending}
              onClick={onWithdraw}>
              Withdraw
            </Button>
          </Flex>
        </>
      )}
      {didFetchClaimable && withdrawSuccess && (
        <>
          <Text>You successfully withdrew {claimableLink} LINK.</Text>
          <Flex mt="2" justify="end">
            <Button variant="default" onClick={() => reset(store)}>
              Close
            </Button>
          </Flex>
        </>
      )}
    </>
  )
}
