'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Key, 
  Globe, 
  Database,
  Mail,
  Save,
  Shield,
  Zap
} from 'lucide-react'

interface RazorpayConfig {
  keyId: string
  keySecret: string
  environment: 'test' | 'live'
  webhookSecret: string
  domain: string
  adminEmail: string
  databaseUrl: string
}

export default function RazorpayConfigPage() {
  const [config, setConfig] = useState<RazorpayConfig>({
    keyId: '',
    keySecret: '',
    environment: 'test',
    webhookSecret: '',
    domain: '',
    adminEmail: '',
    databaseUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const handleInputChange = (field: keyof RazorpayConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEnvironmentChange = (env: 'test' | 'live') => {
    setConfig(prev => ({
      ...prev,
      environment: env
    }))
  }

  const saveConfiguration = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // Validate required fields
      if (!config.keyId || !config.keySecret || !config.domain) {
        setMessage({type: 'error', text: 'Please fill in all required fields'})
        return
      }

      // Save configuration
      const response = await fetch('/api/admin/razorpay-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        setMessage({type: 'success', text: 'Razorpay configuration saved successfully!'})
      } else {
        setMessage({type: 'error', text: 'Failed to save configuration'})
      }

    } catch (error) {
      setMessage({type: 'error', text: 'Error saving configuration'})
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/payment/razorpay/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyId: config.keyId,
          keySecret: config.keySecret,
          environment: config.environment
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage({type: 'success', text: 'Razorpay connection test successful!'})
      } else {
        setMessage({type: 'error', text: result.error || 'Connection test failed'})
      }

    } catch (error) {
      setMessage({type: 'error', text: 'Connection test failed'})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Settings className="w-10 h-10 text-blue-400" />
              Razorpay Configuration
            </h1>
            <p className="text-blue-200 text-lg">
              Configure your Razorpay payment gateway integration
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Key className="w-6 h-6 text-yellow-400" />
                  Razorpay Credentials
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Key ID *
                    </label>
                    <input
                      type="text"
                      value={config.keyId}
                      onChange={(e) => handleInputChange('keyId', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:border-yellow-400 focus:outline-none"
                      placeholder="rzp_test_xxxxxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Key Secret *
                    </label>
                    <input
                      type="password"
                      value={config.keySecret}
                      onChange={(e) => handleInputChange('keySecret', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:border-yellow-400 focus:outline-none"
                      placeholder="Enter your Razorpay Key Secret"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Webhook Secret
                    </label>
                    <input
                      type="password"
                      value={config.webhookSecret}
                      onChange={(e) => handleInputChange('webhookSecret', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:border-yellow-400 focus:outline-none"
                      placeholder="Enter your webhook secret"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Environment
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEnvironmentChange('test')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          config.environment === 'test'
                            ? 'bg-yellow-400 text-black font-bold'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Test Mode
                      </button>
                      <button
                        onClick={() => handleEnvironmentChange('live')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          config.environment === 'live'
                            ? 'bg-yellow-400 text-black font-bold'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Live Mode
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-green-400" />
                  Domain & Email
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Your Domain *
                    </label>
                    <input
                      type="url"
                      value={config.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:border-yellow-400 focus:outline-none"
                      placeholder="https://yourdomain.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      value={config.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-blue-500/50 rounded-lg text-white placeholder-blue-300 focus:border-yellow-400 focus:outline-none"
                      placeholder="admin@yourdomain.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Summary & Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-green-400" />
                  Configuration Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Environment:</span>
                    <span className="text-white font-medium capitalize">{config.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Key ID:</span>
                    <span className="text-white font-mono text-xs">
                      {config.keyId ? '✅ Configured' : '❌ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Key Secret:</span>
                    <span className="text-white font-mono text-xs">
                      {config.keySecret ? '✅ Configured' : '❌ Missing'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Domain:</span>
                    <span className="text-white font-mono text-xs">
                      {config.domain ? '✅ Configured' : '❌ Missing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg border ${
                  message.type === 'success' 
                    ? 'bg-green-900/50 border-green-500/50' 
                    : 'bg-red-900/50 border-red-500/50'
                }`}>
                  <div className="flex items-center gap-2">
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                      {message.text}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={testConnection}
                  disabled={loading || !config.keyId || !config.keySecret}
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Testing Connection...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Test Razorpay Connection
                    </div>
                  )}
                </Button>

                <Button
                  onClick={saveConfiguration}
                  disabled={loading || !config.keyId || !config.keySecret || !config.domain}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Save Configuration
                    </div>
                  )}
                </Button>
              </div>

              {/* Features Section */}
              <div className="bg-green-900/50 border border-green-500/50 rounded-xl p-4">
                <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Razorpay Features
                </h3>
                <div className="space-y-2 text-sm text-green-200">
                  <p>• UPI, Cards, Wallets, Net Banking</p>
                  <p>• Real-time webhooks</p>
                  <p>• Mobile SDKs available</p>
                  <p>• 24/7 developer support</p>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-blue-900/50 border border-blue-500/50 rounded-xl p-4">
                <h3 className="font-bold text-blue-400 mb-2">Need Help?</h3>
                <div className="space-y-2 text-sm text-blue-200">
                  <p>• Get credentials from Razorpay Dashboard</p>
                  <p>• Use Test Mode for development</p>
                  <p>• Ensure your domain has SSL certificate</p>
                  <p>• Test the integration before going live</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
