import React from 'react'
import renderer from 'react-test-renderer'

import { Providers } from '@ui/providers'
import { GiveawayDetail } from '..'

const getComponent = () => {
  const component = (
    <Providers>
      <GiveawayDetail id={1} />
    </Providers>
  )

  return component
}

describe('GiveawayDetail', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(getComponent()).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
