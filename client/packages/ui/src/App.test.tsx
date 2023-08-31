import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from '@testing-library/react'

import { Providers } from '@ui/providers'
import { NavigationBar } from '@ui/components'
import { App } from '@ui/App'

const getComponent = () => {
  const component = (
    <Providers>
      <NavigationBar />
      <App />
    </Providers>
  )

  return component
}

describe('App', () => {
  it('renders the App.', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)

    await act(() => root.render(getComponent()))

    expect(document.body.textContent).toBeTruthy()
  })
})
