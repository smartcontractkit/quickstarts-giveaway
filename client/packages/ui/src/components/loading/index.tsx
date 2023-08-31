import React from 'react'
import { Spinner, Center, Text } from '@chakra-ui/react'

export const Loading = ({ asyncManager }) =>
  asyncManager.loading && (
    <Center my="6">
      <Spinner size="sm" mr="2" />
      <Text>Loading...</Text>
    </Center>
  )
