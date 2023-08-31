import React from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage
} from '@chakra-ui/react'

export const Control = ({
  label,
  errorMessage,
  helper,
  isInvalid,
  children
}: {
  label: string
  errorMessage?: string
  helper?: string | JSX.Element
  isInvalid?: boolean
  children: JSX.Element
}) => {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      {children}
      {!errorMessage ? (
        helper ? (
          <FormHelperText>{helper}</FormHelperText>
        ) : null
      ) : (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  )
}
