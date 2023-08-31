import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner } from '@ui/models'

const onPickWinnersClick = ({ update }) => update({ step: steps.PICK_WINNERS })

export const PickWinnersButton = ({ update, giveaway, address }) => {
  const validStatus =
    isGiveawayOwner(giveaway, address) &&
    (giveaway?.status === GiveawayStatus.LIVE ||
      (giveaway?.status === GiveawayStatus.STAGED && giveaway.automation))

  return (
    validStatus && (
      <Button onClick={() => onPickWinnersClick({ update })} variant="default">
        Pick Winners
      </Button>
    )
  )
}
