'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Package,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function UserOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchOrders()
  }, [status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // Fetch both orders and prebookings
      const [ordersResponse, prebookingsResponse] = await Promise.all([
        fetch('/api/orders', { credentials: 'include' }),
        fetch('/api/prebookings', { credentials: 'include' })
      ])
      
      const allOrders: Order[] = []
      
      // Process regular orders
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.orders) {
          allOrders.push(...ordersData.orders.map((order: any) => ({
            id: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            project: {
              id: order.project?.id || order.projectId,
              title: order.project?.title || 'Unknown Product',
              price: order.project?.price || order.totalAmount,
              category: order.project?.category || 'General',
              image: order.project?.image || '/placeholder-image.jpg'
            }
          })))
        }
      }
      
      // Process prebookings
      if (prebookingsResponse.ok) {
        const prebookingsData = await prebookingsResponse.json()
        if (prebookingsData.prebookings) {
          allOrders.push(...prebookingsData.prebookings.map((prebooking: any) => ({
            id: prebooking.id,
            totalAmount: prebooking.amount,
            status: prebooking.status,
            createdAt: prebooking.createdAt,
            project: {
              id: prebooking.productId,
              title: prebooking.productTitle,
              price: prebooking.amount,
              category: 'PREBOOK',
              image: '/placeholder-image.jpg'
            }
          })))
        }
      }
      
      // Sort by creation date (newest first)
      allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      setOrders(allOrders)
      console.log('✅ Orders and prebookings fetched:', allOrders.length)
      
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
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
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
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
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Package className="w-3 h-3 mr-1" />
            Refunded
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.project?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  if (status === 'loading' || loading) {
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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view your orders.</p>
            <Button onClick={() => router.push('/auth/signin')} className="bg-orange-500 hover:bg-orange-600">
              Sign In
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Manage and track your orders</p>
              </div>
            </div>
            <Button onClick={fetchOrders} className="bg-orange-500 hover:bg-orange-600">
              Refresh Orders
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  {filteredOrders.map((order) => (
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
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your current filters.' 
                : "You haven't placed any orders yet."
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => router.push('/dashboard?tab=products')} className="bg-orange-500 hover:bg-orange-600">
                Browse Products
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
