'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart, 
  Star,
  Heart, 
  Search,
  Filter,
  Grid,
  List,
  CreditCard,
  Package,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Bell,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  reviews: number
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  isFeatured: boolean
  isNew: boolean
}

interface Order {
  id: string
  project: {
    id: string
    title: string
    price: number
    category?: string
    image?: string
  }
  totalAmount: number
  status: string
  createdAt: string
  paymentMethod?: string
  user?: {
    name: string
    email: string
    phone?: string
  }
}

interface UserProfile {
  id: string
    name: string
  email: string
  phone: string
  avatar: string
  totalOrders: number
  totalSpent: number
  memberSince: string
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'products', 'orders', 'profile'].includes(tab)) {
      setActiveTab(tab)
    }
    
    fetchDashboardData()
  }, [status, router, searchParams])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch products
      const productsRes = await fetch('/api/products', {
        credentials: 'include'
      })
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }

      // Fetch user orders (using test API for now)
      try {
        const ordersRes = await fetch('/api/orders-test', {
          credentials: 'include'
        })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
          console.log('✅ Orders fetched successfully:', ordersData.orders?.length || 0, 'orders')
        } else {
          console.warn('⚠️ Failed to fetch orders:', ordersRes.status, ordersRes.statusText)
          // Set some sample orders for demo
          setOrders([
            {
              id: '1',
              totalAmount: 1999,
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
              user: { name: 'Demo User', email: 'demo@example.com', phone: '+1234567890' },
              project: { id: '1', title: 'Premium Web Template', price: 1999, category: 'Web Development', image: '/placeholder-image.jpg' }
            },
            {
              id: '2',
              totalAmount: 2999,
              status: 'PENDING',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              user: { name: 'Demo User', email: 'demo@example.com', phone: '+1234567890' },
              project: { id: '2', title: 'Mobile App Design', price: 2999, category: 'Mobile App', image: '/placeholder-image.jpg' }
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        // Set some sample orders for demo
        setOrders([
          {
            id: '1',
            totalAmount: 1999,
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
            user: { name: 'Demo User', email: 'demo@example.com', phone: '+1234567890' },
            project: { id: '1', title: 'Premium Web Template', price: 1999, category: 'Web Development', image: '/placeholder-image.jpg' }
          },
          {
            id: '2',
            totalAmount: 2999,
            status: 'PENDING',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            user: { name: 'Demo User', email: 'demo@example.com', phone: '+1234567890' },
            project: { id: '2', title: 'Mobile App Design', price: 2999, category: 'Mobile App', image: '/placeholder-image.jpg' }
          }
        ])
      }

      // Fetch user profile
      if (session?.user?.id) {
        const profileRes = await fetch(`/api/users/${session.user.id}`, {
          credentials: 'include'
        })
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setUserProfile(profileData.user)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (product: Product) => {
    try {
      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price,
          paymentMethod: 'razorpay'
        })
      })

      if (orderRes.ok) {
        const orderData = await orderRes.json()
        
        // Store order data in session storage for success page
        sessionStorage.setItem('currentOrder', JSON.stringify(orderData.order))
        
        // Redirect to payment page
        router.push(`/payment/checkout?orderId=${orderData.order.id}`)
      } else {
        toast.error('Failed to create order')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('Failed to process purchase')
    }
  }

  const handleDownload = async (order: Order) => {
    try {
      // Create download link for the product
      const downloadUrl = `/api/products/${order.project?.id}/download`
      
      // Trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${order.project?.title || 'product'}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed. Please try again.')
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
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
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name || 'User'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Discover amazing digital products and services
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                <div className="text-sm text-gray-500">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'My Orders', icon: ShoppingCart },
                { id: 'profile', label: 'Profile', icon: User },
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
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
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
                      <p className="text-green-600 text-sm font-medium">Total Spent</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                      </p>
                            </div>
                    <CreditCard className="w-8 h-8 text-green-600" />
                          </div>
                        </div>
                        
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Available Products</p>
                      <p className="text-2xl font-bold text-purple-900">{products.length}</p>
                        </div>
                    <Package className="w-8 h-8 text-purple-600" />
                      </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Member Since</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {userProfile?.memberSince ? formatDate(userProfile.memberSince) : 'N/A'}
                      </p>
              </div>
                    <User className="w-8 h-8 text-orange-600" />
            </div>
                </div>
              </div>
              
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                    <p className="text-gray-500">Start exploring our products!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{order.project?.title || 'Unknown Product'}</h4>
                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
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
          )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                    <button 
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Available Products</h3>
                  <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
                </div>
                
                {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                          <img
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {product.category}
                          </span>
                            {product.isNew && (
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>
                            <div className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</div>
              </div>

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handlePurchase(product)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Purchase
                        </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={product.image || '/placeholder-image.jpg'}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.title}</h4>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</div>
                          <Button
                            onClick={() => handlePurchase(product)}
                            size="sm"
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Purchase
                          </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                  <p className="text-gray-500 mb-4">Start exploring our products!</p>
                  <Button onClick={() => setActiveTab('products')}>
                    Browse Products
                        </Button>
                    </div>
                  ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={order.project?.image || '/placeholder-image.jpg'}
                                alt={order.project?.title || 'Product'}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{order.project?.title || 'Unknown Product'}</div>
                                <div className="text-sm text-gray-500">{order.project?.category || 'General'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => console.log('View order:', order.id)}
                                title="View Order Details"
                              >
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
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              {userProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={userProfile.phone || 'Not provided'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={formatDate(userProfile.memberSince)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Orders</label>
                    <input
                      type="text"
                      value={userProfile.totalOrders}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Spent</label>
                    <input
                      type="text"
                      value={formatCurrency(userProfile.totalSpent)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Profile information not available</p>
              </div>
              )}
            </div>  
          )}
        </div>
          </div>

      <Footer />
    </div>
  )
}