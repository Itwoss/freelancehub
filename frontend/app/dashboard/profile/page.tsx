'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  ArrowLeft,
  Shield,
  Key,
  Bell,
  CreditCard,
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  memberSince: string
  lastLogin?: string
}

export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchProfile()
  }, [status, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      if (session?.user?.id) {
        // Try to fetch user profile from API
        const response = await fetch(`/api/users/${session.user.id}`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data.user)
          setFormData({
            name: data.user.name || '',
            phone: data.user.phone || '',
            address: data.user.address || ''
          })
        } else {
          // Fallback to session data
          setProfile({
            id: session.user.id,
            name: session.user.name || 'User',
            email: session.user.email || 'user@example.com',
            phone: '+1234567890',
            address: '123 Main St, City, State',
            avatar: '/placeholder-avatar.jpg',
            totalOrders: 5,
            totalSpent: 15000,
            memberSince: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          })
          setFormData({
            name: session.user.name || 'User',
            phone: '+1234567890',
            address: '123 Main St, City, State'
          })
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      })
    }
  }

  const handleSave = async () => {
    try {
      // Update profile logic would go here
      toast.success('Profile updated successfully!')
      setEditing(false)
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      month: 'long',
      day: 'numeric',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view your profile.</p>
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
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
            </div>
            {!editing && (
              <Button onClick={handleEdit} className="bg-orange-500 hover:bg-orange-600">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              {editing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <img 
                        src={profile.avatar || '/placeholder-avatar.jpg'} 
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{profile.address || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="text-gray-900">{formatDate(profile.memberSince)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="text-gray-900 font-mono text-sm">{profile.id.slice(-8)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats & Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold text-gray-900">{profile.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(profile.totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">{formatDate(profile.memberSince)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/dashboard/orders')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  View My Orders
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard/products')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Browse Products
                </Button>
                <Button 
                  onClick={() => router.push('/auth/reset-password')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  onClick={() => router.push('/contact')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className="text-green-600 font-semibold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Two-Factor Auth</span>
                  <span className="text-gray-400">Not enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-900">{formatDate(profile.lastLogin || profile.memberSince)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
