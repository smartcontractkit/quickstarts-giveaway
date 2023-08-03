import React from 'react'
import { Button, Tooltip } from '@chakra-ui/react'

import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.WITHDRAW_KEEPER })

export const WithdrawKeeperButton = ({ update, giveaway, address }) =>
  giveaway?.status == GiveawayStatus.FINISHED &&
  isGiveawayOwner(giveaway, address) && (
    <Tooltip
      hasArrow
      arrowSize={10}
      placement="top"
      label="Block time must be reached before withdrawal is available">
      <Button onClick={() => onWithdrawClick({ update })} variant="default">
        Withdraw Automation LINK
      </Button>
    </Tooltip>
  )
