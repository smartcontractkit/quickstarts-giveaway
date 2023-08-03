import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Switch, FormLabel, Select, HStack, Box, Flex } from '@chakra-ui/react'

import { GiveawayStatus } from '@ui/models'

export const initialFilterState = {
  ownedByMe: false,
  status: ''
}

export const filterList = (filters, address) => (giveaway) => {
  const status = filters.status == '' || filters.status == giveaway.status
  const ownedByMe = !filters.ownedByMe || giveaway.owner == address

  return status && ownedByMe
}

export const Filters = ({ store }) => {
  const { address } = useAccount()

  const { state, update, reset } = store

  const onFilterStatus = (e) => update({ status: e.target.value })
  const onFilterOwnedByMe = () => update({ ownedByMe: !state.ownedByMe })

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return (
    <>
      <Box my="8">
        <HStack spacing="24px">
          {address && (
            <Flex align="center">
              <FormLabel htmlFor="ownerd-by-me" mb="0" w="105px">
                Owned by Me
              </FormLabel>
              <Switch
                id="ownerd-by-me"
                checked={state.ownedByMe}
                onChange={onFilterOwnedByMe}
              />
            </Flex>
          )}
          <Select
            bg="white"
            value={state.status}
            onChange={onFilterStatus}
            maxWidth="250px">
            <option value="">All</option>
            <option value={GiveawayStatus.STAGED}>Staged</option>
            <option value={GiveawayStatus.LIVE}>Live</option>
            <option value={GiveawayStatus.RESOLVING}>Resolving</option>
            <option value={GiveawayStatus.FINISHED}>Finished</option>
          </Select>
        </HStack>
      </Box>
    </>
  )
}
