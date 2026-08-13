import { useEffect, useState } from 'react'

export function useAdminSession() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setAuthenticated(!!data.authenticated)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { authenticated, loading }
}
