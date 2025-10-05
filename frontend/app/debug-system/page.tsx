'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, XCircle, Loader, Database, User, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DebugSystemPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setResults(prev => ({ ...prev, database: data }))
      
      if (data.success) {
        toast.success('Database test successful!')
      } else {
        toast.error('Database test failed!')
      }
    } catch (error) {
      console.error('Database test failed:', error)
      toast.error('Database test failed!')
      setResults(prev => ({ ...prev, database: { success: false, error: 'Network error' } }))
    } finally {
      setLoading(false)
    }
  }

  const testRegister = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-register')
      const data = await response.json()
      setResults(prev => ({ ...prev, register: data }))
      
      if (data.success) {
        toast.success('Registration system test successful!')
      } else {
        toast.error('Registration system test failed!')
      }
    } catch (error) {
      console.error('Registration test failed:', error)
      toast.error('Registration test failed!')
      setResults(prev => ({ ...prev, register: { success: false, error: 'Network error' } }))
    } finally {
      setLoading(false)
    }
  }

  const testMiniOffice = async () => {
    setLoading(true)
    try {
      const response = await fetch('/mini-office')
      setResults(prev => ({ 
        ...prev, 
        miniOffice: { 
          success: response.ok, 
          status: response.status,
          statusText: response.statusText
        } 
      }))
      
      if (response.ok) {
        toast.success('Mini-office page accessible!')
      } else {
        toast.error(`Mini-office page error: ${response.status}`)
      }
    } catch (error) {
      console.error('Mini-office test failed:', error)
      toast.error('Mini-office test failed!')
      setResults(prev => ({ ...prev, miniOffice: { success: false, error: 'Network error' } }))
    } finally {
      setLoading(false)
    }
  }

  const testAll = async () => {
    setLoading(true)
    setResults({})
    
    await testDatabase()
    await testRegister()
    await testMiniOffice()
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">System Debug</h1>
          
          {/* Test All */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Settings className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Run All Tests</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Test all system components at once.
            </p>
            <Button 
              onClick={testAll} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Test All Systems'}
            </Button>
          </div>

          {/* Individual Tests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Database Test */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold">Database Test</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Test database connection and user data.
              </p>
              <Button 
                onClick={testDatabase} 
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Test Database'}
              </Button>
            </div>

            {/* Registration Test */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold">Registration Test</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Test user registration system.
              </p>
              <Button 
                onClick={testRegister} 
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Test Registration'}
              </Button>
            </div>

            {/* Mini-Office Test */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-orange-500 mr-2" />
                <h3 className="text-lg font-semibold">Mini-Office Test</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Test mini-office page accessibility.
              </p>
              <Button 
                onClick={testMiniOffice} 
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Test Mini-Office'}
              </Button>
            </div>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              <div className="space-y-4">
                {Object.entries(results).map(([key, result]: [string, any]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      )}
                      <h3 className="font-semibold capitalize">{key} Test</h3>
                    </div>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div>
                <h4 className="font-medium mb-2">If Database Test Fails:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Check MONGODB_URI environment variable</li>
                  <li>• Verify MongoDB Atlas connection</li>
                  <li>• Check network access in Atlas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">If Registration Test Fails:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Check NEXTAUTH_SECRET environment variable</li>
                  <li>• Verify database schema</li>
                  <li>• Check Prisma configuration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
