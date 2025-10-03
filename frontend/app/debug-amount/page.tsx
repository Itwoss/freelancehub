'use client'

import { useEffect, useState } from 'react'

export default function DebugAmountPage() {
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('prebookOrder')
    if (storedOrder) {
      try {
        const orderData = JSON.parse(storedOrder)
        setSessionData(orderData)
      } catch (error) {
        console.error('Error parsing session data:', error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Amount</h1>
      
      {sessionData ? (
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Session Storage Data:</h2>
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
          
          <div className="mt-4 p-4 bg-blue-900 rounded">
            <h3 className="font-semibold mb-2">Key Values:</h3>
            <p><strong>Amount:</strong> {sessionData.amount}</p>
            <p><strong>Currency:</strong> {sessionData.currency}</p>
            <p><strong>Product Title:</strong> {sessionData.productTitle}</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-900 p-6 rounded-lg">
          <p>No session data found. Please go to a product page and click "PREBOOK - ₹1" first.</p>
        </div>
      )}
      
      <div className="mt-6">
        <a href="/products" className="text-blue-400 hover:text-blue-300">
          ← Go to Products
        </a>
      </div>
    </div>
  )
}
