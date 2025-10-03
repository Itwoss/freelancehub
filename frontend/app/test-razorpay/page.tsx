'use client'

import { useState } from 'react'

export default function TestRazorpayPage() {
  const [keyId, setKeyId] = useState('')
  const [keySecret, setKeySecret] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    if (!keyId || !keySecret) {
      setResult({ error: 'Please enter both Key ID and Key Secret' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      console.log('Testing with credentials:', { keyId, keySecret: '***' })
      
      const requestBody = {
        keyId,
        keySecret
      }
      
      console.log('Request body:', requestBody)
      
      const response = await fetch('/api/admin/razorpay-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        setResult({ 
          error: `HTTP ${response.status}: ${response.statusText}`, 
          details: errorText 
        })
        return
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      setResult(data)
    } catch (error) {
      console.error('Test error:', error)
      setResult({ 
        error: 'Network error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧪 Razorpay Connection Test</h1>
          <p className="mt-2 text-gray-600">Test your Razorpay credentials</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razorpay Key ID
            </label>
            <input
              type="text"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="rzp_live_xxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Should start with rzp_live_ or rzp_test_ and be 24+ characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razorpay Key Secret
            </label>
            <input
              type="password"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Should be 32+ characters long
            </p>
          </div>

          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Your credentials: <br/>
              Key ID: <code className="bg-gray-100 px-1 rounded">{keyId || 'Not entered'}</code><br/>
              Key Secret: <code className="bg-gray-100 px-1 rounded">{keySecret ? '***' + keySecret.slice(-4) : 'Not entered'}</code>
            </p>
          </div>

          {result && (
            <div className={`p-4 rounded-md ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-red-400">❌</span>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Connection Successful!' : 'Connection Failed'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || result.error}
                    {result.details && (
                      <div className="mt-1">
                        <strong>Details:</strong> {result.details}
                      </div>
                    )}
                    {result.orderId && (
                      <div className="mt-1">
                        <strong>Test Order ID:</strong> {result.orderId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">📋 How to Get Valid Credentials:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Go to <a href="https://dashboard.razorpay.com/" target="_blank" className="underline">Razorpay Dashboard</a></li>
              <li>2. Sign in to your account</li>
              <li>3. Go to Settings → API Keys</li>
              <li>4. Copy your Key ID and Key Secret</li>
              <li>5. Use test credentials first (rzp_test_...)</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ Common Issues:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Key ID too short (should be 24+ characters)</li>
              <li>• Key Secret too short (should be 32+ characters)</li>
              <li>• Using live credentials in test mode</li>
              <li>• Wrong environment (test vs live)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
