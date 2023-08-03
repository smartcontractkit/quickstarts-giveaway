import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Container, Grid } from '@chakra-ui/react'

import { Routes } from '@ui/Routes'
import { LoadingList, Error, Success } from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  getGiveawayList,
  Card,
  Filters,
  filterList,
  initialFilterState
} from '@ui/features/giveawayList'

export const initialState = {
  list: []
}

export const GiveawayList = (props) => {
  const store = useStore(initialState)
  const filterStore = useStore(initialFilterState)
  const asyncManager = useAsyncManager()
  const { address } = useAccount()
  const history = useHistory()

  const componentDidMount = () => {
    getGiveawayList({ update: store.update, asyncManager })
  }
  useEffect(componentDidMount, [])

  const componentDidUnmount = () => filterStore.reset()
  useEffect(componentDidUnmount, [])

  return (
    <Container maxW="container.xl" mt="8" mb="20">
      <Success
        message={'Giveaway successfully created'}
        show={props.location?.search?.includes('create-success')}
        onClose={() => history.push(Routes.GiveawayList)}
      />
      <Error asyncManager={asyncManager} />
      <Filters store={filterStore} />
      <Grid
        templateColumns={{
          base: 'repeat(, 1fr)',
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        }}
        gap={16}
        my="4">
        <LoadingList asyncManager={asyncManager} />
        {store.state.list
          .filter(filterList(filterStore.state, address))
          .map(Card)}
      </Grid>
    </Container>
  )
}
