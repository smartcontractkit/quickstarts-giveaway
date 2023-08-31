import { useState, useEffect } from 'react'

export const useStore = (initialState) => {
  const [state, setState] = useState(initialState)

  const reset = () => setState(initialState)

  const update = (next) => {
    setState({
      ...state,
      ...next
    })
  }

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return { state, update, reset }
}
