'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { CreditCard, Loader, CheckCircle, AlertCircle, Shield } from 'lucide-react'

interface RazorpayPaymentProps {
  amount: number
  currency: string
  productTitle: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  onSuccess: (paymentId: string) => void
  onFailure: (error: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayPayment({
  amount,
  currency,
  productTitle,
  userDetails,
  onSuccess,
  onFailure
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // Create order
      const orderResponse = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: `receipt_${Date.now()}`,
          productTitle,
          userDetails
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Configure Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Company Name',
        description: productTitle,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        notes: {
          product_title: productTitle,
          user_name: userDetails.name,
          user_email: userDetails.email
        },
        theme: {
          color: '#6366f1'
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              onSuccess(response.razorpay_payment_id)
            } else {
              onFailure(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            onFailure('Payment verification failed')
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed')
      onFailure(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-red-400">Payment Error</h3>
          </div>
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Secure Payment</h3>
            <p className="text-blue-200">Powered by Razorpay</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-blue-200">Amount:</span>
            <span className="text-white font-bold">
              {currency === 'INR' ? '₹' : '$'}{amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Product:</span>
            <span className="text-white">{productTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Payment Methods:</span>
            <span className="text-white text-sm">UPI, Cards, Wallets, Net Banking</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pay with Razorpay
            </div>
          )}
        </Button>

        <div className="mt-4 text-center">
          <p className="text-blue-200 text-sm">
            🔒 Your payment is secure and encrypted
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>PCI DSS Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Instant Verification</span>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  )
}
