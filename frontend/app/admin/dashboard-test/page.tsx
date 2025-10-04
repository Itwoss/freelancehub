'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProductGrid, ProductCard } from '@/components/admin/ProductGrid'
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
  BarChart3
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
  role: string
  bio: string
  rating: number
  image: string
  createdAt: string
  updatedAt: string
  projectCount: number
  orderCount: number
  totalSpent: number
  status: string
  lastLoginAt: string
}

interface ProjectData {
  id: string
  title: string
  description: string
  price: number
  category: string
  status: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
    image: string
  }
  orderCount: number
  reviewCount: number
  averageRating: number
}

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

export default function ModernAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [orders, setOrders] = useState<OrderData[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching dashboard data...')
      
      const [statsRes, usersRes, contactsRes, notificationsRes, projectsRes, ordersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats-test'),
        fetch('/api/admin/users-test'),
        fetch('/api/contact'),
        fetch('/api/notifications'),
        fetch('/api/admin/projects-test'),
        fetch('/api/admin/orders-test'),
        fetch('/api/admin/analytics-test')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users || [])
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        setContacts(contactsData.contacts || [])
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        setNotifications(notificationsData.notifications || [])
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects || [])
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
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
    })
  }

  if (loading) {
    return (
      <AdminLayout currentPage="overview">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 capitalize">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Orders</p>
                <p className="text-2xl font-bold text-orange-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid for Projects */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
          <Badge variant="info">Live</Badge>
        </div>
        
        <ProductGrid>
          {projects.slice(0, 6).map((project) => (
            <ProductCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              category={project.category}
              price={project.price}
              status={project.status === 'ACTIVE' ? 'new' : 'sponsored'}
              icon={<Briefcase className="w-6 h-6 text-blue-600" />}
              onClick={() => console.log('Project clicked:', project.id)}
            />
          ))}
        </ProductGrid>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order from {order.user.name}</p>
                  <p className="text-xs text-gray-500">{order.project.title} • {formatCurrency(order.totalAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-blue-900">Manage Users</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left">
              <Briefcase className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-green-900">View Projects</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left">
              <Mail className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-purple-900">Check Messages</p>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-left">
              <Bell className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-orange-900">Notifications</p>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          <Badge variant="success">{users.length} Total</Badge>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
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
                    <Badge variant={user.role === 'ADMIN' ? 'error' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.projectCount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
  )
}
