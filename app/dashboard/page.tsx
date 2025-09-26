'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Briefcase, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Star,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  BookOpen,
  Award,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Filter,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Project {
  id: string
  title: string
  description: string
  price: number
  category: string
  status: string
  images: string[]
  tags: string[]
  createdAt: string
  _count: {
    orders: number
    reviews: number
  }
}

interface Order {
  id: string
  project: {
    title: string
    price: number
  }
  status: string
  totalAmount: number
  createdAt: string
}

interface Review {
  id: string
  rating: number
  comment: string
  project: {
    title: string
  }
  reviewer: {
    name: string
  }
  createdAt: string
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [myPosts, setMyPosts] = useState<any[]>([])
  const [myStories, setMyStories] = useState<any[]>([])
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchDashboardData()
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [projectsRes, ordersRes, reviewsRes, myPostsRes, myStoriesRes, allPostsRes] = await Promise.all([
        fetch('/api/projects?my=true'),
        fetch('/api/orders'),
        fetch('/api/reviews?my=true'),
        fetch('/api/social/posts?authorId=' + session?.user?.id),
        fetch('/api/social/stories?authorId=' + session?.user?.id),
        fetch('/api/social/posts')
      ])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects || [])
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData.reviews || [])
      }

      if (myPostsRes.ok) {
        const myPostsData = await myPostsRes.json()
        setMyPosts(myPostsData.posts || [])
      }

      if (myStoriesRes.ok) {
        const myStoriesData = await myStoriesRes.json()
        setMyStories(myStoriesData.stories || [])
      }

      if (allPostsRes.ok) {
        const allPostsData = await allPostsRes.json()
        setAllPosts(allPostsData.posts || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const stats = [
    {
      title: 'My Projects',
      value: projects.length,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'My Posts',
      value: myPosts.length,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'My Stories',
      value: myStories.length,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'content', label: 'My Content', icon: BookOpen },
    { id: 'feed', label: 'Social Feed', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your projects, track orders, and grow your freelance business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/projects/create">
                      <Button className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Project
                      </Button>
                    </Link>
                    <Link href="/mini-office/create-post">
                      <Button className="w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                    </Link>
                    <Link href="/mini-office/create-story">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="w-4 h-4 mr-2" />
                        Add Story
                      </Button>
                    </Link>
                    <Link href="/projects">
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        Browse Projects
                      </Button>
                    </Link>
                    <Link href="/mini-office/feed">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        View Feed
                      </Button>
                    </Link>
                    <Link href="/dashboard?tab=settings">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="card">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                    <Link href="/dashboard?tab=projects">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.category}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-primary-600">${project.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
                  <Link href="/projects/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {project.images.length > 0 && (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-primary-600">${project.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{project._count.orders} orders</span>
                          <span>{project._count.reviews} reviews</span>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/projects/${project.id}/edit`}>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Orders</h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{order.project.title}</h4>
                        <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-primary-600">${order.totalAmount}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Reviews & Ratings</h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.project.title}</h4>
                          <p className="text-sm text-gray-600">by {review.reviewer.name}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab - My Posts and Stories */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">My Content</h2>
                <div className="flex gap-2">
                  <Link href="/mini-office/create-post">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Link href="/mini-office/create-story">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Story
                    </Button>
                  </Link>
                </div>
              </div>

              {/* My Posts */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                    My Posts ({myPosts.length})
                  </h3>
                  {myPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold mb-2">No posts yet</p>
                      <p className="mb-4">Share your thoughts and experiences with the community!</p>
                      <Link href="/mini-office/create-post">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Post
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myPosts.map((post) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                          {post.images && post.images.length > 0 && (
                            <div className="mb-3">
                              <img 
                                src={post.images[0]} 
                                alt="Post" 
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          {post.title && (
                            <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                          )}
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.caption}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4" />
                              <span>{post.likesCount}</span>
                              <MessageSquare className="w-4 h-4 ml-2" />
                              <span>{post.commentsCount}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* My Stories */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    My Stories ({myStories.length})
                  </h3>
                  {myStories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold mb-2">No stories yet</p>
                      <p className="mb-4">Share moments that disappear after 24 hours!</p>
                      <Link href="/mini-office/create-story">
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Story
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {myStories.map((story) => (
                        <div key={story.id} className="relative">
                          <div className="aspect-square rounded-full overflow-hidden border-2 border-pink-500">
                            <img 
                              src={story.content} 
                              alt="Story" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center mt-2">
                            <p className="text-xs text-gray-500">
                              {story.type === 'IMAGE' ? '📷' : '🎥'} {story.viewsCount} views
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Social Feed</h2>
                <div className="flex gap-2">
                  <Link href="/mini-office/create-post">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Link href="/mini-office/feed">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Feed
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Community Posts ({allPosts.length})
                  </h3>
                  {allPosts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold mb-2">No posts yet</p>
                      <p className="mb-4">Be the first to share something with the community!</p>
                      <Link href="/mini-office/create-post">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Post
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allPosts.map((post) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <img 
                              src={post.author.image || '/default-avatar.png'} 
                              alt={post.author.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {post.images && post.images.length > 0 && (
                            <div className="mb-4">
                              <img 
                                src={post.images[0]} 
                                alt="Post" 
                                className="w-full max-h-96 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          {post.title && (
                            <h5 className="font-semibold text-gray-900 mb-2">{post.title}</h5>
                          )}
                          
                          <p className="text-gray-700 mb-4">{post.caption}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                                <Heart className="w-4 h-4" />
                                <span>{post.likesCount}</span>
                              </button>
                              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                                <MessageSquare className="w-4 h-4" />
                                <span>{post.commentsCount}</span>
                              </button>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Information</h4>
                      <p className="text-sm text-gray-600">Update your personal details</p>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-600">Update your password</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Notifications</h4>
                      <p className="text-sm text-gray-600">Manage your notification preferences</p>
                    </div>
                    <Button variant="outline">Settings</Button>
                  </div>
                </div>
              </div>
            </div>  
          )}
        </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}