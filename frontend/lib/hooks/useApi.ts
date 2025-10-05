import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '../api-client'

export function useApi<T>(url: string, options?: { 
  requireAuth?: boolean,
  autoFetch?: boolean 
}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  
  const { requireAuth = true, autoFetch = true } = options || {}

  const fetchData = async () => {
    if (requireAuth && status === 'unauthenticated') {
      setError('Authentication required')
      return
    }

    if (requireAuth && status === 'loading') {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.get(url)
      
      if (result.error) {
        if (result.status === 401) {
          setError('Please log in to access this data')
        } else {
          setError(result.error)
        }
      } else {
        setData(result)
      }
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [url, session, status])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
