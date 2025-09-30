'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { useMenuContrast } from '@/lib/hooks/useDynamicContrast'
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
  Search,
  ArrowRight
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
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  
  // Get dynamic contrast colors for sidebar
  const menuContrast = useMenuContrast(sidebarRef)

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
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          <div className="w-64 bg-black/90 backdrop-blur-sm border-r border-white/10 min-h-screen">
            <div className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 bg-white/20 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/20 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-96 bg-white/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'My Projects',
      value: projects.length,
      icon: Briefcase,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'My Posts',
      value: myPosts.length,
      icon: MessageSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'My Stories',
      value: myStories.length,
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'orders', label: 'Orders', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    ...(session?.user?.role === 'ADMIN' ? [
      { id: 'admin-chat', label: 'Admin Chat', icon: MessageSquare, href: '/admin/chat' }
    ] : []),
    { id: 'content', label: 'My Content', icon: BookOpen },
    { id: 'feed', label: 'Social Feed', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Left Sidebar */}
        <div ref={sidebarRef} className="w-64 bg-black/90 backdrop-blur-sm border-r border-white/10 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold" style={{ color: menuContrast.menuTextColor }}>Dashboard</h2>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const buttonContent = (
                  <>
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </>
                )

                if (tab.href) {
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300"
                      style={{
                        color: menuContrast.menuTextColorSubtle,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = menuContrast.menuHoverTextColor
                        e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = menuContrast.menuTextColorSubtle
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      {buttonContent}
                    </Link>
                  )
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300"
                    style={{
                      color: isActive ? '#ffffff' : menuContrast.menuTextColorSubtle,
                      backgroundColor: isActive 
                        ? 'linear-gradient(to right, #f97316, #ef4444)' 
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = menuContrast.menuHoverTextColor
                        e.currentTarget.style.backgroundColor = menuContrast.menuHoverBackground
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = menuContrast.menuTextColorSubtle
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {buttonContent}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-300">
            Manage your projects, track orders, and grow your freelance business.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
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
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/projects/create">
                    <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Project
                    </Button>
                  </Link>
                  <Link href="/mini-office/create-post">
                    <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Link href="/mini-office/create-story">
                    <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                      <Heart className="w-4 h-4 mr-2" />
                      Add Story
                    </Button>
                  </Link>
                  <Link href="/projects">
                    <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Projects
                    </Button>
                  </Link>
                  <Link href="/mini-office/feed">
                    <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                      <Users className="w-4 h-4 mr-2" />
                      View Feed
                    </Button>
                  </Link>
                  <Link href="/dashboard?tab=settings">
                    <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
                  <Link href="/dashboard?tab=projects">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">View All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                        {/* Project Image */}
                        <div className="relative h-32 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          {project.images.length > 0 ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center text-white">
                              <Briefcase className="w-12 h-12 mx-auto mb-1 opacity-80" />
                              <p className="text-xs opacity-80">Project</p>
                            </div>
                          )}
                          
                          {/* Hover Arrow Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                              <ArrowRight className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Project Title */}
                        <div className="p-4">
                          <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                            {project.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">My Projects</h3>
                  <p className="text-gray-300">Manage and showcase your freelance projects</p>
                </div>
                <Link href="/projects/create">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                      {/* Project Image */}
                      <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        {project.images.length > 0 ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center text-white">
                            <Briefcase className="w-16 h-16 mx-auto mb-2 opacity-80" />
                            <p className="text-sm opacity-80">Project Image</p>
                          </div>
                        )}
                        
                        {/* Hover Arrow Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
                            <ArrowRight className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Title */}
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                          {project.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">My Orders</h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{order.project.title}</h4>
                      <p className="text-sm text-gray-400">Order #{order.id.slice(-8)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-orange-400">${order.totalAmount}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' :
                        order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Reviews & Ratings</h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">{review.project.title}</h4>
                        <p className="text-sm text-gray-400">by {review.reviewer.name}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{review.comment}</p>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-8">
              {/* Chat Header with Daily Limit */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Chat & Connect</h3>
                    <p className="text-gray-300">Find people, make friends, and start conversations</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Daily Messages</div>
                    <div className="text-2xl font-bold text-orange-400">3/5</div>
                    <div className="text-xs text-gray-400">2 remaining</div>
                  </div>
                </div>
                
                {/* Coins and Purchase */}
                <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">💰</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">Your Coins</div>
                      <div className="text-lg font-bold text-orange-400">150</div>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <Link href="/chat/purchase">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                      Buy More Messages
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Find People Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-white">Find People</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample People Cards */}
                  {[
                    { name: 'Sarah Johnson', role: 'UI/UX Designer', avatar: 'SJ', skills: ['Figma', 'Adobe XD'], mutual: 2 },
                    { name: 'Mike Chen', role: 'Full Stack Developer', avatar: 'MC', skills: ['React', 'Node.js'], mutual: 5 },
                    { name: 'Emily Davis', role: 'Marketing Specialist', avatar: 'ED', skills: ['SEO', 'Content'], mutual: 1 },
                    { name: 'Alex Wilson', role: 'Graphic Designer', avatar: 'AW', skills: ['Photoshop', 'Illustrator'], mutual: 3 },
                    { name: 'Lisa Brown', role: 'Product Manager', avatar: 'LB', skills: ['Strategy', 'Analytics'], mutual: 4 },
                    { name: 'David Lee', role: 'Backend Developer', avatar: 'DL', skills: ['Python', 'Django'], mutual: 2 }
                  ].map((person, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{person.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{person.name}</h5>
                          <p className="text-sm text-gray-400">{person.role}</p>
                          <p className="text-xs text-orange-400">{person.mutual} mutual connections</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {person.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href="/chat" className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Conversations */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-6">Recent Conversations</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Sarah Johnson', lastMessage: 'Hey! I saw your latest project, it looks amazing!', time: '2m ago', unread: 2 },
                    { name: 'Mike Chen', lastMessage: 'Thanks for the feedback on my design', time: '1h ago', unread: 0 },
                    { name: 'Emily Davis', lastMessage: 'Let\'s collaborate on that marketing campaign', time: '3h ago', unread: 1 },
                    { name: 'Alex Wilson', lastMessage: 'The logo design is ready for review', time: '1d ago', unread: 0 }
                  ].map((conversation, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{conversation.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-semibold text-white">{conversation.name}</h5>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{conversation.unread}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-1">{conversation.lastMessage}</p>
                      </div>
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
    </div>
  )
}