'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  ExternalLink,
  Play,
  BookOpen,
  Code,
  Palette,
  Smartphone,
  CheckCircle,
  Users,
  Award,
  Zap,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react'
// import RazorpayPayment from '@/components/payment/RazorpayPayment'

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
  longDescription: string
  techStack: string[]
  requirements: string[]
  whatYouGet: string[]
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPrebookModal, setShowPrebookModal] = useState(false)
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Currency localization
  const getCurrency = () => {
    if (typeof window !== 'undefined') {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      return timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta') ? 'INR' : 'USD'
    }
    return 'USD'
  }

  const getPrebookPrice = () => {
    const currency = getCurrency()
    return currency === 'INR' ? 1 : 1
  }

  const getCurrencySymbol = () => {
    const currency = getCurrency()
    return currency === 'INR' ? '₹' : '$'
  }

  const handlePrebook = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    setShowPrebookModal(true)
  }

  const handlePrebookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Create prebook order
      const orderData = {
        productId: product?.id,
        productTitle: product?.title,
        userDetails,
        amount: getPrebookPrice(),
        currency: getCurrency(),
        status: 'pending'
      }

      console.log('Storing order data:', orderData)
      console.log('Amount being stored:', orderData.amount)
      
      // Store order data in sessionStorage for payment page
      sessionStorage.setItem('prebookOrder', JSON.stringify(orderData))
      
      // Close modal and redirect to payment page
      setShowPrebookModal(false)
      
      // Redirect to payment page
      router.push('/payment/prebook')
      
    } catch (error) {
      console.error('Prebook error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId)
    // Redirect to success page
    router.push(`/payment/success?paymentId=${paymentId}`)
  }

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error)
    // Show error message or redirect to failure page
    router.push(`/payment/failed?error=${encodeURIComponent(error)}`)
  }

  const mockProducts: Product[] = [
    {
      id: 'youtube',
      title: 'YouTube',
      description: 'The world\'s largest video sharing platform with billions of users and creators worldwide.',
      price: 0,
      category: 'platform',
      previewUrl: 'https://youtube.com',
      liveUrl: 'https://youtube.com',
      images: ['/placeholder-image/youtube-1.jpg', '/placeholder-image/youtube-2.jpg'],
      rating: 4.8,
      reviews: 2300000000,
      features: ['Video Sharing', 'Live Streaming', 'Monetization', 'Creator Tools', 'Global Reach'],
      tags: ['Video', 'Streaming', 'Social', 'Entertainment'],
      author: {
        name: 'Google',
        avatar: '/placeholder-image/google.jpg'
      },
      createdAt: '2005-02-14',
      isPopular: true,
      isNew: false,
      longDescription: 'YouTube is the world\'s largest video sharing platform, allowing users to upload, view, rate, share, add to playlists, report, comment on videos, and subscribe to other users. It offers a wide variety of user-generated and corporate media videos.',
      techStack: ['React', 'TypeScript', 'Google Cloud', 'Machine Learning', 'CDN'],
      requirements: ['Internet connection', 'Modern web browser', 'Google account'],
      whatYouGet: ['Video hosting', 'Analytics', 'Monetization tools', 'Creator support', 'Global distribution']
    },
    {
      id: 'spotify',
      title: 'Spotify',
      description: 'Premium music streaming service with millions of songs, podcasts, and personalized playlists.',
      price: 9.99,
      category: 'music',
      previewUrl: 'https://spotify.com',
      liveUrl: 'https://spotify.com',
      images: ['/placeholder-image/spotify-1.jpg'],
      rating: 4.7,
      reviews: 515000000,
      features: ['Music Streaming', 'Podcasts', 'Offline Playback', 'Personalized Playlists', 'High Quality Audio'],
      tags: ['Music', 'Streaming', 'Audio', 'Entertainment'],
      author: {
        name: 'Spotify AB',
        avatar: '/placeholder-image/spotify-logo.jpg'
      },
      createdAt: '2006-04-23',
      isPopular: true,
      isNew: false,
      longDescription: 'Spotify is a Swedish audio streaming and media services provider founded in 2006. It is one of the largest music streaming service providers, with over 515 million monthly active users, including 210 million paying subscribers.',
      techStack: ['React', 'Node.js', 'Python', 'Kubernetes', 'Machine Learning'],
      requirements: ['Internet connection', 'Spotify account', 'Compatible device'],
      whatYouGet: ['Unlimited music', 'Ad-free experience', 'Offline downloads', 'High quality audio', 'Exclusive content']
    },
    {
      id: 'netflix',
      title: 'Netflix',
      description: 'Premium streaming service with thousands of movies, TV shows, and original content.',
      price: 15.49,
      category: 'entertainment',
      previewUrl: 'https://netflix.com',
      liveUrl: 'https://netflix.com',
      images: ['/placeholder-image/netflix-1.jpg'],
      rating: 4.6,
      reviews: 238000000,
      features: ['Original Content', 'Multiple Profiles', 'Offline Downloads', '4K Streaming', 'Global Library'],
      tags: ['Streaming', 'Movies', 'TV Shows', 'Entertainment'],
      author: {
        name: 'Netflix Inc.',
        avatar: '/placeholder-image/netflix-logo.jpg'
      },
      createdAt: '1997-08-29',
      isPopular: true,
      isNew: false,
      longDescription: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial.',
      techStack: ['React', 'Node.js', 'AWS', 'Microservices', 'Machine Learning'],
      requirements: ['Internet connection', 'Netflix subscription', 'Compatible device'],
      whatYouGet: ['Unlimited streaming', 'Original content', 'Multiple profiles', 'Offline downloads', '4K quality']
    },
    {
      id: 'github',
      title: 'GitHub',
      description: 'The world\'s leading software development platform for version control and collaboration.',
      price: 0,
      category: 'development',
      previewUrl: 'https://github.com',
      liveUrl: 'https://github.com',
      images: ['/placeholder-image/github-1.jpg'],
      rating: 4.9,
      reviews: 100000000,
      features: ['Version Control', 'Collaboration', 'CI/CD', 'Project Management', 'Code Review'],
      tags: ['Development', 'Git', 'Open Source', 'Collaboration'],
      author: {
        name: 'Microsoft',
        avatar: '/placeholder-image/microsoft.jpg'
      },
      createdAt: '2008-04-10',
      isPopular: true,
      isNew: false,
      longDescription: 'GitHub is a web-based platform that uses Git for version control. It offers all of the distributed version control and source code management functionality of Git, plus its own features.',
      techStack: ['Ruby on Rails', 'JavaScript', 'Go', 'Kubernetes', 'GraphQL'],
      requirements: ['Git knowledge', 'Internet connection', 'GitHub account'],
      whatYouGet: ['Unlimited repositories', 'Collaboration tools', 'CI/CD', 'Project management', 'Code review']
    },
    {
      id: 'instagram',
      title: 'Instagram',
      description: 'Visual storytelling platform for sharing photos, videos, and stories with friends and followers.',
      price: 0,
      category: 'social',
      previewUrl: 'https://instagram.com',
      liveUrl: 'https://instagram.com',
      images: ['/placeholder-image/instagram-1.jpg'],
      rating: 4.5,
      reviews: 2000000000,
      features: ['Photo Sharing', 'Stories', 'Reels', 'IGTV', 'Shopping'],
      tags: ['Social Media', 'Photos', 'Videos', 'Stories'],
      author: {
        name: 'Meta',
        avatar: '/placeholder-image/meta.jpg'
      },
      createdAt: '2010-10-06',
      isPopular: true,
      isNew: false,
      longDescription: 'Instagram is a photo and video sharing social networking service owned by Meta Platforms. Users can upload media that can be edited with filters and organized by hashtags and geographical tagging.',
      techStack: ['React Native', 'Python', 'Django', 'PostgreSQL', 'Redis'],
      requirements: ['Mobile device', 'Internet connection', 'Instagram account'],
      whatYouGet: ['Photo sharing', 'Video content', 'Stories feature', 'Shopping', 'Messaging']
    },
    {
      id: 'discord',
      title: 'Discord',
      description: 'All-in-one voice and text chat for gamers, communities, and friends to hang out together.',
      price: 0,
      category: 'communication',
      previewUrl: 'https://discord.com',
      liveUrl: 'https://discord.com',
      images: ['/placeholder-image/discord-1.jpg'],
      rating: 4.6,
      reviews: 150000000,
      features: ['Voice Chat', 'Text Messaging', 'Screen Sharing', 'Server Management', 'Bot Integration'],
      tags: ['Gaming', 'Communication', 'Voice Chat', 'Community'],
      author: {
        name: 'Discord Inc.',
        avatar: '/placeholder-image/discord-logo.jpg'
      },
      createdAt: '2015-05-13',
      isPopular: true,
      isNew: false,
      longDescription: 'Discord is a VoIP, instant messaging and digital distribution platform designed for creating communities. Users communicate with voice calls, video calls, text messaging, media and files in private chats or as part of communities called "servers".',
      techStack: ['React', 'Electron', 'Rust', 'Elixir', 'PostgreSQL'],
      requirements: ['Internet connection', 'Discord account', 'Compatible device'],
      whatYouGet: ['Voice chat', 'Text messaging', 'Screen sharing', 'Server creation', 'Bot integration']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === params.id)
      setProduct(foundProduct || null)
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products" className="text-purple-400 hover:text-purple-300">
            ← Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Project Preview */}
            <div className="space-y-6">
              {/* Project Preview */}
              <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-700/50">
                <div className="aspect-video bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                  <iframe
                    src={product.previewUrl}
                    className="w-full h-full border-0"
                    title={`${product.title} Preview`}
                    loading="lazy"
                  />
                  </div>
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-4">
                    <Button
                      className="bg-white text-purple-900 hover:bg-purple-100 font-bold px-6 py-3 rounded-full shadow-xl"
                      onClick={() => window.open(product.liveUrl, '_blank')}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open Live Site
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Full Screen
                    </Button>
                  </div>
                  </div>
                </div>

              {/* Project Images */}
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white/50" />
                    </div>
                </div>
                ))}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="space-y-6">
              {/* Product Header */}
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {product.isNew && (
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ✨ NEW
                        </span>
                      )}
                      {product.isPopular && (
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          🔥 POPULAR
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
                    <p className="text-purple-200 text-lg">{product.description}</p>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    ${product.price}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-purple-400'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-purple-200 font-medium">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Payment Section */}
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Secure Payment</h3>
                      <p className="text-blue-200">Prebook this amazing product</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Amount:</span>
                      <span className="text-white font-bold">
                        {getCurrencySymbol()}{getPrebookPrice()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Product:</span>
                      <span className="text-white">{product.title}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePrebook}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      PREBOOK - {getCurrencySymbol()}{getPrebookPrice()}
                    </div>
                  </Button>

                  <div className="mt-4 text-center">
                    <p className="text-blue-200 text-sm">
                      🔒 Your payment is secure and encrypted
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20 px-6 py-4 rounded-xl backdrop-blur-sm"
                    onClick={() => window.open(product.liveUrl, '_blank')}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
                <div className="flex gap-2 mb-6">
                  {['overview', 'features', 'tech', 'requirements'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-300 hover:text-white hover:bg-purple-700/50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                  </div>

                  <div className="space-y-4">
                  {activeTab === 'overview' && (
                      <div>
                      <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                      <p className="text-purple-200 leading-relaxed">{product.longDescription}</p>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-purple-200">{feature}</span>
                        </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'tech' && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-white/20 text-white text-sm rounded-full font-medium backdrop-blur-sm border border-white/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                          </div>
                  )}

                  {activeTab === 'requirements' && (
                            <div>
                      <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                      <div className="space-y-3">
                        {product.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                            <span className="text-purple-200">{req}</span>
                          </div>
                        ))}
                          </div>
                        </div>
                      )}
                </div>
                    </div>

              {/* Author Info */}
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Created by</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {product.author.name.charAt(0)}
                    </span>
                        </div>
                        <div>
                    <div className="text-lg font-bold text-white">{product.author.name}</div>
                    <div className="text-sm text-purple-200">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                        </div>
                      </div>
                    </div>

          {/* Suggestions Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                You might also like
              </h2>
              <p className="text-purple-200 text-lg">
                Discover more amazing platforms and services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts
                .filter(p => p.id !== product.id)
                .slice(0, 3)
                .map((suggestion) => (
                <Link 
                  key={suggestion.id} 
                  href={`/products/${suggestion.id}`}
                  className="group bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                      {suggestion.category === 'platform' && <Play className="w-6 h-6 text-white" />}
                      {suggestion.category === 'music' && <Play className="w-6 h-6 text-white" />}
                      {suggestion.category === 'entertainment' && <Play className="w-6 h-6 text-white" />}
                      {suggestion.category === 'development' && <Code className="w-6 h-6 text-white" />}
                      {suggestion.category === 'social' && <Palette className="w-6 h-6 text-white" />}
                      {suggestion.category === 'communication' && <Users className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-purple-200">{suggestion.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        {suggestion.price === 0 ? 'Free' : `$${suggestion.price}`}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-purple-200">{suggestion.rating}</span>
                      </div>
                      </div>
                    </div>

                  <div className="flex flex-wrap gap-2">
                    {suggestion.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 text-white text-xs rounded-full font-medium backdrop-blur-sm border border-white/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Prebook Modal */}
      {showPrebookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Prebook {product?.title}</h2>
              <button
                onClick={() => setShowPrebookModal(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePrebookSubmit} className="space-y-6">
              {/* User Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.fullName}
                    onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    value={userDetails.country}
                    onChange={(e) => setUserDetails({...userDetails, country: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Address *
                  </label>
                  <textarea
                    required
                    value={userDetails.address}
                    onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.city}
                    onChange={(e) => setUserDetails({...userDetails, city: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.state}
                    onChange={(e) => setUserDetails({...userDetails, state: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your state/province"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.zipCode}
                    onChange={(e) => setUserDetails({...userDetails, zipCode: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-purple-300 focus:border-yellow-400 focus:outline-none"
                    placeholder="Enter your ZIP/postal code"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/10 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-bold text-white mb-3">Order Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-200">Prebook: {product?.title}</span>
                  <span className="text-white font-medium">{getCurrencySymbol()}{getPrebookPrice()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-yellow-400">{getCurrencySymbol()}{getPrebookPrice()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPrebookModal(false)}
                  className="flex-1 border-white/30 text-white hover:bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}