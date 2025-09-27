'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  Coins,
  CreditCard,
  Check,
  Star,
  Zap,
  Crown,
  MessageSquare
} from 'lucide-react'

export default function PurchasePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      coins: 100,
      messages: 10,
      price: 4.99,
      popular: false,
      icon: Coins,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'pro',
      name: 'Pro',
      coins: 300,
      messages: 30,
      price: 12.99,
      popular: true,
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'premium',
      name: 'Premium',
      coins: 600,
      messages: 60,
      price: 19.99,
      popular: false,
      icon: Crown,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const handlePurchase = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: selectedPlan }),
      })

      if (!response.ok) {
        throw new Error('Payment setup failed')
      }

      const { clientSecret } = await response.json()
      
      // In a real implementation, you would use Stripe Elements here
      // For now, we'll simulate a successful payment
      console.log('Payment intent created:', clientSecret)
      
      // Simulate payment processing
      setTimeout(() => {
        setLoading(false)
        router.push('/dashboard?tab=chat?success=true')
      }, 2000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      setLoading(false)
      alert('Payment failed. Please try again.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard?tab=chat">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-white">Purchase Coins</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Get More Messages</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Purchase coins to unlock more daily messages and connect with more people
          </p>
          
          {/* Current Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">150</div>
                <div className="text-sm text-gray-400">Current Coins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">3/5</div>
                <div className="text-sm text-gray-400">Messages Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">2</div>
                <div className="text-sm text-gray-400">Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  selectedPlan === plan.id 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-orange-400 mb-4">${plan.price}</div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{plan.coins} Coins</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-400" />
                      <span className="text-white">{plan.messages} Extra Messages</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Perfect for {plan.name.toLowerCase()} users
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Plan Comparison */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Plan Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-white font-semibold">Features</th>
                  <th className="text-center py-4 text-white font-semibold">Basic</th>
                  <th className="text-center py-4 text-white font-semibold">Pro</th>
                  <th className="text-center py-4 text-white font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Coins', basic: '100', pro: '300', premium: '600' },
                  { feature: 'Extra Messages', basic: '10', pro: '30', premium: '60' },
                  { feature: 'Price per Coin', basic: '$0.05', pro: '$0.043', premium: '$0.033' },
                  { feature: 'Value Score', basic: '⭐⭐', pro: '⭐⭐⭐⭐', premium: '⭐⭐⭐⭐⭐' },
                  { feature: 'Best For', basic: 'Casual Users', pro: 'Active Users', premium: 'Power Users' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-4 text-white font-medium">{row.feature}</td>
                    <td className="py-4 text-center text-gray-300">{row.basic}</td>
                    <td className="py-4 text-center text-orange-400 font-semibold">{row.pro}</td>
                    <td className="py-4 text-center text-purple-400">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">What you get</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Unlimited daily messages',
              'Priority customer support',
              'Advanced search filters',
              'Read receipts',
              'Message scheduling',
              'File sharing up to 100MB'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Payment Details</h3>
          
          <div className="max-w-md mx-auto">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/20 mb-6">
              <div>
                <div className="text-sm text-gray-300">Total</div>
                <div className="text-2xl font-bold text-orange-400">
                  ${plans.find(p => p.id === selectedPlan)?.price}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white">
                  {plans.find(p => p.id === selectedPlan)?.coins} Coins
                </span>
              </div>
            </div>
            
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Complete Purchase
                </div>
              )}
            </Button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Secure payment powered by Stripe. Your payment information is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
