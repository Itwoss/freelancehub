'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { Briefcase, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSession } from '@/lib/session-provider'

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { update } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Attempting login with:', { email: formData.email })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()
      console.log('Login result:', data)

      if (!response.ok) {
        console.error('Login error:', data.error)
        toast.error(data.error || 'Invalid email or password. Please check your credentials.')
      } else {
        toast.success('Welcome back!')
        console.log('User logged in:', data.user)
        
        // Update session state
        console.log('Updating session state...')
        await update()
        console.log('Session state updated')
        
        // Longer delay to ensure session is updated and cookie is set
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          if (data.user?.role === 'ADMIN') {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FreelanceHub</span>
            </Link>
            <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-gray-300">
              Sign in to your account to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-orange-400 hover:text-orange-300">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              loading={loading}
              disabled={loading}
            >
              Sign in
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-300">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 font-medium">
                  Sign up
                </Link>
              </span>
            </div>
          </form>

          {/* Quick Access */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
            <h3 className="text-sm font-medium text-white mb-2">New to FreelanceHub?</h3>
            <div className="text-xs text-gray-300">
              Create your account to access premium digital products, connect with freelancers, and start your journey today.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

