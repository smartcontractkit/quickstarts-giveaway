import React from 'react'
import * as wagmi from 'wagmi'
import { render, screen } from '@testing-library/react'
import { Providers } from '@ui/providers'
import { AuthenticatedRoute } from './'

const text = 'Authenticated'

const getComponent = () => {
  const component = (
    <Providers>
      <AuthenticatedRoute connected={true}>
        <h2>{text}</h2>
      </AuthenticatedRoute>
    </Providers>
  )

  return component
}

const spy = (value) => {
  const spy = jest.spyOn(wagmi, 'useAccount')
  spy.mockReturnValue(value)
}

describe('AuthenticatedRoute', () => {
  it('redirects on connected', () => {
    spy({ address: null })
    render(getComponent())

    const heading = screen.queryByText(text)
    expect(heading).toBeNull()
  })

  it('renders child component on connected', () => {
    spy({ address: '0x123' })
    render(getComponent())

    const heading = screen.getByText(text)
    expect(heading).toBeTruthy()
  })
})
