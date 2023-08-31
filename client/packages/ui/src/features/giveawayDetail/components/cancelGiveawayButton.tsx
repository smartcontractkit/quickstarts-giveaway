import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner } from '@ui/models'

const onCancelClick = ({ update }) => update({ step: steps.CANCEL_GIVEAWAY })

export const CancelGiveawayButton = ({ update, giveaway, address }) =>
  giveaway?.status == GiveawayStatus.LIVE &&
  isGiveawayOwner(giveaway, address) && (
    <Button onClick={() => onCancelClick({ update })} variant="default">
      Cancel Giveaway
    </Button>
  )
