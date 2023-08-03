import React from 'react'
import { render, screen } from '@testing-library/react'

import { PickWinnersButton } from '..'

const getProps = ({ status, address, owner, automation }) => ({
  update: () => {},
  giveaway: {
    status,
    owner,
    automation
  },
  address
})

const getComponent = (props) => {
  const component = <PickWinnersButton {...props} />

  return component
}

const checkStatusText = 'Pick Winners'

describe('PickWinnersButton', () => {
  it('does not render pick winners button on status != live', () => {
    const props = getProps({
      status: '',
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render pick winners button on !(status == staged && automation)', () => {
    const props = getProps({
      status: 0,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      automation: false
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render pick winners button on live and not address', () => {
    const props = getProps({
      status: 1,
      address: '',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render pick winners button on staged automation and not address', () => {
    const props = getProps({
      status: 0,
      address: '',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render pick winners button on live and not owner', () => {
    const props = getProps({
      status: 1,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32f',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render pick winners button on staged automation and not owner', () => {
    const props = getProps({
      status: 0,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32f',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('renders pick winners button on live and owner', () => {
    const props = getProps({
      status: 1,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeTruthy()
  })

  it('renders pick winners button on staged automation and owner', () => {
    const props = getProps({
      status: 0,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      automation: true
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeTruthy()
  })
})
