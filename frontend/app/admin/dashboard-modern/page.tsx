'use client'

import React from 'react'
import AdminPage from '@/components/admin/AdminPage'
import { ProductGrid, ProductCard } from '@/components/admin/ProductGrid'
import { Badge } from '@/components/admin/Badge'
import { 
  Users, 
  Briefcase, 
  ShoppingCart, 
  Mail, 
  Bell, 
  TrendingUp,
  Database,
  Shield,
  Zap,
  Star
} from 'lucide-react'

// Example products data
const exampleProducts = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Complete e-commerce solution with payment integration, inventory management, and analytics dashboard.',
    category: 'Web Development',
    price: 2500,
    status: 'new' as const,
    icon: <Briefcase className="w-6 h-6 text-blue-600" />
  },
  {
    id: '2',
    title: 'Mobile App Design',
    description: 'Modern mobile app UI/UX design with wireframes, prototypes, and design system.',
    category: 'UI/UX Design',
    price: 1200,
    status: 'sponsored' as const,
    icon: <Zap className="w-6 h-6 text-purple-600" />
  },
  {
    id: '3',
    title: 'Marketing Strategy',
    description: 'Comprehensive digital marketing strategy including SEO, social media, and content planning.',
    category: 'Marketing',
    price: 800,
    status: 'highlight' as const,
    icon: <TrendingUp className="w-6 h-6 text-green-600" />
  },
  {
    id: '4',
    title: 'Logo Design Package',
    description: 'Professional logo design with multiple concepts, revisions, and brand guidelines.',
    category: 'Graphic Design',
    price: 500,
    status: 'new' as const,
    icon: <Star className="w-6 h-6 text-orange-600" />
  },
  {
    id: '5',
    title: 'Database Optimization',
    description: 'Database performance optimization and migration services for improved efficiency.',
    category: 'Backend Development',
    price: 1500,
    status: 'sponsored' as const,
    icon: <Database className="w-6 h-6 text-indigo-600" />
  },
  {
    id: '6',
    title: 'Security Audit',
    description: 'Comprehensive security audit and penetration testing for web applications.',
    category: 'Security',
    price: 2000,
    status: 'highlight' as const,
    icon: <Shield className="w-6 h-6 text-red-600" />
  }
]

export default function ModernAdminDashboard() {
  return (
    <AdminPage 
      currentPage="overview" 
      showStats={true}
      showProductGrid={true}
      products={exampleProducts}
    >
      {/* Additional content can go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Order completed</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New contact message</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
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
    </AdminPage>
  )
}
