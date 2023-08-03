import { defineStyleConfig } from '@chakra-ui/react'

export const Select = defineStyleConfig({
  variants: {
    outline: {
      field: {
        borderColor: 'brand.gray_20'
      }
    }
  },
  sizes: {
    md: {
      field: { borderRadius: 'base' }
    },
    sm: {
      field: { borderRadius: 'base' }
    }
  }
})
