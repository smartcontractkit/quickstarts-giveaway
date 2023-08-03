import React from 'react'
import { createRoot } from 'react-dom/client'

import { Providers } from '@ui/providers'
import { App } from '@ui/App'
import { NavigationBar } from '@ui/components'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <Providers>
    <NavigationBar />
    <App />
  </Providers>
)
