'use client'

import React, { useState } from 'react'

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      console.log('Testing API...')
      
      // Test simple GET
      const getResponse = await fetch('/api/test')
      const getData = await getResponse.json()
      console.log('GET response:', getData)
      
      // Test POST
      const postResponse = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' })
      })
      const postData = await postResponse.json()
      console.log('POST response:', postData)
      
      // Test register
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        })
      })
      const registerData = await registerResponse.json()
      console.log('Register response:', registerData)
      
      setResult({
        get: getData,
        post: postData,
        register: registerData
      })
    } catch (error) {
      console.error('API test error:', error)
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Results:</h2>
            <pre className="bg-gray-200 p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
