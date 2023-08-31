import React from 'react'
import { render, screen } from '@testing-library/react'

import { JoinButton } from '..'

const getProps = ({ type, status, address }) => ({
  giveaway: {
    type,
    status,
    contestantsAddresses: [
      '0x588d48a43dd2a9c301501b0c43fbe96b87dd688a32c6c9594a655ebb2f90a146'
    ]
  },
  address,
  identifier: address
})

const getComponent = (props) => {
  const component = <JoinButton {...props} />

  return component
}

const joinText = 'Join Giveaway'

describe('JoinButton', () => {
  it('does not render join button on status != in progress', () => {
    const props = getProps({
      status: null,
      type: null,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type != dynamic', () => {
    const props = getProps({
      status: 1,
      type: null,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type == dynamic && wallet != connected', () => {
    const props = getProps({
      status: 1,
      type: 0,
      address: null
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('does not render join button on status == in progress && type == dynamic && wallet == connected && already participant', () => {
    const props = getProps({
      status: 1,
      type: 0,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e'
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeNull()
  })

  it('renders join button on status == in progress && type == dynamic && wallet == connected && not already participant', () => {
    const props = getProps({
      status: 1,
      type: 0,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32f'
    })
    render(getComponent(props))

    const button = screen.queryByText(joinText)
    expect(button).toBeTruthy()
  })
})
