import React from 'react'
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Box
} from '@chakra-ui/react'

export const Modal = ({ children, onClose, isOpen }) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Box py="6">{children}</Box>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  )
}
