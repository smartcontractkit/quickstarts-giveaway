import React from 'react'
import { Container, Heading, Divider } from '@chakra-ui/react'

export const Hero = () => {
  return (
    <Container maxW="container.xl" mt="20">
      <Heading size="2xl" fontWeight="700" mb="6">
        Chainlink Giveaways
      </Heading>
      <Divider orientation="horizontal" mt="16" />
    </Container>
  )
}
