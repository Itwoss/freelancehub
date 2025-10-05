'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { 
  Plus, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Download,
  Upload,
  Settings,
  User,
  Bell,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function MiniOfficePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Redirect if not authenticated
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
    return null // Will redirect
  }

  const quickActions = [
    {
      title: 'Create Post',
      description: 'Share your thoughts and updates',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/mini-office/create-post'
    },
    {
      title: 'Create Story',
      description: 'Share a quick story or moment',
      icon: Image,
      color: 'bg-purple-500',
      href: '/mini-office/create-story'
    },
    {
      title: 'View Feed',
      description: 'See what others are sharing',
      icon: Grid,
      color: 'bg-green-500',
      href: '/mini-office/feed'
    },
    {
      title: 'My Profile',
      description: 'View and edit your profile',
      icon: User,
      color: 'bg-orange-500',
      href: '/mini-office/profile'
    }
  ]

  const recentItems = [
    { id: 1, title: 'My First Post', type: 'post', date: '2 hours ago' },
    { id: 2, title: 'Project Update', type: 'story', date: '1 day ago' },
    { id: 3, title: 'Design Inspiration', type: 'post', date: '3 days ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Mini Office, {session?.user?.name}!
                </h1>
                <p className="text-gray-600">
                  Your personal workspace for creating and sharing content.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => router.push('/mini-office/create-post')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button
                  onClick={() => router.push('/mini-office/create-story')}
                  variant="outline"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Create Story
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => router.push(action.href)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
              </div>
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        {item.type === 'post' ? <FileText className="w-4 h-4 text-blue-600" /> : <Image className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Stories</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Tips</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Use the create post feature to share updates with your network</li>
              <li>• Stories are great for quick, temporary content</li>
              <li>• Check your feed regularly to see what others are sharing</li>
              <li>• Keep your profile updated to attract more connections</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
