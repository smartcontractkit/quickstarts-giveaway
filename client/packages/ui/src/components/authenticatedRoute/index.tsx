import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { Routes } from '@ui/Routes'

const Unauthenticated = <Redirect to={Routes.GiveawayList} />

export const AuthenticatedRoute = ({ connected, children }) => {
  const { address } = useAccount()

  if (connected && !address) return Unauthenticated

  return children
}
