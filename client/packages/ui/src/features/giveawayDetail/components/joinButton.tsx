import React from 'react'
import { Button } from '@chakra-ui/react'
import { ethers } from 'ethers'

import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, GiveawayType, isGiveawayParticipant } from '@ui/models'

const onJoinClick = ({ update }) => update({ step: steps.JOIN })

export const JoinButton = ({ update, giveaway, address, identifier }) =>
  giveaway?.status == GiveawayStatus.LIVE &&
  giveaway?.type == GiveawayType.DYNAMIC &&
  address &&
  identifier &&
  !isGiveawayParticipant(
    giveaway,
    ethers.utils.solidityKeccak256(['address'], [identifier])
  ) && (
    <Button onClick={() => onJoinClick({ update })} variant="default">
      Join Giveaway
    </Button>
  )
