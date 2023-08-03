import React from 'react'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import { shortenAddress } from '@ui/utils'
import { WalletIcon } from './walletIcon'
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Link
} from '@chakra-ui/react'

export function ConnectedWallet() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="nav"
          gap="2"
          borderColor="brand.gray_20"
          borderWidth="1px"
          color="brand.biscay">
          <WalletIcon w="16px" />
          <Box as="span" display={{ base: 'none', md: 'inline' }}>
            {shortenAddress(address)}
            <ChevronDownIcon w={6} h={6} />
          </Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent p="3">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader as={Flex} alignItems="center">
          <Text>
            {chain?.name} ({chain?.id}) Chain Connected
          </Text>
        </PopoverHeader>
        <PopoverBody>
          <Flex
            as={Link}
            alignItems="center"
            color="brand.link"
            fontWeight="bold"
            href={`${chain?.blockExplorers?.default?.url}/address/${address}`}
            isExternal
            fontSize="sm">
            {shortenAddress(address)} <ExternalLinkIcon mx="2px" />
          </Flex>
        </PopoverBody>
        <Button onClick={() => disconnect()} variant="nav" gap="2">
          Disconnect
        </Button>
      </PopoverContent>
    </Popover>
  )
}
