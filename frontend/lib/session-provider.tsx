'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface Session {
  user: User | null
}

interface SessionContextType {
  data: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  update: () => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  const update = async () => {
    try {
      console.log('SessionProvider: Updating session...')
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      console.log('SessionProvider: Session API response:', data)
      
      if (data.user) {
        console.log('SessionProvider: User found, setting authenticated status')
        setSession({ user: data.user })
        setStatus('authenticated')
      } else {
        console.log('SessionProvider: No user found, setting unauthenticated status')
        setSession(null)
        setStatus('unauthenticated')
      }
    } catch (error) {
      console.error('SessionProvider: Session update error:', error)
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) {
        setSession(null)
        setStatus('unauthenticated')
        console.log('✅ User signed out successfully')
      } else {
        console.error('❌ Sign out failed:', response.status)
      }
    } catch (error) {
      console.error('❌ Sign out error:', error)
      // Still clear the session even if the API call fails
      setSession(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    update()
  }, [])

  return (
    <SessionContext.Provider value={{ data: session, status, update, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
