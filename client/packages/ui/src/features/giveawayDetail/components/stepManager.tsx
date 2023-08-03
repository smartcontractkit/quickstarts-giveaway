import React from 'react'

import { Error, Loading, Pending, Modal } from '@ui/components'
import { useAsyncManager } from '@ui/hooks'
import {
  Join,
  ProvideIdentifier,
  ParticipantStatus,
  PickWinners,
  Withdraw,
  WithdrawKeeper,
  CancelUpkeep,
  CheckWinners,
  steps,
  CancelGiveaway,
  ViewWinnersDynamic
} from '@ui/features/giveawayDetail'

const getComponent = (props) => {
  switch (props.store.state.step) {
    case steps.JOIN:
      return <Join {...props} />
    case steps.PROVIDE_IDENTIFER:
      return <ProvideIdentifier {...props} />
    case steps.PARTICIPANT_STATUS:
      return <ParticipantStatus {...props} />
    case steps.PICK_WINNERS:
      return <PickWinners {...props} />
    case steps.WITHDRAW:
      return <Withdraw {...props} />
    case steps.WITHDRAW_KEEPER:
      return <WithdrawKeeper {...props} />
    case steps.CANCEL_UPKEEP:
      return <CancelUpkeep {...props} />
    case steps.CHECK_WINNERS:
      return <CheckWinners {...props} />
    case steps.CANCEL_GIVEAWAY:
      return <CancelGiveaway {...props} />
    case steps.VIEW_WINNERS_DYNAMIC:
      return <ViewWinnersDynamic {...props} />
    default:
      return null
  }
}

export const StepManager = ({ id, store, upkeepId, address, giveaway }) => {
  const asyncManager = useAsyncManager()
  const { step } = store.state

  const reset = (_store) => {
    _store.update({ step: null })
    asyncManager.reset()
  }

  return (
    <Modal onClose={() => reset(store)} isOpen={!!step}>
      <Loading asyncManager={asyncManager} />
      <Pending asyncManager={asyncManager} />
      <Error asyncManager={asyncManager} />
      {getComponent({
        id,
        upkeepId,
        address,
        store,
        asyncManager,
        reset,
        giveaway
      })}
    </Modal>
  )
}
