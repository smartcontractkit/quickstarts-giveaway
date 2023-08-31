import React from 'react'
import {
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  Box
} from '@chakra-ui/react'

export const Success = ({ show, onClose, message }) =>
  show && (
    <Alert position="relative" status="success" backgroundColor="#05c46b3d">
      <AlertIcon />
      <Box w="100%">
        <AlertDescription color="black">{message}</AlertDescription>
      </Box>

      <CloseButton
        color="black"
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  )
