import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { cancelGiveaway } from '@ui/features/giveawayDetail'

export const CancelGiveaway = ({ id, store, reset, asyncManager }) => {
  const [success, setSuccess] = useState(false)

  const componentDidMount = () => {
    cancelGiveaway({
      id,
      asyncManager,
      success: setSuccess,
      update: store.update
    })
  }
  useEffect(componentDidMount, [])

  return (
    success && (
      <>
        <Heading size="md" mb="6">
          Cancel Giveaway
        </Heading>
        <Text>Successfully cancelled giveaway for id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={() => reset(store)}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
