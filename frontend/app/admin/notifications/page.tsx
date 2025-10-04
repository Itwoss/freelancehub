'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Badge } from '@/components/admin/Badge'
import { 
  Bell, 
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  Calendar,
  User,
  Mail,
  ShoppingCart,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'

interface NotificationData {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRead, setFilterRead] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONTACT_SUBMISSION':
        return 'info'
      case 'ORDER':
        return 'success'
      case 'USER_SIGNUP':
        return 'warning'
      case 'SYSTEM':
        return 'error'
      default:
        return 'default'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONTACT_SUBMISSION':
        return <Mail className="w-4 h-4" />
      case 'ORDER':
        return <ShoppingCart className="w-4 h-4" />
      case 'USER_SIGNUP':
        return <User className="w-4 h-4" />
      case 'SYSTEM':
        return <Bell className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesRead = filterRead === 'all' || 
                       (filterRead === 'read' && notification.read) ||
                       (filterRead === 'unread' && !notification.read)
    return matchesSearch && matchesType && matchesRead
  })

  const markAsRead = async (id: string) => {
    // Implement mark as read functionality
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    toast.success('Notification marked as read')
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification deleted')
  }

  if (loading) {
    return (
      <AdminLayout currentPage="notifications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout currentPage="notifications">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Manage system notifications and alerts</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="info">{notifications.length} Total</Badge>
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </button>
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
                  placeholder="Search notifications by title or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="CONTACT_SUBMISSION">Contact</option>
                <option value="ORDER">Order</option>
                <option value="USER_SIGNUP">User Signup</option>
                <option value="SYSTEM">System</option>
              </select>
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Notifications</p>
                <p className="text-2xl font-bold text-blue-900">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Unread</p>
                <p className="text-2xl font-bold text-yellow-900">{notifications.filter(n => !n.read).length}</p>
              </div>
              <X className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Read</p>
                <p className="text-2xl font-bold text-green-900">{notifications.filter(n => n.read).length}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Today</p>
                <p className="text-2xl font-bold text-purple-900">
                  {notifications.filter(n => {
                    const notificationDate = new Date(n.createdAt)
                    const today = new Date()
                    return notificationDate.toDateString() === today.toDateString()
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className={`p-6 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type) === 'info' ? 'bg-blue-100 text-blue-600' :
                                                      getTypeColor(notification.type) === 'success' ? 'bg-green-100 text-green-600' :
                                                      getTypeColor(notification.type) === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                      getTypeColor(notification.type) === 'error' ? 'bg-red-100 text-red-600' :
                                                      'bg-gray-100 text-gray-600'}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Badge variant={getTypeColor(notification.type)}>
                            {notification.type?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
