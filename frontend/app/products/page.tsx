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
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
    }, {
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
    }, {
      id: '1',
      title: 'Nexus AI - Framer Template',
      description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme.',
      price: 69,
      category: 'templates',
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
      previewUrl: 'https://examdodo-vercel.vercel.app/',
      liveUrl: 'https://examdodo-vercel.vercel.app/',
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
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                ✨ LIMITED TIME EVENT
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dare to discover
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"> Amazing Products?</span>
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto font-medium">
              Light your creativity and chase premium templates in our marketplace! 
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
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-xl text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none backdrop-blur-sm shadow-lg"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-200 text-sm md:text-base font-bold shadow-lg ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white transform scale-105'
                      : 'bg-gradient-to-r from-purple-800/50 to-pink-800/50 text-purple-200 hover:from-purple-700/50 hover:to-pink-700/50 hover:text-white backdrop-blur-sm border border-purple-500/30'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
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
                className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group shadow-2xl border border-purple-700/50"
                onClick={() => handleProductClick(product)}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Product Image */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-700/80 to-pink-600/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-semibold text-sm">PREVIEW</p>
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ✨ NEW
                    </div>
                  )}
                  {product.isPopular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 POPULAR
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      className="bg-white text-purple-900 hover:bg-purple-100 font-bold px-6 py-3 rounded-full shadow-xl transform hover:scale-110 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(product)
                      }}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      PREVIEW NOW
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-gradient-to-b from-purple-900/50 to-purple-800/50 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors leading-tight">
                      {product.title}
                    </h3>
                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      ${product.price}
                    </div>
                  </div>

                  <p className="text-purple-100 mb-4 line-clamp-2 text-sm leading-relaxed">
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
                              : 'text-purple-400'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-purple-200 font-medium">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-medium backdrop-blur-sm border border-white/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {product.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{product.author.name}</div>
                      <div className="text-xs text-purple-200">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(product)
                      }}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      GET NOW
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(product.liveUrl, '_blank')
                      }}
                      className="border-white/30 text-white hover:bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm"
                      title="Open live preview"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <div className="text-purple-200 text-xl font-bold mb-2">No products found</div>
              <p className="text-purple-300">Try adjusting your search or filters to discover amazing products!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
