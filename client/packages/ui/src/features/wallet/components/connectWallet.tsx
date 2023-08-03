import React, { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

import { WalletIcon } from './walletIcon'
import { MetaMaskIcon } from './metaMaskIcon'
import { polygonMumbai } from 'wagmi/chains'

import {
  useDisclosure,
  Button,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Divider,
  Box
} from '@chakra-ui/react'

export function ConnectWallet() {
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { connect, connectors, error } = useConnect({
    connector: new InjectedConnector(),
    chainId: polygonMumbai.id
  })

  const addressDidChange = () => {
    if (address) onClose()
  }
  useEffect(addressDidChange, [address])

  return (
    <>
      <Button onClick={onOpen} variant="nav" gap="2">
        <WalletIcon w="16px" />
        <Box as="span" display={{ base: 'none', md: 'inline' }}>
          Connect Wallet
        </Box>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg" fontWeight="600">
              Connect your wallet
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6" my="4">
            <SimpleGrid columns={2} spacing={6}>
              {connectors.map((connector) => {
                return (
                  <Flex
                    key={connector.id}
                    onClick={() => connect()}
                    as="button"
                    bg="brand.zircon"
                    p="5"
                    px="8"
                    direction="column"
                    gap="2"
                    border="1px solid transparent"
                    align="center"
                    _hover={{ borderColor: 'brand.primary' }}
                    borderRadius={4}>
                    {connector.name === 'MetaMask' ? (
                      <MetaMaskIcon w="12" h="12" />
                    ) : (
                      <WalletIcon w="12" h="12" />
                    )}
                    <Text color="brand.primary" fontSize="md" fontWeight="600">
                      {connector.name}
                    </Text>
                  </Flex>
                )
              })}
            </SimpleGrid>
            {error && (
              <>
                <Divider orientation="horizontal" mt="4" mb="4" />
                <Text color="brand.red">Error: {error.message}</Text>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
