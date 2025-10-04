'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ShoppingCart, Download, Eye, CheckCircle, Clock, XCircle, Package } from 'lucide-react'

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  project: {
    id: string
    title: string
    price: number
    category?: string
    image?: string
  }
  user?: {
    name: string
    email: string
    phone?: string
  }
}

export default function TestDashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try the test API first
      const response = await fetch('/api/test-orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
        console.log('✅ Orders fetched from test API:', data.orders?.length || 0)
      } else {
        throw new Error(`API Error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError(error.message)
      
      // Fallback to sample orders
      setOrders([
        {
          id: '1',
          totalAmount: 1999,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          project: {
            id: '1',
            title: 'Premium Web Template',
            price: 1999,
            category: 'Web Development',
            image: '/placeholder-image.jpg'
          },
          user: {
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+1234567890'
          }
        },
        {
          id: '2',
          totalAmount: 2999,
          status: 'PENDING',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          project: {
            id: '2',
            title: 'Mobile App Design',
            price: 2999,
            category: 'Mobile App',
            image: '/placeholder-image.jpg'
          },
          user: {
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+1234567890'
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDownload = async (order: Order) => {
    try {
      console.log('Downloading order:', order.id)
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Dashboard Orders</h1>
          <p className="text-gray-600">Testing orders display with proper error handling</p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">⚠️ API Error: {error}</p>
              <p className="text-yellow-700 text-sm">Showing sample data instead.</p>
            </div>
          )}
        </div>

        {orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Orders ({orders.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={order.project?.image || '/placeholder-image.jpg'}
                            alt={order.project?.title || 'Product'}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.project?.title || 'Unknown Product'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.project?.category || 'General'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" title="View Order Details">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === 'COMPLETED' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownload(order)}
                              title="Download Product"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">There are no orders to display.</p>
          </div>
        )}

        <div className="mt-8 flex space-x-4">
          <Button onClick={fetchOrders} className="bg-orange-500 hover:bg-orange-600">
            Refresh Orders
          </Button>
          <Button 
            onClick={() => window.location.href = '/dashboard?tab=orders'} 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
