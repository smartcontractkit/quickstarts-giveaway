import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import {
  withdrawFunds,
  getClaimableAutomation
} from '@ui/features/giveawayDetail'

export const WithdrawKeeper = ({
  id,
  upkeepId,
  address,
  reset,
  asyncManager,
  store
}) => {
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const onWithdraw = () => {
    withdrawFunds({
      id,
      upkeepId,
      address,
      asyncManager,
      success: setWithdrawSuccess,
      update: store.update
    })
  }

  const componentDidMount = () => {
    getClaimableAutomation({ id, asyncManager, update: store.update })
    return () => setWithdrawSuccess(false)
  }
  useEffect(componentDidMount, [])

  const { claimableAutomation } = store.state
  const didFetchClaimable = claimableAutomation !== null

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
          <Text>
            You have {claimableAutomation} LINK available to withdraw.
          </Text>
          <Flex mt="2" justify="end">
            {claimableAutomation !== 0 ? (
              <Button
                variant="default"
                isDisabled={asyncManager.loading || asyncManager.pending}
                onClick={onWithdraw}>
                Withdraw
              </Button>
            ) : null}
          </Flex>
        </>
      )}
      {didFetchClaimable && withdrawSuccess && (
        <>
          <Text>You successfully withdrew {claimableAutomation} LINK.</Text>
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
