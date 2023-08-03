import React from 'react'
import renderer from 'react-test-renderer'

import { Providers } from '@ui/providers'
import { Wallet } from '../'

const getComponent = () => {
  const component = (
    <Providers>
      <Wallet />
    </Providers>
  )

  return component
}

describe('Wallet', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
