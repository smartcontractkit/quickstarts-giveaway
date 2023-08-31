import React from 'react'
import { Button, Tooltip } from '@chakra-ui/react'

import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner } from '@ui/models'

const onCancelClick = ({ update }) => update({ step: steps.CANCEL_UPKEEP })

export const CancelUpkeepButton = ({ update, giveaway, address }) =>
  giveaway?.status == GiveawayStatus.FINISHED &&
  isGiveawayOwner(giveaway, address) && (
    <Tooltip
      hasArrow
      arrowSize={10}
      placement="top"
      label="Upkeep must be cancelled to withdraw Automation LINK">
      <Button onClick={() => onCancelClick({ update })} variant="default">
        Cancel Upkeep
      </Button>
    </Tooltip>
  )
