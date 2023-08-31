import React from 'react'
import { SkeletonText, SkeletonCircle, Box } from '@chakra-ui/react'

export const LoadingList = ({ asyncManager }) => {
  return asyncManager.loading ? (
    <>
      {Array.from(Array(6).keys()).map((_, i) => {
        return (
          <Box
            key={i}
            padding="6"
            border="1px"
            borderColor="brand.gray_10"
            boxShadow="brand.base"
            bg="white"
            borderRadius="base">
            <SkeletonCircle size="6" />
            <SkeletonText
              mt="4"
              noOfLines={6}
              spacing="6"
              skeletonHeight="4"
              minHeight={'237px'}
            />
          </Box>
        )
      })}
    </>
  ) : null
}
