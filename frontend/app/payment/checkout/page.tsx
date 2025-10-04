'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  CreditCard, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderData {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
    phone: string
  }
  project: {
    id: string
    title: string
    price: number
    category: string
    image: string
  }
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    } else {
      router.push('/dashboard')
    }
  }, [orderId, router])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        toast.error('Order not found')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!order) return

    try {
      setProcessing(true)
      
      // Create Razorpay order
      const response = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: order.totalAmount * 100, // Convert to paise
          currency: 'INR',
          orderId: order.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment order')
      }

      const { orderId: razorpayOrderId, amount, currency, keyId } = await response.json()

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: 'FreelanceHub',
          description: `Payment for ${order.project.title}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verifyResponse = await fetch('/api/payment/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order.id
                })
              })

              if (verifyResponse.ok) {
                toast.success('Payment successful!')
                router.push('/payment/success')
              } else {
                toast.error('Payment verification failed')
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              toast.error('Payment verification failed')
            }
          },
          prefill: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
            contact: order.user.phone || ''
          },
          notes: {
            order_id: order.id,
            product: order.project.title
          },
          theme: {
            color: '#f97316'
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
      script.onerror = () => {
        toast.error('Failed to load payment gateway')
        setProcessing(false)
      }
      document.body.appendChild(script)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Product Details */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={order.project.image || '/placeholder-image.jpg'}
                alt={order.project.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{order.project.title}</h3>
                <p className="text-sm text-gray-600">{order.project.category}</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.project.price)}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Price</span>
                <span className="text-gray-900">{formatCurrency(order.project.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee</span>
                <span className="text-gray-900">₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₹0</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Secure payment processing
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Lock className="w-4 h-4 mr-2 text-green-600" />
                SSL encrypted connection
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Money-back guarantee
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {/* Customer Information */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {order.user.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {order.user.phone || 'Not provided'}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <div>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Razorpay</div>
                    <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Information */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-gray-900">#{order.id.slice(-8)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-medium"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay {formatCurrency(order.totalAmount)}
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
