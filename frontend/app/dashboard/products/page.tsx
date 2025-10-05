'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Package, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  ArrowLeft,
  Grid,
  List,
  ChevronDown,
  Heart,
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

export default function UserProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchProducts()
  }, [status, router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Try the products API
      const response = await fetch('/api/products', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        console.log('✅ Products fetched:', data.products?.length || 0)
      } else {
        console.warn('⚠️ Failed to fetch products, using sample data')
        // Fallback to sample products
        setProducts([
          {
            id: '1',
            title: 'Premium Web Template',
            description: 'A modern, responsive web template perfect for business websites.',
            price: 1999,
            category: 'Web Development',
            image: '/placeholder-image.jpg',
            rating: 4.8,
            reviews: 124,
            author: {
              name: 'John Doe',
              avatar: '/placeholder-avatar.jpg'
            },
            tags: ['HTML', 'CSS', 'JavaScript'],
            isFeatured: true,
            isNew: false
          },
          {
            id: '2',
            title: 'Mobile App Design',
            description: 'Complete mobile app design system with components and guidelines.',
            price: 2999,
            category: 'Mobile App',
            image: '/placeholder-image.jpg',
            rating: 4.9,
            reviews: 89,
            author: {
              name: 'Jane Smith',
              avatar: '/placeholder-avatar.jpg'
            },
            tags: ['UI/UX', 'Figma', 'Design System'],
            isFeatured: true,
            isNew: true
          },
          {
            id: '3',
            title: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with admin panel and payment integration.',
            price: 4999,
            category: 'Web Development',
            image: '/placeholder-image.jpg',
            rating: 4.7,
            reviews: 67,
            author: {
              name: 'Mike Johnson',
              avatar: '/placeholder-avatar.jpg'
            },
            tags: ['React', 'Node.js', 'MongoDB'],
            isFeatured: false,
            isNew: false
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (product: Product) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
      default:
        return 0 // No sorting by date since createdAt doesn't exist
    }
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to browse products.</p>
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Discover and purchase digital products</p>
              </div>
            </div>
            <Button onClick={fetchProducts} className="bg-orange-500 hover:bg-orange-600">
              Refresh Products
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="web development">Web Development</option>
                <option value="mobile app">Mobile App</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                onClick={() => setViewMode('grid')}
                className={`${viewMode === 'grid' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white hover:bg-gray-50'} rounded-r-none border-r-0`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white hover:bg-gray-50'} rounded-l-none`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <img src={product.author.avatar} alt={product.author.name} className="w-6 h-6 rounded-full mr-2" />
                        <span>{product.author.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button 
                      onClick={() => handlePurchase(product)}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-6">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <div className="flex items-center text-sm text-gray-500">
                          <img src={product.author.avatar} alt={product.author.name} className="w-5 h-5 rounded-full mr-1" />
                          <span>{product.author.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handlePurchase(product)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== 'all' 
                ? 'No products match your current filters.' 
                : "No products are available at the moment."
              }
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setCategoryFilter('all')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
