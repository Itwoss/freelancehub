'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function FeedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'posts' | 'stories'>('all')

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  // Mock feed data
  const feedItems = [
    {
      id: 1,
      type: 'post',
      author: { name: 'John Doe', avatar: '/api/placeholder-image/40/40' },
      title: 'Amazing Design Inspiration',
      content: 'Just discovered this incredible design trend that\'s taking the industry by storm!',
      image: '/api/placeholder-image/600/300',
      likes: 24,
      comments: 8,
      shares: 3,
      timeAgo: '2 hours ago'
    },
    {
      id: 2,
      type: 'story',
      author: { name: 'Sarah Wilson', avatar: '/api/placeholder-image/40/40' },
      title: 'Behind the Scenes',
      content: 'Working on something exciting! Can\'t wait to share the final result.',
      image: '/api/placeholder-image/400/600',
      likes: 12,
      comments: 4,
      shares: 1,
      timeAgo: '4 hours ago'
    },
    {
      id: 3,
      type: 'post',
      author: { name: 'Mike Chen', avatar: '/api/placeholder-image/40/40' },
      title: 'New Project Launch',
      content: 'Excited to announce the launch of our new project! It\'s been months in the making.',
      image: '/api/placeholder-image/600/400',
      likes: 36,
      comments: 12,
      shares: 7,
      timeAgo: '1 day ago'
    }
  ]

  const handleLike = (id: number) => {
    toast.success('Liked!')
  }

  const handleComment = (id: number) => {
    toast.success('Comment added!')
  }

  const handleShare = (id: number) => {
    toast.success('Shared!')
  }

  const filteredItems = feedItems.filter(item => 
    filter === 'all' || item.type === filter
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'posts', label: 'Posts' },
                  { value: 'stories', label: 'Stories' }
                ].map((filterOption) => (
                  <Button
                    key={filterOption.value}
                    variant={filter === filterOption.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(filterOption.value as any)}
                  >
                    {filterOption.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Feed Items */}
          <div className={`space-y-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}>
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Author Info */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.author.name}</p>
                        <p className="text-sm text-gray-500">{item.timeAgo}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{item.content}</p>
                  
                  {item.image && (
                    <div className="mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(item.id)}
                        className="flex items-center"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {item.likes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleComment(item.id)}
                        className="flex items-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {item.comments}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(item.id)}
                        className="flex items-center"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        {item.shares}
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.type === 'story' ? 'Story' : 'Post'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">No {filter === 'all' ? 'content' : filter} found</p>
                <p className="text-sm">Be the first to share something!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
