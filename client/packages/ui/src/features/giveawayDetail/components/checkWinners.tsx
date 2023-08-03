import React, { useState, useEffect } from 'react'
import { Button, Text, Stack, Flex, Heading, Tooltip } from '@chakra-ui/react'

export const CheckWinners = ({ store, reset }) => {
  const [winners, setWinners] = useState([])

  const componentDidMount = () => {
    readWinners(store)
  }

  useEffect(componentDidMount, [])

  const readWinners = (store) => {
    const participants = store.state.hashParticipants
    const stringParticipants = store.state.stringParticipants
    const giveawayWinners = store.state.giveaway.winners
    const winnersArr = []
    for (let i = 0; i < participants.length; i++) {
      if (giveawayWinners.includes(participants[i])) {
        winnersArr.push(stringParticipants[i])
      }
    }
    setWinners(winnersArr)
  }

  const exportToCSV = () => {
    const csvData = winners.join('\n')
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'winners.csv'
    link.href = url
    link.click()
  }

  return (
    <>
      <Heading size="md" mb="6">
        Giveaway Winners
      </Heading>
      <Stack direction="column" spacing="4">
        {winners.map((winner) => (
          <Text fontSize="lg" key={winner}>
            {winner}
          </Text>
        ))}
      </Stack>
      <Flex mt="2" justify="end">
        <Tooltip
          hasArrow
          arrowSize={10}
          placement="top"
          color="red.500"
          label="Warning: You are exporting private data.">
          <Button variant="default" mr="4" onClick={exportToCSV}>
            Export to CSV
          </Button>
        </Tooltip>
        <Button variant="default" onClick={() => reset(store)}>
          Close
        </Button>
      </Flex>
    </>
  )
}
