import React from 'react'
import { Button } from '@chakra-ui/react'
import { steps } from '@ui/features/giveawayDetail'
import { GiveawayStatus, isGiveawayOwner, GiveawayType } from '@ui/models'

const onViewWinnerClick = ({ update }) =>
  update({ step: steps.VIEW_WINNERS_DYNAMIC })

export const CheckWinnersButtonDynamic = ({ update, giveaway, address }) =>
  giveaway?.status == GiveawayStatus.FINISHED &&
  giveaway?.type == GiveawayType.DYNAMIC &&
  isGiveawayOwner(giveaway, address) && (
    <>
      <Button onClick={() => onViewWinnerClick({ update })} variant="default">
        View Winners
      </Button>
    </>
  )
