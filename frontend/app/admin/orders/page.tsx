'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/admin/Badge'
import { 
  ShoppingCart, 
  Search,
  Filter,
  Download,
  Eye,
  Settings,
  DollarSign,
  Calendar,
  User,
  Package,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderData {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string
  }
  project: {
    id: string
    title: string
    price: number
    category: string
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // Fetch both orders and prebookings from admin APIs
      const [ordersResponse, prebookingsResponse] = await Promise.all([
        fetch('/api/admin/orders', { credentials: 'include' }),
        fetch('/api/admin/prebookings', { credentials: 'include' })
      ])
      
      const allOrders: OrderData[] = []
      
      // Process regular orders
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.orders) {
          allOrders.push(...ordersData.orders.map((order: any) => ({
            id: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            user: {
              id: order.user?.id || order.userId,
              name: order.user?.name || 'Unknown User',
              email: order.user?.email || 'unknown@example.com',
              image: order.user?.image || '/placeholder-avatar.jpg'
            },
            project: {
              id: order.project?.id || order.projectId,
              title: order.project?.title || 'Unknown Product',
              price: order.project?.price || order.totalAmount,
              category: order.project?.category || 'General'
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
            updatedAt: prebooking.updatedAt,
            user: {
              id: prebooking.user?.id || prebooking.userId,
              name: prebooking.user?.name || 'Unknown User',
              email: prebooking.user?.email || 'unknown@example.com',
              image: prebooking.user?.image || '/placeholder-avatar.jpg'
            },
            project: {
              id: prebooking.productId,
              title: prebooking.productTitle,
              price: prebooking.amount,
              category: 'PREBOOK'
            }
          })))
        }
      }
      
      // Sort by creation date (newest first)
      allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      setOrders(allOrders)
      console.log('✅ Admin orders and prebookings fetched:', allOrders.length)
      
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.project.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesDate = filterDate === 'all' || true // Add date filtering logic if needed
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'PAID':
        return 'info'
      case 'PENDING':
        return 'warning'
      case 'CANCELLED':
        return 'error'
      case 'REFUNDED':
        return 'secondary'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <AdminLayout currentPage="orders">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="orders">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">Manage and track all orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="info">{orders.length} Total Orders</Badge>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders by customer, project, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-900">{orders.filter(o => o.status === 'COMPLETED').length}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{orders.filter(o => o.status === 'PENDING').length}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {order.user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                          <div className="text-sm text-gray-500">{order.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.project.title}</div>
                      <div className="text-sm text-gray-500">{order.project.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                      <p className="text-xs text-gray-500">{order.project.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <Badge variant={getStatusColor(order.status)} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {orders.length > 0 ? ((orders.filter(o => o.status === 'COMPLETED').length / orders.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-sm font-medium text-gray-900">
                  {orders.length > 0 ? formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) : '₹0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
