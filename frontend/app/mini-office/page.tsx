'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  Search, 
  Plus, 
  Heart, 
  MessageCircle, 
  UserPlus,
  Camera,
  Video,
  Music,
  Globe,
  Lock,
  CheckCircle,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  isVerified: boolean
  followersCount: number
  followingCount: number
  canPost: boolean
  canChat: boolean
  postsCount: number
  storiesCount: number
  _count: {
    posts: number
    stories: number
  }
}

export default function MiniOfficePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'canPost' | 'canChat'>('all')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/mini-office')
      return
    }
    fetchUsers()
  }, [status, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/social/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    switch (filter) {
      case 'verified':
        return user.isVerified
      case 'canPost':
        return user.canPost
      case 'canChat':
        return user.canChat
      default:
        return true
    }
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mini Office</h1>
              <p className="text-gray-600">
                Connect with your colleagues and share your work
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard/home">
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  Dashboard Home
                </Button>
              </Link>
              <Link href="/mini-office/create-post">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </Link>
              <Link href="/mini-office/create-story">
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Story
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All Users
                </Button>
                <Button
                  variant={filter === 'verified' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('verified')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Button>
                <Button
                  variant={filter === 'canPost' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('canPost')}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Can Post
                </Button>
                <Button
                  variant={filter === 'canChat' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('canChat')}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Can Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link href={`/mini-office/profile/${user.id}`} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        {user.isVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </Link>
                </div>

                {user.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex space-x-4">
                    <span>{user.followersCount} followers</span>
                    <span>{user.followingCount} following</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex space-x-4">
                    <span>{user._count.posts} posts</span>
                    <span>{user._count.stories} stories</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    {user.canPost && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <Globe className="w-3 h-3 mr-1" />
                        Can Post
                      </span>
                    )}
                    {user.canChat && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Can Chat
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/mini-office/profile/${user.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  {user.canChat && (
                    <Link href={`/mini-office/chat/${user.id}`}>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No users match your current filter'}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}


