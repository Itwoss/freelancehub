'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Shield, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { data: session, status, signOut } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('User role:', session.user.role) // Debug log
      if (session.user.role === 'ADMIN') {
        // Only redirect to admin dashboard, don't redirect elsewhere
        router.push('/admin/dashboard')
      } else {
        // If user is not admin, show error but don't redirect
        setError('Access denied. Admin privileges required.')
        toast.error('Admin access required')
        // Don't redirect, let them try again
      }
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting admin login with:', { email })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('Login result:', data)

      if (!response.ok) {
        console.error('Login error:', data.error)
        setError(data.error || 'Invalid credentials')
        toast.error(data.error || 'Invalid credentials')
      } else {
        // Check if user is admin
        if (data.user?.role !== 'ADMIN') {
          setError('Access denied. Admin privileges required.')
          toast.error('Access denied. Admin privileges required.')
          return
        }
        
        console.log('Admin login successful:', data.user)
        toast.success('Welcome, Admin!')
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('An unexpected error occurred')
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Admin Login Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-600">
              Secure access to platform administration
            </p>
          </div>

          {/* Login Form */}
          <div className="card">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Admin Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="sjay9327@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Admin Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Access Admin Dashboard
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Admin Credentials</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Email:</strong> sjay9327@gmail.com</p>
                  <p><strong>Password:</strong> sanjay1234</p>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs text-blue-600">Alternative: admin@freelancehub.com / admin123</p>
                </div>
              </div>

              {/* Current User Status */}
              {status === 'authenticated' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    You are currently logged in as: <strong>{session?.user?.name}</strong> ({session?.user?.role})
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="w-full"
                  >
                    Sign Out Current User
                  </Button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="mt-6 text-center">
                <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-primary-600">
                  Regular User Login
                </Link>
                <span className="mx-2 text-gray-300">•</span>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary-600">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 This is a secure admin portal. All activities are logged and monitored.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
