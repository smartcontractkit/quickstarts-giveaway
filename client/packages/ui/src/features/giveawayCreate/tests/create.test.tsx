import React from 'react'
// import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import { Providers } from '@ui/providers'
import { GiveawayCreate } from '..'

const getComponent = () => {
  const component = (
    <Providers>
      <GiveawayCreate />
    </Providers>
  )

  return component
}

describe('GiveawayCreate', () => {
  // it('matches snapshot', () => {
  //   const tree = renderer.create(getComponent()).toJSON()

  //   expect(tree).toMatchSnapshot()
  // })

  it('renders static form', () => {
    render(getComponent())

    const span = screen.queryByText('Drop CSV file here or click to upload')
    expect(span).toBeTruthy()
  })

  // it('renders dynamic form', () => {
  //   const { getByTestId } = render(getComponent())

  //   userEvent.selectOptions(getByTestId('select-type'), ['2'])

  //   // Note: if this test fails on CI, increase timeout
  //   setTimeout(() => {
  //     const span = screen.queryByText('Duration (hours)')
  //     expect(span).toBeTruthy()
  //   }, 300)
  // })
})
