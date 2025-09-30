'use client'

import React, { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function TestLoginPage() {
  const [credentials, setCredentials] = useState({
    email: 'user@freelancehub.com',
    password: 'user123'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🧪 Testing login with:', credentials.email)
      
      const signInResult = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      console.log('🧪 SignIn result:', signInResult)
      setResult(signInResult)

      if (signInResult?.error) {
        toast.error(`Login failed: ${signInResult.error}`)
      } else if (signInResult?.ok) {
        toast.success('Login successful!')
        
        // Get session
        const session = await getSession()
        console.log('🧪 Session:', session)
        setResult({ ...signInResult, session })
      }
    } catch (error) {
      console.error('🧪 Login error:', error)
      toast.error('Login failed')
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Login Test Page</h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <Button
              onClick={handleTestLogin}
              loading={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500"
            >
              Test Login
            </Button>
          </div>
        </div>

        {result && (
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-black/50 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Available Test Users:</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>user@freelancehub.com</strong> / user123 (USER role)</li>
            <li><strong>admin@freelancehub.com</strong> / admin123 (ADMIN role)</li>
            <li><strong>sarah@example.com</strong> / password123 (USER role)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

