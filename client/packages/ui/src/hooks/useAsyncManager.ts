import { useState, useEffect } from 'react'

export const initialAsyncState = {
  loading: false,
  pending: false,
  error: null
}

export const useAsyncManager = () => {
  const [loading, setLoading] = useState(initialAsyncState.loading)
  const [pending, setPending] = useState(initialAsyncState.pending)
  const [error, setError] = useState(initialAsyncState.error)

  const start = () => {
    setError(initialAsyncState.error)
    setLoading(true)
  }

  const waiting = () => {
    setLoading(initialAsyncState.loading)
    setPending(true)
  }

  const success = () => {
    setLoading(initialAsyncState.loading)
    setPending(initialAsyncState.pending)
  }

  const fail = (message) => {
    setLoading(initialAsyncState.loading)
    setPending(initialAsyncState.pending)
    setError(message)
  }

  const reset = () => {
    setLoading(initialAsyncState.loading)
    setPending(initialAsyncState.pending)
    setError(initialAsyncState.error)
  }

  const componentDidUnmount = () => reset()
  useEffect(componentDidUnmount, [])

  return {
    loading,
    pending,
    error,
    start,
    waiting,
    success,
    fail,
    reset
  }
}
