'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function DebugAuthPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    setDebugInfo({
      session,
      status,
      user: session?.user,
      role: session?.user?.role,
      timestamp: new Date().toISOString()
    })
  }, [session, status])

  const handleRedirect = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Auth Debug Page</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Session Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {session?.user?.id || 'N/A'}</p>
              <p><strong>User Name:</strong> {session?.user?.name || 'N/A'}</p>
              <p><strong>User Email:</strong> {session?.user?.email || 'N/A'}</p>
              <p><strong>User Role:</strong> {session?.user?.role || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
            <div className="space-x-4">
              <Button onClick={() => handleRedirect('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button onClick={() => handleRedirect('/admin/dashboard')}>
                Go to Admin Dashboard
              </Button>
              <Button onClick={() => handleRedirect('/')}>
                Go to Home
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Current URL Info</h2>
            <div className="space-y-2">
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
              <p><strong>Search:</strong> {typeof window !== 'undefined' ? window.location.search : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}