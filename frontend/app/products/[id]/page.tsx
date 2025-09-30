'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { 
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  ExternalLink,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  BookOpen,
  CreditCard,
  Shield,
  CheckCircle,
  X,
  User,
  Mail,
  Phone,
  MapPin
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

interface BookingForm {
  name: string
  email: string
  phone: string
  message: string
  paymentMethod: 'card' | 'paypal'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  country: string
  postalCode: string
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    country: 'US',
    postalCode: ''
  })
  const [isBooking, setIsBooking] = useState(false)

  const mockProduct: Product = {
    id: '1',
    title: 'Nexus AI - Framer Template',
    description: 'Discover the Nexus AI Framer Template, a dynamic solution that effortlessly combines the power of an AI Platform Marketing website (CMS) with the versatility of 7 collections, all wrapped in an elegant Dark Theme. This template is crafted to empower you in effortlessly creating visually stunning web applications with unparalleled ease.',
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
  }

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)
  }, [status, router])

  const handleBooking = async () => {
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    setIsBooking(true)
    
    try {
      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product?.id,
          userId: session.user.id,
          ...bookingForm
        })
      })

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking')
      }

      const booking = await bookingResponse.json()
      
      // If payment required, redirect to Stripe
      if (product?.price > 0) {
        const paymentResponse = await fetch('/api/payments/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: product.price * 100, // Convert to cents
            currency: 'usd'
          })
        })

        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment session')
        }

        const { url } = await paymentResponse.json()
        window.location.href = url
      } else {
        toast.success('Booking created successfully!')
        setShowBookingForm(false)
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

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
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
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
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>

          {/* Two Panel Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Panel - Live Preview */}
            <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
              <div className={`bg-gray-900 rounded-xl overflow-hidden ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
                {/* Preview Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-400 ml-4">{product.liveUrl}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(product.liveUrl, '_blank')}
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Iframe Preview */}
                <div className="relative h-full">
                  <iframe
                    src={product.previewUrl}
                    className="w-full h-full border-0"
                    title={product.title}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Product Details & Booking */}
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{product.rating}</span>
                        <span>({product.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Updated {new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-500">${product.price}</div>
                    {product.isPopular && (
                      <div className="text-sm text-orange-400">Popular Choice</div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{product.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              {!showBookingForm ? (
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Ready to Book?</h2>
                    <p className="text-gray-400">Get instant access to this amazing product</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-gray-400">One-time purchase</div>
                      </div>
                      <div className="text-xl font-bold">${product.price}</div>
                    </div>

                    <Button
                      onClick={() => setShowBookingForm(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-4"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Book This Product - ${product.price}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>Secure payment with Stripe</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Complete Your Booking</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBookingForm(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={bookingForm.phone}
                            onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Input
                            id="message"
                            value={bookingForm.message}
                            onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Button
                          variant={bookingForm.paymentMethod === 'card' ? 'default' : 'outline'}
                          onClick={() => setBookingForm({...bookingForm, paymentMethod: 'card'})}
                          className={bookingForm.paymentMethod === 'card' ? 'bg-orange-500' : 'border-gray-700'}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay by Card
                        </Button>
                        <Button
                          variant={bookingForm.paymentMethod === 'paypal' ? 'default' : 'outline'}
                          onClick={() => setBookingForm({...bookingForm, paymentMethod: 'paypal'})}
                          className={bookingForm.paymentMethod === 'paypal' ? 'bg-orange-500' : 'border-gray-700'}
                        >
                          Pay with PayPal
                        </Button>
                      </div>

                      {bookingForm.paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              value={bookingForm.cardNumber}
                              onChange={(e) => setBookingForm({...bookingForm, cardNumber: e.target.value})}
                              placeholder="1234 1234 1234 1234"
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiration Date</Label>
                              <Input
                                id="expiryDate"
                                value={bookingForm.expiryDate}
                                onChange={(e) => setBookingForm({...bookingForm, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">Security Code</Label>
                              <Input
                                id="cvv"
                                value={bookingForm.cvv}
                                onChange={(e) => setBookingForm({...bookingForm, cvv: e.target.value})}
                                placeholder="CVC"
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cardholderName">Cardholder Name</Label>
                            <Input
                              id="cardholderName"
                              value={bookingForm.cardholderName}
                              onChange={(e) => setBookingForm({...bookingForm, cardholderName: e.target.value})}
                              placeholder="John More Doe"
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Billing Address */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <select
                            id="country"
                            value={bookingForm.country}
                            onChange={(e) => setBookingForm({...bookingForm, country: e.target.value})}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="IN">India</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={bookingForm.postalCode}
                            onChange={(e) => setBookingForm({...bookingForm, postalCode: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-800 pt-4">
                      <div className="flex items-center justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${product.price}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleBooking}
                      disabled={isBooking}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-4"
                    >
                      {isBooking ? 'Processing...' : `Complete Booking - $${product.price}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
