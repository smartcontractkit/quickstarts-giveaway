import React from 'react'
import { useAccount } from 'wagmi'
import {
  Container,
  Heading,
  Center,
  Text,
  Box,
  Flex,
  HStack,
  Divider,
  useMediaQuery,
  Wrap
} from '@chakra-ui/react'

import {
  Loading,
  Pending,
  Error,
  StatusIcons,
  PermissionedIcon
} from '@ui/components'
import { useAsyncManager, useStore } from '@ui/hooks'
import {
  GiveawayType,
  isGiveawayStatic,
  isGiveawayLive,
  isGiveawayStaged,
  isGiveawayFinished,
  isGiveawayCancelled,
  GiveawayStatus
} from '@ui/models'
import {
  StepManager,
  JoinButton,
  PickWinnersButton,
  WithdrawButton,
  CancelUpkeepButton,
  WithdrawKeeperButton,
  CheckWinnersButtonDynamic,
  CancelGiveawayButton,
  CheckWinnersButton
} from '@ui/features/giveawayDetail'
import { formatUnixTs, formatFinishDate, shortenAddress } from '@ui/utils'
import { UploadWinners } from '@ui/features/giveawayDetail'
import { getGiveawayHook } from '@ui/api/contracts/readFunctions'

export const initialState = {
  giveaway: null,
  step: null,
  identifier: null,
  participantStatus: null,
  isParticipant: null,
  claimableLink: null,
  participants: []
}

const Row = ({ name, value }) => {
  return (
    <Flex
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="brand.gray_10"
      pb="6"
      my="6">
      <Text>{name}</Text>
      <Text>{value}</Text>
    </Flex>
  )
}

export const GiveawayDetail = ({ id }) => {
  const [isLargerThanMd] = useMediaQuery('(min-width: 48em)')
  const { address } = useAccount()
  const store = useStore({
    ...initialState
  })
  const asyncManager = useAsyncManager()

  const { giveaway } = store.state
  getGiveawayHook(store, id)

  return (
    giveaway?.id && (
      <Container
        maxW="container.md"
        my="20"
        p="10"
        pb="24"
        bg="brand.white"
        boxShadow="brand.base"
        borderRadius="base">
        <Loading asyncManager={asyncManager} />
        <Pending asyncManager={asyncManager} />
        <Error asyncManager={asyncManager} />
        <Center flexDirection="column" mb="6">
          <Heading
            size="xl"
            fontWeight="700"
            mb="6"
            wordBreak={'break-all'}
            textAlign="center">
            {giveaway.name}
          </Heading>
        </Center>
        <Center flexDirection="column" mb="14">
          <HStack bg="#F6F7FD" p="4" px="8" borderRadius="2xl" spacing="6">
            <HStack spacing="3" alignItems={'center'}>
              <StatusIcons status={giveaway.status} />
              <Text fontSize={'sm'}>
                {isGiveawayStaged(giveaway)
                  ? 'Staged'
                  : isGiveawayLive(giveaway)
                  ? 'Live'
                  : isGiveawayCancelled(giveaway)
                  ? 'Cancelled'
                  : isGiveawayFinished(giveaway)
                  ? 'Finished'
                  : 'Resolving'}
              </Text>
            </HStack>

            <>
              <Divider orientation="vertical" height="21px" />
              <HStack spacing="3" alignItems={'center'}>
                <Text fontSize="sm">
                  {isGiveawayStatic(giveaway) ? 'Static' : 'Dynamic'} Giveaway
                </Text>
              </HStack>
            </>

            {giveaway.permissioned && (
              <>
                <Divider orientation="vertical" height="21px" />
                <HStack spacing="3" alignItems={'center'}>
                  <PermissionedIcon />
                  <Text fontSize="sm">Private</Text>
                </HStack>
              </>
            )}
          </HStack>
        </Center>

        <Box>
          <Row name="Giveaway" value={giveaway.id} />
          <Row
            name="Status"
            value={
              isGiveawayStaged(giveaway)
                ? 'Staged'
                : isGiveawayLive(giveaway)
                ? 'Live'
                : 'Finished'
            }
          />
          <Row name="Name" value={giveaway.name} />
          <Row
            name="Type"
            value={isGiveawayStatic(giveaway) ? 'Static' : 'Dynamic'}
          />
          <Row name="Start Date" value={formatUnixTs(giveaway.startDate)} />

          {giveaway.status !== GiveawayStatus.FINISHED &&
            giveaway.type === GiveawayType.DYNAMIC && (
              <Row
                name="Active Until"
                value={
                  giveaway.automation
                    ? formatFinishDate(giveaway.startDate, giveaway.hours)
                    : 'Open-Ended'
                }
              />
            )}

          <Row
            name="Permissioned"
            value={giveaway.permissioned ? 'Yes' : 'No'}
          />
          <Row name="Prize Name" value={giveaway.prizeName} />
          <Row
            name="Contestants"
            value={giveaway.contestantsAddresses?.length}
          />
          <Row
            name="Owner"
            value={
              isLargerThanMd ? giveaway.owner : shortenAddress(giveaway.owner)
            }
          />

          <Center>
            <Wrap justify="center" spacing="6">
              <JoinButton
                update={store.update}
                giveaway={giveaway}
                address={address}
                identifier={address}
              />
              <CheckWinnersButtonDynamic
                giveaway={giveaway}
                update={store.update}
                address={address}
              />
              <CheckWinnersButton
                giveaway={giveaway}
                update={store.update}
                address={address}
                uploaded={store.state.uploaded}
              />
              <PickWinnersButton
                giveaway={giveaway}
                update={store.update}
                address={address}
              />
              <CancelUpkeepButton
                giveaway={giveaway}
                update={store.update}
                address={address}
              />
              <WithdrawButton
                giveaway={giveaway}
                update={store.update}
                address={address}
              />
              <WithdrawKeeperButton
                giveaway={giveaway}
                update={store.update}
                address={address}
              />
              <CancelGiveawayButton
                giveaway={giveaway}
                update={store.update}
                address={address}
              />
              <StepManager
                id={id}
                upkeepId={giveaway.upkeepId}
                store={store}
                address={address}
                giveaway={giveaway}
              />
            </Wrap>
          </Center>
          <Center h="60px">
            <UploadWinners
              update={store.update}
              giveaway={giveaway}
              address={address}
            />
          </Center>
        </Box>
      </Container>
    )
  )
}
