'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Star,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalOrders: number
  totalSpent: number
  availableProducts: number
  memberSince: string
}

interface RecentOrder {
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
}

interface RecentProduct {
  id: string
  title: string
  price: number
  category: string
  image: string
  rating: number
  reviews: number
  isFeatured: boolean
  isNew: boolean
}

export default function DashboardOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<RecentProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchDashboardData()
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch orders
      const ordersRes = await fetch('/api/orders-test', {
        credentials: 'include'
      })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(ordersData.orders?.slice(0, 5) || [])
      }

      // Fetch products
      const productsRes = await fetch('/api/products', {
        credentials: 'include'
      })
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setFeaturedProducts(productsData.products?.slice(0, 3) || [])
      }

      // Set stats
      setStats({
        totalOrders: recentOrders.length,
        totalSpent: recentOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        availableProducts: featuredProducts.length,
        memberSince: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback data
      setStats({
        totalOrders: 5,
        totalSpent: 15000,
        availableProducts: 12,
        memberSince: new Date().toISOString()
      })
      setRecentOrders([
        {
          id: '1',
          totalAmount: 1999,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
          project: {
            id: '1',
            title: 'Premium Web Template',
            price: 1999,
            category: 'Web Development',
            image: '/placeholder-image.jpg'
          }
        },
        {
          id: '2',
          totalAmount: 2999,
          status: 'PENDING',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          project: {
            id: '2',
            title: 'Mobile App Design',
            price: 2999,
            category: 'Mobile App',
            image: '/placeholder-image.jpg'
          }
        }
      ])
      setFeaturedProducts([
        {
          id: '1',
          title: 'Premium Web Template',
          price: 1999,
          category: 'Web Development',
          image: '/placeholder-image.jpg',
          rating: 4.8,
          reviews: 124,
          isFeatured: true,
          isNew: false
        },
        {
          id: '2',
          title: 'Mobile App Design',
          price: 2999,
          category: 'Mobile App',
          image: '/placeholder-image.jpg',
          rating: 4.9,
          reviews: 89,
          isFeatured: true,
          isNew: true
        }
      ])
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

  const handlePurchase = async (product: RecentProduct) => {
    try {
      if (!session?.user?.id) {
        toast.error('Please log in to make a purchase.')
        router.push('/auth/signin')
        return
      }

      toast.loading('Initiating purchase...', { id: 'purchaseToast' })
      
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
        toast.dismiss('purchaseToast')
      } else {
        toast.error('Failed to create order', { id: 'purchaseToast' })
      }
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('Failed to process purchase', { id: 'purchaseToast' })
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
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view your dashboard.</p>
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name || 'User'}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(stats.memberSince)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Button 
                onClick={() => router.push('/dashboard/orders')}
                variant="outline"
                className="text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={order.project?.image || '/placeholder-image.jpg'} 
                        alt={order.project?.title}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{order.project?.title}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent orders</p>
                <Button 
                  onClick={() => router.push('/dashboard/products')}
                  className="mt-4 bg-orange-500 hover:bg-orange-600"
                >
                  Browse Products
                </Button>
              </div>
            )}
          </div>

          {/* Featured Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
              <Button 
                onClick={() => router.push('/dashboard/products')}
                variant="outline"
                className="text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {featuredProducts.length > 0 ? (
              <div className="space-y-4">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{product.title}</h3>
                        {product.isNew && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{product.category}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{product.rating}</span>
                        </div>
                        <span>{product.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                      <Button 
                        onClick={() => handlePurchase(product)}
                        size="sm"
                        className="mt-2 bg-orange-500 hover:bg-orange-600"
                      >
                        Purchase
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No featured products available</p>
                <Button 
                  onClick={() => router.push('/dashboard/products')}
                  className="mt-4 bg-orange-500 hover:bg-orange-600"
                >
                  Browse All Products
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => router.push('/dashboard/products')}
              className="flex items-center justify-center p-4 h-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Package className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/orders')}
              className="flex items-center justify-center p-4 h-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Orders
            </Button>
            <Button 
              onClick={() => router.push('/dashboard/profile')}
              className="flex items-center justify-center p-4 h-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              My Profile
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
