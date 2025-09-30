'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Eye, 
  Star, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Play,
  BookOpen,
  Code,
  Palette,
  Smartphone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  previewUrl: string
  liveUrl: string
  images: string[]
  rating: number
  reviews: number
  features: string[]
  tags: string[]
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  isPopular: boolean
  isNew: boolean
}

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Products', icon: BookOpen },
    { id: 'templates', name: 'Templates', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
  ]

  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://nexus-ai-template.framer.website',
      liveUrl: 'https://nexus-ai-template.framer.website',
      images: ['/placeholder-image/nexus-ai-1.jpg', '/placeholder-image/nexus-ai-2.jpg'],
      rating: 4.9,
      reviews: 127,
      features: ['Dark Theme', 'AI Platform', '7 Collections', 'CMS Ready', 'Responsive'],
      tags: ['Framer', 'AI', 'Dark Theme', 'Marketing'],
      author: {
        name: 'Design Studio',
        avatar: '/placeholder-image/author-1.jpg'
      },
      createdAt: '2024-01-15',
      isPopular: true,
      isNew: false
    },
    {
      id: '2',
      title: 'E-commerce Dashboard',
      description: 'Modern e-commerce dashboard with analytics, order management, and customer insights. Built with React and TypeScript.',
      price: 89,
      category: 'templates',
      previewUrl: 'https://ecommerce-dashboard.framer.website',
      liveUrl: 'https://ecommerce-dashboard.framer.website',
      images: ['/placeholder-image/ecommerce-1.jpg'],
      rating: 4.8,
      reviews: 89,
      features: ['Analytics', 'Order Management', 'Customer Insights', 'Responsive'],
      tags: ['React', 'TypeScript', 'Dashboard', 'E-commerce'],
      author: {
        name: 'Tech Solutions',
        avatar: '/placeholder-image/author-2.jpg'
      },
      createdAt: '2024-01-10',
      isPopular: false,
      isNew: true
    },
    {
      id: '3',
      title: 'Mobile App UI Kit',
      description: 'Complete mobile app UI kit with 50+ screens, components, and design system. Perfect for iOS and Android apps.',
      price: 49,
      category: 'mobile',
      previewUrl: 'https://mobile-ui-kit.framer.website',
      liveUrl: 'https://mobile-ui-kit.framer.website',
      images: ['/placeholder-image/mobile-1.jpg'],
      rating: 4.7,
      reviews: 156,
      features: ['50+ Screens', 'iOS & Android', 'Components', 'Design System'],
      tags: ['Mobile', 'UI Kit', 'iOS', 'Android'],
      author: {
        name: 'Mobile Design Co',
        avatar: '/placeholder-image/author-3.jpg'
      },
      createdAt: '2024-01-05',
      isPopular: true,
      isNew: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> Products</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse our collection of premium templates, designs, and digital products. 
              Find the perfect solution for your next project.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer group"
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className="relative aspect-video bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/50" />
                  </div>
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      New
                    </div>
                  )}
                  {product.isPopular && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg md:text-xl font-semibold group-hover:text-orange-500 transition-colors">
                      {product.title}
                    </h3>
                    <div className="text-xl md:text-2xl font-bold text-orange-500">
                      ${product.price}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {product.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{product.author.name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(product)
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(product.liveUrl, '_blank')
                      }}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No products found</div>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
