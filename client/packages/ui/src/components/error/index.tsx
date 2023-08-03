import React from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'

export const Error = ({ asyncManager }) =>
  asyncManager.error && (
    <Alert status="error" my="6">
      <AlertIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{asyncManager.error}</AlertDescription>
    </Alert>
  )
