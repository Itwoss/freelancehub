'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/admin/Badge'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  ShoppingCart,
  DollarSign,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalyticsData {
  totalUsers: number
  totalProjects: number
  totalOrders: number
  totalRevenue: number
  usersByRole: Array<{ role: string; count: number }>
  projectsByCategory: Array<{ category: string; count: number }>
  ordersByStatus: Array<{ status: string; count: number }>
  revenueByMonth: Array<{ totalAmount: number; createdAt: string }>
  averageOrderValue: number
  conversionRate: number
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [chartType, setChartType] = useState('line')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics-test')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
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
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <AdminLayout currentPage="analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Platform performance and insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button 
                onClick={fetchAnalytics}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">{analytics.totalUsers}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(analytics.totalRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold text-purple-900">{analytics.totalProjects}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% from last month
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-900">{analytics.conversionRate}%</p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -2% from last month
                  </p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg ${chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LineChart className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg ${chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
                <p className="text-sm text-gray-400">Chart integration coming soon</p>
              </div>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
              <Badge variant="success">+12% Growth</Badge>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">User growth chart will be displayed here</p>
                <p className="text-sm text-gray-400">Chart integration coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects by Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Category</h3>
            <div className="space-y-3">
              {analytics?.projectsByCategory?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{category.category}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
            <div className="space-y-3">
              {analytics?.ordersByStatus?.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'COMPLETED' ? 'bg-green-500' :
                      status.status === 'PENDING' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{status.status}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Roles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-3">
              {analytics?.usersByRole?.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      role.role === 'ADMIN' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{role.role}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{role.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics?.averageOrderValue ? formatCurrency(analytics.averageOrderValue) : '₹0'}
              </div>
              <p className="text-sm text-gray-600">Average Order Value</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics?.conversionRate || 0}%
              </div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analytics?.totalOrders || 0}
              </div>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
