import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { joinGiveaway } from '@ui/features/giveawayDetail'

export const Join = ({ id, store, reset, asyncManager }) => {
  const [success, setSuccess] = useState(false)

  const componentDidMount = () => {
    joinGiveaway({
      id,
      fee: store.state.giveaway.fee,
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
          Join Giveaway
        </Heading>
        <Text>Successfully joined giveaway id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={() => reset(store)}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
