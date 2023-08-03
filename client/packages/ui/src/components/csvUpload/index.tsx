import React, { useState } from 'react'
import { useCSVReader, formatFileSize } from 'react-papaparse'
import { Flex, Text, Box } from '@chakra-ui/react'

export const CSVUpload = ({ callback, isInvalid, details }) => {
  const { CSVReader } = useCSVReader()
  const [zoneHover, setZoneHover] = useState(false)

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        callback(results.data)
        setZoneHover(false)
      }}
      onDragOver={(event: DragEvent) => {
        event.preventDefault()
        setZoneHover(true)
      }}
      onDragLeave={(event: DragEvent) => {
        event.preventDefault()
        setZoneHover(false)
      }}>
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove
      }: any) => (
        <>
          <Flex
            px="3"
            borderWidth={2}
            borderStyle="dashed"
            borderColor={
              isInvalid
                ? 'brand.red'
                : zoneHover || acceptedFile
                ? 'brand.primary'
                : 'brand.gray_40'
            }
            borderRadius="base"
            direction="column"
            justify="center"
            _hover={{ borderColor: 'brand.primary' }}
            cursor="pointer"
            h="38px"
            {...getRootProps()}>
            {acceptedFile ? (
              <>
                <Flex position="relative" zIndex="1">
                  <Box
                    zIndex="-1"
                    opacity="0.1"
                    width="100%"
                    position="absolute"
                    bottom="0"
                    overflow="hidden"
                    sx={{
                      span: {
                        backgroundColor: 'brand.primary!important',
                        height: '24px!important',
                        boxShadow: 'none!important'
                      }
                    }}>
                    <ProgressBar />
                  </Box>

                  <Text size="md" color="brand.primary">
                    {acceptedFile.name}
                  </Text>
                  <Box as="span" mx="3">
                    |
                  </Box>
                  <Text size="sm"> {formatFileSize(acceptedFile.size)}</Text>

                  <Box
                    position="absolute"
                    height="32px"
                    right="0px"
                    top="1px"
                    w="23px"
                    h="23px"
                    fill={'brand.red'}
                    _hover={{ opacity: 0.5 }}
                    {...getRemoveFileProps()}
                    onMouseOver={(event: Event) => {
                      event.preventDefault()
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault()
                    }}>
                    <Remove />
                  </Box>
                </Flex>
              </>
            ) : (
              <Text size="md">{details}</Text>
            )}
          </Flex>
        </>
      )}
    </CSVReader>
  )
}
