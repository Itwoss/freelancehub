'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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

export default function SimpleAdminDashboard() {
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

      console.log('📊 API Responses:', {
        stats: statsRes.status,
        users: usersRes.status,
        contacts: contactsRes.status,
        notifications: notificationsRes.status,
        projects: projectsRes.status,
        orders: ordersRes.status,
        analytics: analyticsRes.status
      })

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        console.log('✅ Stats loaded:', statsData)
        setStats(statsData)
      } else {
        console.warn('⚠️ Stats failed:', statsRes.status)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        console.log('✅ Users loaded:', usersData.users?.length || 0)
        setUsers(usersData.users || [])
      } else {
        console.warn('⚠️ Users failed:', usersRes.status)
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        console.log('✅ Contacts loaded:', contactsData.contacts?.length || 0)
        setContacts(contactsData.contacts || [])
      } else {
        console.warn('⚠️ Contacts failed:', contactsRes.status)
        setContacts([])
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        console.log('✅ Notifications loaded:', notificationsData.notifications?.length || 0)
        setNotifications(notificationsData.notifications || [])
      } else {
        console.warn('⚠️ Notifications failed:', notificationsRes.status)
        setNotifications([])
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        console.log('✅ Projects loaded:', projectsData.projects?.length || 0)
        setProjects(projectsData.projects || [])
      } else {
        console.warn('⚠️ Projects failed:', projectsRes.status)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        console.log('✅ Orders loaded:', ordersData.orders?.length || 0)
        setOrders(ordersData.orders || [])
      } else {
        console.warn('⚠️ Orders failed:', ordersRes.status)
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        console.log('✅ Analytics loaded:', analyticsData)
        setAnalytics(analyticsData)
      } else {
        console.warn('⚠️ Analytics failed:', analyticsRes.status)
      }

      console.log('🎉 Dashboard data loaded successfully!')
      
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin dashboard...</p>
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your FreelanceHub platform</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Users</span>
                    <span className="font-semibold">{stats.newUsersToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Projects</span>
                    <span className="font-semibold">{stats.projectsToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Orders</span>
                    <span className="font-semibold">{stats.ordersToday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Today</span>
                    <span className="font-semibold">{formatCurrency(stats.revenueToday)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold">{stats.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User Retention</span>
                    <span className="font-semibold">{stats.userRetention.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Order Value</span>
                    <span className="font-semibold">{formatCurrency(stats.averageOrderValue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Projects
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Check Messages
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
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
          <div className="bg-white rounded-lg shadow">
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

        {/* Other tabs would go here... */}
        
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <p className="text-gray-600">Notifications feature coming soon...</p>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
            <p className="text-gray-600">Projects feature coming soon...</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
            <p className="text-gray-600">Orders feature coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-600">Analytics feature coming soon...</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
