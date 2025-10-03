'use client'

import { useState } from 'react'

export default function SimpleTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('Testing API...')
      
      const response = await fetch('/api/admin/razorpay-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyId: 'rzp_live_ROrn7ahgdd5X2d',
          keySecret: 'u8DBqFba66vdYLTLYXr0yDAh'
        })
      })

      console.log('Response status:', response.status)
      
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🧪 Simple API Test</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
