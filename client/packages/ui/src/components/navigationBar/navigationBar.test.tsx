import React from 'react'
import * as wagmi from 'wagmi'
import { render, screen } from '@testing-library/react'
import { Providers } from '@ui/providers'
import { NavigationBar } from './'

const getComponent = () => {
  const component = (
    <Providers>
      <NavigationBar />
    </Providers>
  )

  return component
}

const spy = (value) => {
  const spy = jest.spyOn(wagmi, 'useAccount')
  spy.mockReturnValue(value)
}

const text = 'Create Giveaway'

describe('NavigationBar', () => {
  it('does not render create button on not connected', () => {
    spy({ address: null })
    render(getComponent())

    const button = screen.queryByText(text)
    expect(button).toBeNull()
  })

  it('renders create button on connected', () => {
    spy({ address: '0x123' })
    render(getComponent())

    const button = screen.getByText(text)
    expect(button).toBeTruthy()
  })
})
