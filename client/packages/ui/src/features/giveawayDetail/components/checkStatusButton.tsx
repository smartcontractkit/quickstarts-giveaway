import React from 'react'
import { Button } from '@chakra-ui/react'
import { steps } from '@ui/features/giveawayDetail'
import {
  GiveawayStatus,
  GiveawayType,
  isGiveawayParticipant,
  isGiveawayWinner,
  isGiveawayClaimedPrize,
  isGiveawayOwner
} from '@ui/models'
import { ethers } from 'ethers'

const hashedUserAddress = (identifier) =>
  ethers.utils.solidityKeccak256(['address'], [identifier])

const onParticipantStatusClick = async ({ update, giveaway, identifier }) => {
  // Require user to provide unique identifier
  if (giveaway.type == GiveawayType.STATIC)
    return update({ step: steps.PROVIDE_IDENTIFER })
  // Automatically use users wallet address as unique identifier
  if (giveaway.type == GiveawayType.DYNAMIC) {
    const winner = isGiveawayWinner(giveaway, hashedUserAddress(identifier))
    const claimedPrize = isGiveawayClaimedPrize(
      giveaway,
      hashedUserAddress(identifier)
    )

    const participantStatus =
      winner && claimedPrize ? 'WON_CLAIMED' : winner ? 'WON_UNCLAIMED' : 'LOST'

    if (participantStatus)
      update({
        identifier,
        participantStatus,
        step: steps.PARTICIPANT_STATUS
      })
  }
}

export const CheckStatusButton = (props) => {
  if (
    props.giveaway?.status === GiveawayStatus.FINISHED &&
    ((props.giveaway?.type === GiveawayType.STATIC &&
      !isGiveawayOwner(props.giveaway, props.address)) ||
      (props.identifier &&
        isGiveawayParticipant(
          props.giveaway,
          hashedUserAddress(props.identifier)
        )))
  ) {
    return (
      <Button onClick={() => onParticipantStatusClick(props)} variant="default">
        Did I win?
      </Button>
    )
  } else {
    return null
  }
}
