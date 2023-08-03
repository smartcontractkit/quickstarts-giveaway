import React from 'react'
import { render, screen } from '@testing-library/react'

import { WithdrawButton } from '../'

const getProps = ({ status, type, address, owner, withdrawn }) => ({
  update: () => {},
  giveaway: {
    id: 1,
    status,
    type,
    owner,
    withdrawn
  },
  address
})

const getComponent = (props) => {
  const component = <WithdrawButton {...props} />

  return component
}

const checkStatusText = 'Withdraw LINK'

describe('WithdrawButton', () => {
  it('does not render withdraw button on status != finished', () => {
    const props = getProps({
      status: 0,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: false,
      type: 0
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render withdraw button on !address', () => {
    const props = getProps({
      status: 2,
      address: '',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: false,
      type: 0
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('does not render withdraw button on address != owner', () => {
    const props = getProps({
      status: 2,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32f',
      withdrawn: false,
      type: 0
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  // it('does not render withdraw button on type != dynamic', () => {
  //   const props = getProps({
  //     status: 2,
  //     address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
  //     owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
  //     withdrawn: false,
  //     type: 1
  //   })
  //   render(getComponent(props))

  //   const button = screen.queryByText(checkStatusText)
  //   expect(button).toBeNull()
  // })

  it('does not render withdraw button on withdrawn == true', () => {
    const props = getProps({
      status: 2,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: true,
      type: 0
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeNull()
  })

  it('renders withdraw button on status == finished && address == owner && withdrawn == false && type == dynamic', () => {
    const props = getProps({
      status: 2,
      address: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      owner: '0x0E1ce369e53275f3e0Ff92EA30BE84c55Bc8a32e',
      withdrawn: false,
      type: 0
    })
    render(getComponent(props))

    const button = screen.queryByText(checkStatusText)
    expect(button).toBeTruthy()
  })
})
