import React from 'react'
import * as wagmi from 'wagmi'
import { render, screen } from '@testing-library/react'
import { Providers } from '@ui/providers'
import { Filters } from '..'

const getComponent = () => {
  const store = {
    state: {
      ownedByMe: false,
      status: ''
    },
    update: () => {},
    reset: () => {}
  }

  const component = (
    <Providers>
      <Filters store={store} />
    </Providers>
  )

  return component
}

const spy = (value) => {
  const spy = jest.spyOn(wagmi, 'useAccount')
  spy.mockReturnValue(value)
}

const text = 'Owned by Me'

describe('Filters', () => {
  it('does not render ownedByMe filter on not connected', () => {
    spy({ address: null })
    render(getComponent())

    const select = screen.queryByText(text)
    expect(select).toBeNull()
  })

  it('renders ownedByMe filter on connected', () => {
    spy({ address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e' })
    render(getComponent())

    const select = screen.getByText(text)
    expect(select).toBeTruthy()
  })
})
