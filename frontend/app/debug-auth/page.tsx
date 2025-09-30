'use client'

import React, { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'

export default function DebugAuthPage() {
  const [session, setSession] = useState<any>(null)
  const [env, setEnv] = useState<any>({})

  useEffect(() => {
    const checkAuth = async () => {
      const currentSession = await getSession()
      setSession(currentSession)
      
      // Check environment variables (only show public ones)
      setEnv({
        NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'Not set',
      })
    }
    
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Current Session</h2>
            <pre className="text-sm text-gray-300 overflow-auto">
              {session ? JSON.stringify(session, null, 2) : 'No session found'}
            </pre>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Environment</h2>
            <pre className="text-sm text-gray-300 overflow-auto">
              {JSON.stringify(env, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-6 bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Test Credentials</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Admin:</strong> admin@freelancehub.com / admin123</div>
            <div><strong>User:</strong> user@freelancehub.com / user123</div>
            <div><strong>Freelancer:</strong> freelancer@freelancehub.com / freelancer123</div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="/auth/signin" className="text-orange-400 hover:underline">/auth/signin</a></li>
            <li>Try logging in with the test credentials</li>
            <li>Check browser console for any errors</li>
            <li>Check this page to see if session is created</li>
            <li>If login fails, check the network tab for API errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
