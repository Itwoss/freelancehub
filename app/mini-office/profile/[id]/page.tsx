'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  Heart, 
  MessageCircle, 
  UserPlus,
  Camera,
  Video,
  Music,
  Globe,
  Lock,
  CheckCircle,
  Star,
  ArrowLeft,
  MoreHorizontal,
  Share,
  Bookmark
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
  posts: Post[]
  stories: Story[]
}

interface Post {
  id: string
  title?: string
  caption: string
  images: string[]
  audioUrl?: string
  audioTitle?: string
  likesCount: number
  commentsCount: number
  createdAt: string
  isApproved: boolean
  isPublic: boolean
  author: {
    id: string
    name: string
    image?: string
  }
  likes: Array<{
    id: string
    user: {
      id: string
      name: string
    }
  }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      name: string
      image?: string
    }
  }>
}

interface Story {
  id: string
  content: string
  type: 'IMAGE' | 'VIDEO'
  viewsCount: number
  expiresAt: string
  createdAt: string
  isApproved: boolean
  isPublic: boolean
}

export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'stories'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/mini-office')
      return
    }
    fetchUser()
  }, [status, router, userId])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/social/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsFollowing(data.isFollowing || false)
      } else {
        toast.error('User not found')
        router.push('/mini-office')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/social/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: isFollowing ? 'unfollow' : 'follow' }),
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
        toast.success(isFollowing ? 'Unfollowed' : 'Following')
        // Refresh user data to update follower count
        fetchUser()
      } else {
        toast.error('Failed to update follow status')
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
      toast.error('Failed to update follow status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
            <Link href="/mini-office">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Mini Office
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/mini-office">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mini Office
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="card mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-12 h-12 text-primary-600" />
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  {user.isVerified && (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                {user.bio && (
                  <p className="text-gray-700 mb-4">{user.bio}</p>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.posts.length}</span>
                    <span>posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.followersCount}</span>
                    <span>followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold">{user.followingCount}</span>
                    <span>following</span>
                  </div>
                </div>

                {/* Permissions */}
                <div className="flex items-center space-x-2 mb-4">
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

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {!isOwnProfile && (
                  <>
                    {user.canChat && (
                      <Link href={`/mini-office/chat/${user.id}`}>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant={isFollowing ? 'outline' : 'primary'}
                      size="sm"
                      onClick={handleFollow}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </>
                )}
                {isOwnProfile && (
                  <div className="flex space-x-2">
                    <Link href="/mini-office/create-post">
                      <Button size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                    </Link>
                    <Link href="/mini-office/create-story">
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Add Story
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'posts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Posts ({user.posts.length})
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'stories'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Video className="w-4 h-4 mr-2" />
                Stories ({user.stories.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {user.posts.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500">
                  {isOwnProfile ? 'Create your first post to get started!' : 'This user hasn\'t posted anything yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.posts.map((post) => (
                  <div key={post.id} className="card hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      {post.images.length > 0 && (
                        <div className="mb-4">
                          <img
                            src={post.images[0]}
                            alt={post.title || 'Post'}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {post.title && (
                        <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      )}
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.caption}</p>
                      
                      {post.audioUrl && (
                        <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
                          <Music className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{post.audioTitle || 'Audio'}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likesCount}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.commentsCount}</span>
                          </span>
                        </div>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6">
            {user.stories.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-500">
                  {isOwnProfile ? 'Create your first story to get started!' : 'This user hasn\'t shared any stories yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {user.stories.map((story) => (
                  <div key={story.id} className="card hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        {story.type === 'IMAGE' ? (
                          <img
                            src={story.content}
                            alt="Story"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Video className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{story.viewsCount} views</span>
                        </span>
                        <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}


