'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, 
  Download, 
  ArrowRight,
  Package,
  CreditCard,
  Calendar,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show success message
    toast.success('Payment successful! Your order has been confirmed.')
    
    // Get order data from session storage first, then URL params
    const storedOrder = sessionStorage.getItem('currentOrder')
    if (storedOrder) {
      try {
        setOrderData(JSON.parse(storedOrder))
        setLoading(false)
      } catch (error) {
        console.error('Error parsing stored order:', error)
      }
    } else {
      const orderId = new URLSearchParams(window.location.search).get('orderId')
      if (orderId) {
        fetchOrderData(orderId)
      } else {
        setLoading(false)
      }
    }
  }, [])

  const fetchOrderData = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderData(data.order)
      }
    } catch (error) {
      console.error('Error fetching order data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      if (!orderData) {
        toast.error('Order data not available')
        return
      }

      // Create download link for the product
      const downloadUrl = `/api/products/${orderData.project.id}/download`
      
      // Trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${orderData.project.title}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed. Please try again.')
    }
  }

  const handleViewOrders = () => {
    // Clear the current order from session storage
    sessionStorage.removeItem('currentOrder')
    router.push('/dashboard?tab=orders')
  }

  const handleContinueShopping = () => {
    router.push('/dashboard?tab=products')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and you will receive a confirmation email shortly.
          </p>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Confirmation</h2>
              
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ) : orderData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-2" />
                      <span>Order ID: #{orderData.id.slice(-8)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Order Date: {new Date(orderData.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Payment Method: {orderData.paymentMethod}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>Confirmation sent to your email</span>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">{orderData.project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{orderData.project.category}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(orderData.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Order details not available</p>
                </div>
              )}

              {/* Total Amount */}
              {orderData && (
                <div className="border-t pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(orderData.totalAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Product
            </Button>
            
            <Button
              onClick={handleViewOrders}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3"
            >
              View My Orders
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Continue Shopping */}
          <div className="mt-8">
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-3">What's Next?</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• You will receive a confirmation email with your order details</p>
              <p>• Your digital product is available for immediate download</p>
              <p>• Access your order history in your dashboard</p>
              <p>• Contact support if you have any questions</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}