import React, { useState, useEffect } from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { cancelUpkeep } from '@ui/features/giveawayDetail'

export const CancelUpkeep = ({ id, upkeepId, store, reset, asyncManager }) => {
  const [success, setSuccess] = useState(false)

  const componentDidMount = () => {
    cancelUpkeep({
      id,
      upkeepId,
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
          Cancel Upkeep
        </Heading>
        <Text>Successfully cancelled upkeep for id `{id}`.</Text>
        <Flex mt="2" justify="end">
          <Button variant="default" onClick={() => reset(store)}>
            Close
          </Button>
        </Flex>
      </>
    )
  )
}
