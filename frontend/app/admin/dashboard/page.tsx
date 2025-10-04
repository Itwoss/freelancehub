'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Eye,
  ShoppingCart,
  Star,
  MessageSquare,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Search,
  Settings,
  Shield,
  Database,
  Server,
  Globe,
  Mail,
  Bell,
  FileText,
  CreditCard,
  Target,
  Zap
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
  createdAt: string
  lastLoginAt: string
  projectCount: number
  orderCount: number
  totalSpent: number
  status: string
}

interface ProjectData {
  id: string
  title: string
  author: {
    name: string
    email: string
  }
  price: number
  status: string
  createdAt: string
  orderCount: number
  reviewCount: number
  averageRating: number
}

interface OrderData {
  id: string
  buyer: {
    name: string
    email: string
  }
  project: {
    title: string
  }
  totalAmount: number
  status: string
  createdAt: string
  paymentMethod: string
}

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number }>
  revenueGrowth: Array<{ date: string; revenue: number }>
  projectCategories: Array<{ category: string; count: number }>
  topProjects: ProjectData[]
  recentOrders: OrderData[]
  userActivity: Array<{ date: string; logins: number; projects: number; orders: number }>
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchDashboardData()
  }, [status, session, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, contactsRes, notificationsRes, projectsRes, ordersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/contact'),
        fetch('/api/notifications'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/analytics')
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
      } else {
        console.warn('Failed to fetch contacts:', contactsRes.status)
        setContacts([])
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        setNotifications(notificationsData.notifications || [])
      } else {
        console.warn('Failed to fetch notifications:', notificationsRes.status)
        setNotifications([])
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
      console.error('Error fetching admin dashboard data:', error)
      toast.error('Failed to load admin dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Monitor platform performance, user activity, and business metrics.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{stats.newUsersToday} today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Active: {stats.activeUsers}</p>
                    <p className="text-xs text-gray-500">Retention: {stats.userRetention.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="text-xs text-green-600">+{formatCurrency(stats.revenueToday)} today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Avg Order: {formatCurrency(stats.averageOrderValue)}</p>
                    <p className="text-xs text-gray-500">Conversion: {stats.conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProjects.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{stats.projectsToday} today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Active Projects</p>
                    <p className="text-xs text-gray-500">Categories</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-yellow-100">
                      <ShoppingCart className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{stats.ordersToday} today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">User Retention</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.userRetention.toFixed(1)}%</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
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
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Platform Health */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Platform Health</p>
                        <p className="text-2xl font-bold text-green-600">98.5%</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">All systems operational</p>
                  </div>
                </div>

                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Server Load</p>
                        <p className="text-2xl font-bold text-blue-600">23%</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Server className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Optimal performance</p>
                  </div>
                </div>

                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Database</p>
                        <p className="text-2xl font-bold text-purple-600">2.1GB</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Database className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Storage usage</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-green-100 rounded-full">
                            <ShoppingCart className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              New order from {order.buyer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.project.title} • {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Projects */}
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Top Performing Projects</h3>
                      <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project, index) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 line-clamp-1">{project.title}</h4>
                              <p className="text-sm text-gray-600">by {project.author.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(project.price)}</p>
                            <p className="text-xs text-gray-500">{project.orderCount} orders</p>
                            <div className="flex items-center mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500 ml-1">{project.averageRating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                      </div>
                      <Globe className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+12% from yesterday</p>
                  </div>
                </div>

                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email Sent</p>
                        <p className="text-2xl font-bold text-gray-900">3,456</p>
                      </div>
                      <Mail className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+8% from yesterday</p>
                  </div>
                </div>

                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Notifications</p>
                        <p className="text-2xl font-bold text-gray-900">892</p>
                      </div>
                      <Bell className="w-8 h-8 text-yellow-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+15% from yesterday</p>
                  </div>
                </div>

                <div className="card">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">API Calls</p>
                        <p className="text-2xl font-bold text-gray-900">45.2K</p>
                      </div>
                      <Zap className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-green-600 mt-2">+23% from yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signup Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
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
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.projectCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.orderCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.totalSpent)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
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

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Submissions</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No contact submissions found
                          </td>
                        </tr>
                      ) : (
                        contacts.map((contact: any) => (
                          <tr key={contact.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                contact.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                                contact.status === 'READ' ? 'bg-blue-100 text-blue-800' :
                                contact.status === 'REPLIED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(contact.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Mail className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">System Notifications</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No notifications</h4>
                      <p className="text-gray-500">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notification: any) => (
                      <div key={notification.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                notification.read ? 'bg-gray-300' : 'bg-blue-500'
                              }`}></div>
                              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                notification.type === 'CONTACT_SUBMISSION' ? 'bg-blue-100 text-blue-800' :
                                notification.type === 'ORDER' ? 'bg-green-100 text-green-800' :
                                notification.type === 'USER_SIGNUP' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {notification.type?.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Project Management</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{project.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">by {project.author.name}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-primary-600">{formatCurrency(project.price)}</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          {project.averageRating.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.orderCount} orders</span>
                        <span>{project.reviewCount} reviews</span>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.buyer.name}</div>
                              <div className="text-sm text-gray-500">{order.buyer.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.project.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.totalAmount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart placeholder - User growth over time</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart placeholder - Revenue over time</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Categories</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart placeholder - Project distribution by category</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart placeholder - Daily activity metrics</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="w-6 h-6 mb-2" />
                      User Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Briefcase className="w-6 h-6 mb-2" />
                      Project Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <ShoppingCart className="w-6 h-6 mb-2" />
                      Sales Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <DollarSign className="w-6 h-6 mb-2" />
                      Revenue Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Star className="w-6 h-6 mb-2" />
                      Review Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Activity className="w-6 h-6 mb-2" />
                      Activity Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Platform Settings</h4>
                      <p className="text-sm text-gray-600">Configure platform-wide settings</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Templates</h4>
                      <p className="text-sm text-gray-600">Manage email notifications</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Security Settings</h4>
                      <p className="text-sm text-gray-600">Configure security policies</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Backup & Recovery</h4>
                      <p className="text-sm text-gray-600">Manage data backups</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        <Footer />
      </div>
    </AdminGuard>
  )
}