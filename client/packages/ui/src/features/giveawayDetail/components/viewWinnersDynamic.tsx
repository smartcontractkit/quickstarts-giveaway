import React from 'react'
import { Button, Text, Flex, Heading } from '@chakra-ui/react'
import { GiveawayStatus, isGiveawayOwner, GiveawayType } from '@ui/models'

export const ViewWinnersDynamic = ({ giveaway, address }) => {
  const exportWinnersToCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' + giveaway?.winners?.join('\n')
    const encodedURI = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedURI)
    link.setAttribute('download', 'winners.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {giveaway?.status === GiveawayStatus.FINISHED &&
        giveaway?.type === GiveawayType.DYNAMIC &&
        isGiveawayOwner(giveaway, address) && (
          <>
            <Heading size="md" mb="6">
              View Winners
            </Heading>
            <Text as="ul" style={{ listStyleType: 'none' }}>
              {giveaway?.winners?.map((winner, index) => (
                <Text as="li" key={index} style={{ marginBottom: '0.5em' }}>
                  {winner}
                </Text>
              ))}
            </Text>
            <Flex mt="2" justify="end">
              <Button variant="default" onClick={() => exportWinnersToCSV()}>
                Export to CSV
              </Button>
            </Flex>
          </>
        )}
    </>
  )
}
