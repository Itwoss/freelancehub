'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, XCircle, Loader, User, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function QuickSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const createAdmin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast.success('Admin user created successfully!')
      } else {
        toast.error(data.error || 'Failed to create admin!')
      }
    } catch (error) {
      console.error('Create admin failed:', error)
      toast.error('Failed to create admin!')
      setResult({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const checkUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-admin')
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast.success('Users retrieved successfully!')
      } else {
        toast.error('Failed to fetch users!')
      }
    } catch (error) {
      console.error('Check users failed:', error)
      toast.error('Failed to check users!')
      setResult({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Quick Setup</h1>
          
          {/* Create Admin */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Create Admin User</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Create an admin user with default credentials.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Default Credentials:</h3>
              <p className="text-yellow-700"><strong>Email:</strong> admin@example.com</p>
              <p className="text-yellow-700"><strong>Password:</strong> admin123</p>
            </div>
            <Button 
              onClick={createAdmin} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Create Admin User'}
            </Button>
          </div>

          {/* Check Users */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Check Existing Users</h2>
            </div>
            <p className="text-gray-600 mb-4">
              See all users currently in the database.
            </p>
            <Button 
              onClick={checkUsers} 
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Check Users'}
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                )}
                Results
              </h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Login Instructions */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Click "Create Admin User" to create the default admin</li>
              <li>Go to <a href="/auth/signin" className="underline">Login Page</a></li>
              <li>Use credentials: <strong>admin@example.com</strong> / <strong>admin123</strong></li>
              <li>You should be redirected to the admin dashboard</li>
            </ol>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
