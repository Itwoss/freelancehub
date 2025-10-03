'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false)

  const handleRazorpayPayment = async () => {
    setLoading(true)
    
    try {
      // Test Razorpay payment
      const razorpayConfig = {
        amount: 10000, // ₹100 in paise
        currency: 'INR',
        receipt: `test_receipt_${Date.now()}`,
        productTitle: 'Test Product',
        userDetails: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '9876543210'
        }
      }

      console.log('Creating Razorpay order...')
      
      // Create Razorpay order
      const response = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(razorpayConfig)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Razorpay order created:', data)
        
        // Initialize Razorpay checkout
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'FreelanceHub',
          description: 'Test Product Purchase',
          order_id: data.orderId,
          handler: function (response: any) {
            console.log('Payment successful:', response)
            toast.success('Payment successful!')
            alert('Payment successful! Payment ID: ' + response.razorpay_payment_id)
          },
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9876543210'
          },
          notes: {
            product_title: 'Test Product'
          },
          theme: {
            color: '#f97316'
          }
        }

        // Load Razorpay script and open checkout
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
        document.body.appendChild(script)
      } else {
        const errorData = await response.json()
        console.error('Payment failed:', errorData)
        toast.error('Payment failed: ' + errorData.error)
      }
    } catch (error) {
      console.error('Razorpay payment error:', error)
      toast.error('Payment error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">🧪 Test Razorpay Payment</h1>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Payment Details:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Amount: ₹100</li>
              <li>• Currency: INR</li>
              <li>• Product: Test Product</li>
              <li>• User: Test User</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={handleRazorpayPayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating Order...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Test Razorpay Payment
            </div>
          )}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            This will open the Razorpay payment modal
          </p>
        </div>
      </div>
    </div>
  )
}
