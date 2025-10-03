'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { CheckCircle, ArrowLeft, Download, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string>('')
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const paymentIdParam = searchParams.get('paymentId')
    if (paymentIdParam) {
      setPaymentId(paymentIdParam)
    }

    // Get order details from sessionStorage
    const storedOrder = sessionStorage.getItem('prebookOrder')
    if (storedOrder) {
      try {
        const orderData = JSON.parse(storedOrder)
        setOrderDetails(orderData)
        // Clear the stored order after successful payment
        sessionStorage.removeItem('prebookOrder')
      } catch (error) {
        console.error('Error parsing order details:', error)
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-300">
              Your payment has been processed successfully.
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="text-white font-mono">{paymentId}</span>
                </div>
              )}
              {orderDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Product:</span>
                    <span className="text-white">{orderDetails.productTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">
                      {orderDetails.currency === 'INR' ? '₹' : '$'}{orderDetails.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Customer:</span>
                    <span className="text-white">{orderDetails.userDetails?.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/products')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </div>
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => window.print()}
                className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Print Receipt
                </div>
              </Button>

              <Button
                onClick={() => {
                  const subject = `Payment Receipt - ${orderDetails?.productTitle || 'Product'}`;
                  const body = `Payment ID: ${paymentId}\nProduct: ${orderDetails?.productTitle || 'Product'}\nAmount: ${orderDetails?.currency === 'INR' ? '₹' : '$'}${orderDetails?.amount}`;
                  window.location.href = `mailto:${orderDetails?.userDetails?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Receipt
                </div>
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <h4 className="text-blue-400 font-semibold mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Your order will be processed within 24 hours</li>
              <li>• Check your dashboard for order updates</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
