"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  Play, 
  X,
  Send,
  Image as ImageIcon,
  Video,
  Music,
  User,
  Clock,
  Eye,
  Building
} from "lucide-react"

interface Story {
  id: string
  content: string
  type: 'IMAGE' | 'VIDEO'
  author: {
    id: string
    name: string
    image?: string
  }
  viewsCount: number
  createdAt: string
  expiresAt: string
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
  isLiked: boolean
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
  comments: Comment[]
}

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    image?: string
  }
  chatRoom: {
    id: string
    name?: string
    type: 'DIRECT' | 'GROUP'
  }
  isRead: boolean
  createdAt: string
}

export default function DashboardHomePage() {
  const [stories, setStories] = useState<Story[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [commentingOn, setCommentingOn] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [storiesRes, postsRes, messagesRes] = await Promise.all([
        fetch('/api/stories'),
        fetch('/api/posts'),
        fetch('/api/messages/recent')
      ])

      const [storiesData, postsData, messagesData] = await Promise.all([
        storiesRes.json(),
        postsRes.json(),
        messagesRes.json()
      ])

      setStories(storiesData.stories || [])
      setPosts(postsData.posts || [])
      setMessages(messagesData.messages || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment })
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: [...post.comments, newCommentData.comment],
                commentsCount: post.commentsCount + 1
              }
            : post
        ))
        setNewComment("")
        setCommentingOn(null)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleViewStory = async (storyId: string) => {
    try {
      await fetch(`/api/stories/${storyId}/view`, { method: 'POST' })
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, viewsCount: story.viewsCount + 1 }
          : story
      ))
    } catch (error) {
      console.error('Error viewing story:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white antialiased">
        <Header />
        <main className="pt-24">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Dashboard Home</h1>
              <Link href="/mini-office">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Building className="w-4 h-4 mr-2" />
                  Mini Office
                </Button>
              </Link>
            </div>
          </div>

          {/* Stories Carousel */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Stories</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story)
                    handleViewStory(story.id)
                  }}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black p-0.5">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        {story.author.image ? (
                          <img 
                            src={story.author.image} 
                            alt={story.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 text-center truncate max-w-20">
                    {story.author.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
            {posts.map((post) => (
              <div key={post.id} className="bg-white/5 rounded-xl overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-black p-0.5">
                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                          {post.author.image ? (
                            <img 
                              src={post.author.image} 
                              alt={post.author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{post.author.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-full">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Post Content */}
                {post.images.length > 0 && (
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {post.audioUrl && (
                  <div className="p-4 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{post.audioTitle}</p>
                        <p className="text-sm text-gray-400">Audio Post</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Caption */}
                <div className="p-4">
                  <p className="text-white">{post.caption}</p>
                </div>

                {/* Post Actions */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-2 ${
                        post.isLiked ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likesCount}</span>
                    </button>
                    <button
                      onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.commentsCount}</span>
                    </button>
                    <button className="text-gray-400 hover:text-green-400">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {post.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <span className="font-semibold text-white text-sm">
                            {comment.author.name}
                          </span>
                          <span className="text-gray-300 text-sm">{comment.content}</span>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <button className="text-gray-400 text-sm hover:text-white">
                          View all {post.comments.length} comments
                        </button>
                      )}
                    </div>
                  )}

                  {/* Add Comment */}
                  {commentingOn === post.id && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <Button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Messages Bar */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Messages</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black p-0.5">
                      <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        {message.sender.image ? (
                          <img 
                            src={message.sender.image} 
                            alt={message.sender.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 text-center truncate max-w-16">
                    {message.sender.name}
                  </p>
                  {!message.isRead && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="aspect-[9/16] bg-gray-800 flex items-center justify-center">
              {selectedStory.type === 'VIDEO' ? (
                <Video className="w-16 h-16 text-gray-400" />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-400" />
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-black p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                      {selectedStory.author.image ? (
                        <img 
                          src={selectedStory.author.image} 
                          alt={selectedStory.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{selectedStory.author.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(selectedStory.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{selectedStory.viewsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
