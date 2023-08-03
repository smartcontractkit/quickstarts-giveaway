import React from 'react'
import { Button } from '@chakra-ui/react'
import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner } from '@ui/models'

const onCheckWinnerClick = ({ update }) => update({ step: steps.CHECK_WINNERS })

export const CheckWinnersButton = ({ update, giveaway, address, uploaded }) =>
  giveaway?.status == GiveawayStatus.FINISHED &&
  uploaded &&
  isGiveawayOwner(giveaway, address) && (
    <>
      <Button onClick={() => onCheckWinnerClick({ update })} variant="default">
        Check Winners
      </Button>
    </>
  )
