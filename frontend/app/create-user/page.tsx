'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, XCircle, Loader, User, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [userForm, setUserForm] = useState({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'USER'
  })

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast.success('Database connected successfully!')
      } else {
        toast.error('Database connection failed!')
      }
    } catch (error) {
      console.error('Database test failed:', error)
      toast.error('Database test failed!')
      setResult({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm)
      })
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast.success('User created successfully!')
      } else {
        toast.error(data.error || 'Failed to create user!')
      }
    } catch (error) {
      console.error('Create user failed:', error)
      toast.error('Failed to create user!')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create User for Testing</h1>
          
          {/* Database Test */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Test Database Connection</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Check if your database is connected and see existing users.
            </p>
            <Button 
              onClick={testDatabase} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Test Database'}
            </Button>
          </div>

          {/* Create User */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">Create Test User</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Create a user to test login functionality.
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
              onClick={createUser} 
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Create User'}
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
              <li>Test the database connection first</li>
              <li>Create a user with the form above</li>
              <li>Go to <a href="/auth/signin" className="underline">Login Page</a></li>
              <li>Use the credentials you just created</li>
              <li>You should be able to login successfully</li>
            </ol>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
