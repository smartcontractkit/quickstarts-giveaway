import React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { ChakraProvider } from '@chakra-ui/react'

import { theme } from '@ui/styles/theme'
import { Web3WalletProvider } from './'

const history = createBrowserHistory()

export const Providers = ({ children }) => (
  <Router history={history}>
    <ChakraProvider theme={theme}>
      <Web3WalletProvider>{children}</Web3WalletProvider>
    </ChakraProvider>
  </Router>
)
