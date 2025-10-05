'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/layout/Footer'
import { Briefcase, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSession } from '@/lib/session-provider'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const { update } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Account created successfully! Logging you in...')
        
        // Automatically log in the user after successful registration
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          })

          const loginData = await loginResponse.json()

          if (loginResponse.ok) {
            toast.success('Welcome! You are now logged in.')
            console.log('Auto-login successful:', loginData.user)
            
            // Update session state
            await update()
            
            // Small delay to ensure session is updated
            setTimeout(() => {
              // Redirect to dashboard based on user role
              if (loginData.user?.role === 'ADMIN') {
                router.push('/admin/dashboard')
              } else {
                router.push('/dashboard')
              }
            }, 100)
          } else {
            // If auto-login fails, redirect to signin page
            toast.error('Account created but auto-login failed. Please sign in manually.')
            router.push('/auth/signin')
          }
        } catch (loginError) {
          console.error('Auto-login error:', loginError)
          toast.error('Account created but auto-login failed. Please sign in manually.')
          router.push('/auth/signin')
        }
      } else {
        console.error('Registration failed:', data)
        toast.error(data.error || 'Registration failed')
        if (data.details) {
          console.error('Error details:', data.details)
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error. Please check your connection and try again.')
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

  const isPasswordValid = formData.password.length >= 6
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

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
            <Link href="/auth/signin" className="text-orange-400 hover:text-orange-300">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-gray-300">
              Join FreelanceHub and start your journey
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Create a password"
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
                {formData.password && (
                  <div className="mt-1 text-xs text-gray-400">
                    {isPasswordValid ? (
                      <span className="text-green-400 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Password is strong
                      </span>
                    ) : (
                      <span>Password must be at least 6 characters</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-1 text-xs">
                    {doPasswordsMatch ? (
                      <span className="text-green-400 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passwords match
                      </span>
                    ) : (
                      <span className="text-red-400">Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-orange-400 hover:text-orange-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-400 hover:text-orange-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              loading={loading}
              disabled={loading || !agreedToTerms || !isPasswordValid || !doPasswordsMatch}
            >
              Create Account
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-300">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-orange-400 hover:text-orange-300 font-medium">
                  Sign in
                </Link>
              </span>
            </div>
          </form>

          {/* Benefits */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
            <h3 className="text-sm font-medium text-white mb-3">Why join FreelanceHub?</h3>
            <div className="text-xs text-gray-300 space-y-2">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                Access to premium digital products
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                Connect with talented freelancers
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                Secure payment processing
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                24/7 customer support
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
