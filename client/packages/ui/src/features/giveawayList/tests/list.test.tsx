import React from 'react'
import { create, act } from 'react-test-renderer'
import { render, screen } from '@testing-library/react'

import { Providers } from '@ui/providers'
import { GiveawayList } from '..'

const data = [
  {
    id: 0,
    name: 'STAGED:STATIC',
    status: 0,
    type: 1
  },
  {
    id: 1,
    name: 'LIVE:STATIC',
    status: 1,
    type: 1,
    prizeName: 'Prize Name'
  }
]

jest.mock('@ui/api', () => {
  return {
    contracts: {
      getAllGiveaways: jest.fn().mockImplementation(() => Promise.resolve(data))
    }
  }
})

const getComponent = () => {
  const component = (
    <Providers>
      <GiveawayList />
    </Providers>
  )

  return component
}

describe('GiveawayList', () => {
  it('matches snapshot', async () => {
    let root

    await act(async () => {
      root = create(getComponent())
    })
    expect(root.toJSON()).toMatchSnapshot()
  })

  it('contains giveaway cards', async () => {
    await act(async () => {
      render(getComponent())
    })
    const items = screen.getAllByTestId('giveaway-card')
    expect(items.length).toBe(2)
  })
})
