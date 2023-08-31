import React from 'react'
import { Spinner, Center, Text } from '@chakra-ui/react'

export const Pending = ({ asyncManager }) =>
  asyncManager.pending && (
    <Center my="6">
      <Spinner size="sm" mr="2" />
      <Text>Pending transaction...</Text>
    </Center>
  )
