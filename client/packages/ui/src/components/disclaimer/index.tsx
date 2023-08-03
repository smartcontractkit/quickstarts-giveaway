import React from 'react'
import { Container, Heading, Text } from '@chakra-ui/react'

export const Disclaimer = () => {
  return (
    <Container maxW="container.xl" mt="20" mb="20">
      <Heading size="2xl" fontWeight="700" mb="6">
        Disclaimer
      </Heading>
      <Text fontSize="lg" color="brand.gray_70" fontWeight="300">
        This implementation represents an example of using a Chainlink product
        or service. It is provided to to help you understand how to interact
        with Chainlink’s systems so that you can integrate them into your own.
        This implementation is provided &quot;AS IS&quot; without warranties of
        any kind, has not been audited, and may be missing key checks or error
        handling to make the usage of the product more clear. Take everything in
        this implementation as an example and not something to be use in a
        production ready service.
      </Text>
    </Container>
  )
}
