'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/admin/Badge'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  ShoppingCart,
  Mail,
  Bell,
  Settings,
  FileText,
  Database,
  Shield,
  Zap,
  Star,
  Activity,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Download,
  Search,
  Filter,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalUsers: number
  totalProjects: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
  newUsersToday: number
  projectsToday: number
  ordersToday: number
  revenueToday: number
  averageOrderValue: number
  conversionRate: number
  userRetention: number
}

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  role: string
  bio: string
  rating: number
  image: string
  createdAt: string
  updatedAt: string
  lastLoginAt: string
  isActive: boolean
  totalOrders: number
  totalSpent: number
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethods: {
    type: string
    last4: string
    expiry: string
  }[]
}

interface OrderData {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
  paymentMethod: string
  paymentStatus: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    image: string
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
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  transactionId: string
  notes: string
}

interface PaymentData {
  id: string
  orderId: string
  amount: number
  currency: string
  status: string
  method: string
  transactionId: string
  gateway: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [orders, setOrders] = useState<OrderData[]>([])
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching enhanced dashboard data...')
      
      const [statsRes, usersRes, ordersRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/stats-test'),
        fetch('/api/admin/users-test'),
        fetch('/api/admin/orders-test'),
        fetch('/api/admin/payments-test')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
        console.log('✅ Admin stats fetched successfully')
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
        console.log('✅ Admin users fetched successfully')
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
        console.log('✅ Admin orders fetched successfully')
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData.payments || [])
        console.log('✅ Admin payments fetched successfully')
      }
      
    } catch (error) {
      console.error('❌ Error fetching admin dashboard data:', error)
      toast.error('Failed to load admin dashboard data')
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
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'CANCELLED':
      case 'FAILED':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success(`User ${action} successful`)
        fetchDashboardData()
      } else {
        toast.error(`Failed to ${action} user`)
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error)
      toast.error(`Failed to ${action} user`)
    }
  }

  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/${action}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success(`Order ${action} successful`)
        fetchDashboardData()
      } else {
        toast.error(`Failed to ${action} order`)
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error)
      toast.error(`Failed to ${action} order`)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive)
    return matchesSearch && matchesStatus
  })

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.project.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <AdminLayout currentPage="overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading enhanced admin dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="overview">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Complete user and payment management system</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <Badge variant="info">Live Data</Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                  <p className="text-xs text-blue-600 mt-1">+{stats.newUsersToday} today</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1">+{formatCurrency(stats.revenueToday)} today</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.totalOrders}</p>
                  <p className="text-xs text-purple-600 mt-1">+{stats.ordersToday} today</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.conversionRate}%</p>
                  <p className="text-xs text-orange-600 mt-1">Avg Order: {formatCurrency(stats.averageOrderValue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                          <Badge variant={user.isActive ? 'success' : 'error'} className="text-xs">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users by name, email, or phone..."
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone || 'Not provided'}</div>
                            <div className="text-sm text-gray-500">{user.address?.city || 'No address'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalOrders || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.totalSpent || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.isActive ? 'success' : 'error'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => setSelectedUser(user)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user.id, user.isActive ? 'deactivate' : 'activate')}
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
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
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search orders by customer, product, or order ID..."
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
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
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
                            <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                            <div className="text-sm text-gray-500">{order.transactionId}</div>
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
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleOrderAction(order.id, 'complete')}
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                title="Mark Complete"
                              >
                                <CheckCircle className="w-4 h-4" />
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
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Management</h3>
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Payment System</h4>
                  <p className="text-gray-500">Payment management features coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h4>
                  <p className="text-gray-500">Detailed analytics and reporting features coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{selectedUser.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <Badge variant={selectedUser.role === 'ADMIN' ? 'error' : 'default'}>
                          {selectedUser.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Account Statistics */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Account Statistics</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Orders</label>
                        <p className="text-sm text-gray-900">{selectedUser.totalOrders || 0}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedUser.totalSpent || 0)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Member Since</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Login</label>
                        <p className="text-sm text-gray-900">
                          {selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  {selectedUser.address && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Address</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Street</label>
                          <p className="text-sm text-gray-900">{selectedUser.address.street}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <p className="text-sm text-gray-900">{selectedUser.address.city}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State</label>
                          <p className="text-sm text-gray-900">{selectedUser.address.state}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Country</label>
                          <p className="text-sm text-gray-900">{selectedUser.address.country}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Methods */}
                  {selectedUser.paymentMethods && selectedUser.paymentMethods.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Payment Methods</h4>
                      <div className="space-y-3">
                        {selectedUser.paymentMethods.map((method, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{method.type}</p>
                                <p className="text-sm text-gray-500">**** {method.last4}</p>
                              </div>
                              <div className="text-sm text-gray-500">{method.expiry}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center space-x-4">
                    <Badge variant={selectedUser.isActive ? 'success' : 'error'}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Last updated: {formatDate(selectedUser.updatedAt)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUserAction(selectedUser.id, selectedUser.isActive ? 'deactivate' : 'activate')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Order Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Order ID</label>
                        <p className="text-sm text-gray-900">#{selectedOrder.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedOrder.totalAmount)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <Badge variant={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <p className="text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                        <p className="text-sm text-gray-900">{selectedOrder.transactionId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Customer Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{selectedOrder.user.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedOrder.user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{selectedOrder.user.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Product Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <p className="text-sm text-gray-900">{selectedOrder.project.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <p className="text-sm text-gray-900">{selectedOrder.project.category}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedOrder.project.price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  {selectedOrder.shippingAddress && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Shipping Address</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Street</label>
                          <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.street}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.city}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State</label>
                          <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.state}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Country</label>
                          <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Created: {formatDate(selectedOrder.createdAt)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated: {formatDate(selectedOrder.updatedAt)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOrderAction(selectedOrder.id, 'complete')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
