'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SetupDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [userForm, setUserForm] = useState({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'USER'
  })

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-user')
      const data = await response.json()
      setTestResult(data)
      
      if (data.success) {
        toast.success('Database connection successful!')
      } else {
        toast.error('Database connection failed!')
      }
    } catch (error) {
      console.error('Test failed:', error)
      toast.error('Test failed!')
      setTestResult({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm)
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('Test user created successfully!')
        setTestResult(data)
      } else {
        toast.error(data.error || 'Failed to create user!')
        setTestResult(data)
      }
    } catch (error) {
      console.error('Create user failed:', error)
      toast.error('Failed to create user!')
      setTestResult({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Setup</h1>
          
          {/* Database Test */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
            <p className="text-gray-600 mb-4">
              Test if your database is properly connected and accessible.
            </p>
            <Button 
              onClick={testDatabase} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Test Database'}
            </Button>
          </div>

          {/* Create Test User */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Test User</h2>
            <p className="text-gray-600 mb-4">
              Create a test user to verify authentication works.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={createTestUser} 
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Create Test User'}
            </Button>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {testResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                )}
                Test Results
              </h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Test the database connection first</li>
              <li>Create a test user with the form above</li>
              <li>Try logging in with the test user credentials</li>
              <li>If login works, you can create more users or use the admin panel</li>
            </ol>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
