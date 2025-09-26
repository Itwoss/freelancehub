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
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Camera,
  Video,
  Music,
  Globe,
  Lock,
  CheckCircle,
  User,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

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
  isPublic: boolean
  author: {
    id: string
    name: string
    image?: string
    isVerified: boolean
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
  author: {
    id: string
    name: string
    image?: string
    isVerified: boolean
  }
}

export default function FeedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'stories'>('posts')

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/mini-office/feed')
      return
    }
    fetchFeed()
  }, [status, router])

  const fetchFeed = async () => {
    try {
      setLoading(true)
      const [postsResponse, storiesResponse] = await Promise.all([
        fetch('/api/social/posts'),
        fetch('/api/social/stories')
      ])

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.posts || [])
      }

      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json()
        setStories(storiesData.stories || [])
      }
    } catch (error) {
      console.error('Error fetching feed:', error)
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Refresh posts to get updated like count
        fetchFeed()
      } else {
        toast.error('Failed to like post')
      }
    } catch (error) {
      console.error('Error liking post:', error)
      toast.error('Failed to like post')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/mini-office">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Global Feed</h1>
            </div>
            <div className="flex space-x-3">
              <Link href="/mini-office/create-post">
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </Link>
              <Link href="/mini-office/create-story">
                <Button variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Add Story
                </Button>
              </Link>
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
                Posts ({posts.length})
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
                Stories ({stories.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to share something with your colleagues!</p>
                <Link href="/mini-office/create-post">
                  <Button>
                    <Camera className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="card">
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Link href={`/mini-office/profile/${post.author.id}`}>
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                            {post.author.image ? (
                              <img
                                src={post.author.image}
                                alt={post.author.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary-600" />
                            )}
                          </div>
                        </Link>
                        <div>
                          <div className="flex items-center space-x-1">
                            <Link href={`/mini-office/profile/${post.author.id}`}>
                              <span className="font-semibold text-gray-900 hover:text-primary-600">
                                {post.author.name}
                              </span>
                            </Link>
                            {post.author.isVerified && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            {post.isPublic ? (
                              <Globe className="w-3 h-3" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Post Content */}
                    {post.title && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    )}
                    
                    <p className="text-gray-700 mb-4">{post.caption}</p>

                    {/* Images */}
                    {post.images.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {post.images.slice(0, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                        {post.images.length > 4 && (
                          <p className="text-sm text-gray-500 mt-2">
                            +{post.images.length - 4} more images
                          </p>
                        )}
                      </div>
                    )}

                    {/* Audio */}
                    {post.audioUrl && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Music className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{post.audioTitle || 'Audio'}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likesCount}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentsCount}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                          <Share className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button className="text-gray-500 hover:text-yellow-500">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6">
            {stories.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-500 mb-4">Share a moment with your colleagues!</p>
                <Link href="/mini-office/create-story">
                  <Button>
                    <Video className="w-4 h-4 mr-2" />
                    Create First Story
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stories.map((story) => (
                  <div key={story.id} className="card hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Link href={`/mini-office/profile/${story.author.id}`}>
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                            {story.author.image ? (
                              <img
                                src={story.author.image}
                                alt={story.author.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-primary-600" />
                            )}
                          </div>
                        </Link>
                        <div>
                          <div className="flex items-center space-x-1">
                            <Link href={`/mini-office/profile/${story.author.id}`}>
                              <span className="text-sm font-semibold text-gray-900 hover:text-primary-600">
                                {story.author.name}
                              </span>
                            </Link>
                            {story.author.isVerified && (
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
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
                          <Globe className="w-3 h-3" />
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


