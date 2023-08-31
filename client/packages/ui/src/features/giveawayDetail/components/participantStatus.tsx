import React from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'

import { participantStatus, claimPrize } from '@ui/features/giveawayDetail'
import { GiveawayType } from '@ui/models'
import { Fireworks } from '@fireworks-js/react'

const Close = ({ reset, store }) => (
  <Flex mt="2" justify="end">
    <Button variant="default" onClick={() => reset(store)}>
      Close
    </Button>
  </Flex>
)

const Lost = ({ reset, store }) => {
  return (
    <>
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      <Text>Sorry, no luck this time! Try again soon.</Text>
      <Close reset={reset} store={store} />
    </>
  )
}

const WonUnclaimed = ({ id, store, asyncManager }) => {
  const onClaim = async () => {
    const response = await claimPrize({
      id,
      asyncManager,
      update: store.update
    })

    if (response?.giveaway) {
      store.update({
        participantStatus: participantStatus.WON_CLAIMED,
        giveaway: response.giveaway
      })
    }
  }

  return (
    <>
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      {!asyncManager.loading && !asyncManager.pending && (
        <Fireworks
          options={{ opacity: 1 }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
            background: 'transparent',
            zIndex: -1
          }}
        />
      )}
      <Text>You won!</Text>
      {store.state.giveaway.type == GiveawayType.DYNAMIC &&
        store.state.giveaway.prizeWorth == '0' && (
          <Flex mt="2" justify="end">
            <Button
              variant="default"
              isDisabled={asyncManager.loading || asyncManager.pending}
              onClick={onClaim}
              loadingText={
                asyncManager.loading
                  ? 'Claiming prize'
                  : 'Waiting for confirmation'
              }>
              Claim Prize
            </Button>
          </Flex>
        )}
    </>
  )
}

const WonClaimed = ({ store, reset }) => {
  return (
    <>
      <Heading size="md" mb="6">
        Did I win?
      </Heading>
      <Text>
        {' '}
        You Won!
        {store.state.giveaway.type == GiveawayType.DYNAMIC &&
          ` (and you successfully claimed your prize)`}
      </Text>
      <Close reset={reset} store={store} />
    </>
  )
}

export const ParticipantStatus = (props) => {
  switch (props.store.state.participantStatus) {
    case participantStatus.LOST:
      return <Lost {...props} />
    case participantStatus.WON_UNCLAIMED:
      return <WonUnclaimed {...props} />
    case participantStatus.WON_CLAIMED:
      return <WonClaimed {...props} />
    default:
      return null
  }
}
