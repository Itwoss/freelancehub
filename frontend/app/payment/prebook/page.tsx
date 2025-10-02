'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

interface PaymentDetails {
  orderId: string
  amount: number
  currency: string
  productTitle: string
  userDetails: any
}

export default function PrebookPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'card' | 'upi'>('razorpay')

  useEffect(() => {
    // Get payment details from URL params
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency')

    if (orderId && amount && currency) {
      setPaymentDetails({
        orderId,
        amount: parseFloat(amount),
        currency,
        productTitle: 'Website Prebook',
        userDetails: {} // This would come from the previous step
      })
    }
    setLoading(false)
  }, [searchParams])

  const getCurrencySymbol = () => {
    return paymentDetails?.currency === 'INR' ? '₹' : '$'
  }

  const handleRazorpayPayment = async () => {
    setPaymentStatus('processing')
    
    try {
      // Razorpay Payment Integration
      const razorpayConfig = {
        amount: paymentDetails?.amount ? paymentDetails.amount * 100 : 10000, // Amount in paise
        currency: paymentDetails?.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
        productTitle: paymentDetails?.productTitle || 'Website Prebook',
        userDetails: paymentDetails?.userDetails || {}
      }

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
        // Redirect to Razorpay payment page
        window.location.href = data.paymentUrl
      } else {
        setPaymentStatus('failed')
      }
    } catch (error) {
      console.error('Razorpay payment error:', error)
      setPaymentStatus('failed')
    }
  }

  const handleCardPayment = async () => {
    setPaymentStatus('processing')
    // Implement card payment logic here
    setTimeout(() => {
      setPaymentStatus('success')
    }, 3000)
  }

  const handleUPIPayment = async () => {
    setPaymentStatus('processing')
    // Implement UPI payment logic here
    setTimeout(() => {
      setPaymentStatus('success')
    }, 3000)
  }

  const handlePayment = () => {
    switch (selectedPaymentMethod) {
      case 'razorpay':
        handleRazorpayPayment()
        break
      case 'card':
        handleCardPayment()
        break
      case 'upi':
        handleUPIPayment()
        break
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Invalid Payment Request</h1>
          <Link href="/products" className="text-purple-400 hover:text-purple-300">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-purple-200 mb-8">
              Your prebook has been confirmed. You'll receive a confirmation email shortly.
            </p>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-700/50 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-purple-200">Order ID:</span>
                  <span className="text-white">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Amount:</span>
                  <span className="text-white">{getCurrencySymbol()}{paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Status:</span>
                  <span className="text-green-400">Confirmed</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 px-8 py-3 rounded-xl">
                  Browse More
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
            <p className="text-xl text-purple-200 mb-8">
              There was an issue processing your payment. Please try again.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setPaymentStatus('pending')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl"
              >
                Try Again
              </Button>
              <Link href="/products">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 px-8 py-3 rounded-xl">
                  Back to Products
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
              <h1 className="text-3xl font-bold text-white mb-6">Complete Your Prebook</h1>
              
              {/* Order Summary */}
              <div className="bg-white/10 rounded-lg p-4 mb-6 border border-purple-500/30">
                <h2 className="text-lg font-bold text-white mb-3">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Product:</span>
                    <span className="text-white">{paymentDetails.productTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Amount:</span>
                    <span className="text-white font-bold">{getCurrencySymbol()}{paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Order ID:</span>
                    <span className="text-white font-mono text-sm">{paymentDetails.orderId}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-bold text-white">Select Payment Method</h3>
                
                {/* Razorpay */}
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'razorpay' 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : 'border-purple-500/50 hover:border-purple-400'
                  }`}
                  onClick={() => setSelectedPaymentMethod('razorpay')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Razorpay</h4>
                      <p className="text-sm text-purple-200">Pay with UPI, cards, wallets & more</p>
                    </div>
                  </div>
                </div>

                {/* Credit/Debit Card */}
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'card' 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : 'border-purple-500/50 hover:border-purple-400'
                  }`}
                  onClick={() => setSelectedPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Credit/Debit Card</h4>
                      <p className="text-sm text-purple-200">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                </div>

                {/* UPI */}
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPaymentMethod === 'upi' 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : 'border-purple-500/50 hover:border-purple-400'
                  }`}
                  onClick={() => setSelectedPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">UPI</h4>
                      <p className="text-sm text-purple-200">Google Pay, Paytm, BHIM, PhonePe</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={paymentStatus === 'processing'}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
              >
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pay {getCurrencySymbol()}{paymentDetails.amount}
                  </div>
                )}
              </Button>
            </div>

            {/* Payment Info */}
            <div className="space-y-6">
              {/* Security Info */}
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Secure Payment</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-purple-200">256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-purple-200">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-purple-200">Secure payment gateway</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-purple-200">Money-back guarantee</span>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span className="text-purple-200">Priority access to the platform</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-yellow-400" />
                    <span className="text-purple-200">Personal account setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <span className="text-purple-200">Email notifications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-yellow-400" />
                    <span className="text-purple-200">24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
