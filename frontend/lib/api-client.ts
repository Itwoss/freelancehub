import { getSession } from 'next-auth/react'

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  }

  private async getHeaders(): Promise<HeadersInit> {
    const session = await getSession()
    
    return {
      'Content-Type': 'application/json',
      ...(session?.user && { 'Authorization': `Bearer ${session.user.id}` })
    }
  }

  async get(url: string, options?: RequestInit) {
    try {
      const headers = await this.getHeaders()
      
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'GET',
        headers,
        ...options
      })

      if (response.status === 401) {
        // Handle authentication error
        console.warn('Authentication required for:', url)
        return { error: 'Authentication required', status: 401 }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.error || 'Request failed', status: response.status }
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error', status: 0 }
    }
  }

  async post(url: string, data?: any, options?: RequestInit) {
    try {
      const headers = await this.getHeaders()
      
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options
      })

      if (response.status === 401) {
        console.warn('Authentication required for:', url)
        return { error: 'Authentication required', status: 401 }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.error || 'Request failed', status: response.status }
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error', status: 0 }
    }
  }

  async put(url: string, data?: any, options?: RequestInit) {
    try {
      const headers = await this.getHeaders()
      
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options
      })

      if (response.status === 401) {
        console.warn('Authentication required for:', url)
        return { error: 'Authentication required', status: 401 }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.error || 'Request failed', status: response.status }
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error', status: 0 }
    }
  }

  async delete(url: string, options?: RequestInit) {
    try {
      const headers = await this.getHeaders()
      
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
        headers,
        ...options
      })

      if (response.status === 401) {
        console.warn('Authentication required for:', url)
        return { error: 'Authentication required', status: 401 }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.error || 'Request failed', status: response.status }
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error', status: 0 }
    }
  }
}

export const apiClient = new ApiClient()
