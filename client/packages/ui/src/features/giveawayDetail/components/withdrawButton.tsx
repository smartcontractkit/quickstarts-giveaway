import React from 'react'
import { Button } from '@chakra-ui/react'

import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner } from '@ui/models'

const onWithdrawClick = ({ update }) => update({ step: steps.WITHDRAW })

export const WithdrawButton = ({ update, giveaway, address }) =>
  giveaway?.status == GiveawayStatus.FINISHED &&
  isGiveawayOwner(giveaway, address) &&
  !giveaway.withdrawn && (
    <Button onClick={() => onWithdrawClick({ update })} variant="default">
      Withdraw LINK
    </Button>
  )
