'use client'

import React, { useState } from 'react'
import { signIn, getSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      console.log('Attempting login with:', { email, password })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('Login result:', result)

      if (result?.error) {
        alert(`Login failed: ${result.error}`)
      } else {
        alert('Login successful!')
        const newSession = await getSession()
        setSession(newSession)
        console.log('Session:', newSession)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert(`Login error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setSession(null)
  }

  const checkSession = async () => {
    const currentSession = await getSession()
    setSession(currentSession)
    console.log('Current session:', currentSession)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Login Test Page</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@freelancehub.com"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <Button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading ? 'Logging in...' : 'Test Login'}
          </Button>
          
          <Button 
            onClick={checkSession}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Check Session
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-700 text-red-300 hover:bg-red-800"
          >
            Logout
          </Button>
        </div>

        {session && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Current Session:</h3>
            <pre className="text-xs text-gray-300 overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
          <h3 className="font-bold mb-2">Test Credentials:</h3>
          <div className="text-sm space-y-1">
            <div><strong>Admin:</strong> admin@freelancehub.com / admin123</div>
            <div><strong>User:</strong> user@freelancehub.com / user123</div>
            <div><strong>Freelancer:</strong> freelancer@freelancehub.com / freelancer123</div>
          </div>
        </div>
      </div>
    </div>
  )
}