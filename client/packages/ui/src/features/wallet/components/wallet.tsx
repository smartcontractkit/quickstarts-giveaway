import React from 'react'
import { useAccount } from 'wagmi'
import { Flex } from '@chakra-ui/react'

import { ConnectWallet, ConnectedWallet } from '@ui/features/wallet'

export const Wallet = () => {
  const { address } = useAccount()

  return <Flex>{address ? <ConnectedWallet /> : <ConnectWallet />}</Flex>
}
