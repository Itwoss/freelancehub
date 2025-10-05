'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Send, 
  Image, 
  FileText, 
  Users, 
  Settings,
  Plus,
  Mic,
  MoreVertical,
  ArrowLeft,
  Crown,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  content: string
  type: 'text' | 'image' | 'file'
  sender: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  timestamp: Date
  isAdmin: boolean
}

interface ChatGroup {
  id: string
  name: string
  description: string
  memberCount: number
  isAdmin: boolean
  isActive: boolean
  lastMessage?: ChatMessage
  unreadCount?: number
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('admin-main')
  const [isUploading, setIsUploading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([
    {
      id: 'admin-main',
      name: 'FreelanceHub Updates',
      description: 'Official announcements and updates',
      memberCount: 1250,
      isAdmin: true,
      isActive: true,
      unreadCount: 3,
      lastMessage: {
        id: '1',
        content: 'Welcome to FreelanceHub! Check out our latest updates and new features.',
        type: 'text',
        sender: {
          id: 'admin',
          name: 'FreelanceHub Admin',
          role: 'ADMIN'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isAdmin: true
      }
    },
    {
      id: 'admin-announcements',
      name: 'Announcements',
      description: 'Important updates and news',
      memberCount: 1250,
      isAdmin: true,
      isActive: true,
      unreadCount: 1,
      lastMessage: {
        id: '2',
        content: 'New payment system is now live!',
        type: 'text',
        sender: {
          id: 'admin',
          name: 'Admin',
          role: 'ADMIN'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isAdmin: true
      }
    },
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General chat for all users',
      memberCount: 1250,
      isAdmin: false,
      isActive: true,
      lastMessage: {
        id: '3',
        content: 'Hey everyone! How is your day going?',
        type: 'text',
        sender: {
          id: 'user1',
          name: 'John Doe',
          role: 'USER'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isAdmin: false
      }
    },
    {
      id: 'freelancers',
      name: 'Freelancers Hub',
      description: 'Connect with other freelancers',
      memberCount: 850,
      isAdmin: false,
      isActive: true,
      lastMessage: {
        id: '4',
        content: 'Looking for a React developer for a project',
        type: 'text',
        sender: {
          id: 'user2',
          name: 'Sarah Wilson',
          role: 'USER'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        isAdmin: false
      }
    }
  ])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status, router])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      type: 'text',
      sender: {
        id: session?.user?.id || 'user',
        name: session?.user?.name || 'You',
        role: 'USER'
      },
      timestamp: new Date(),
      isAdmin: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    toast.success('Message sent')
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    
    setTimeout(() => {
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        sender: {
          id: session?.user?.id || 'user',
          name: session?.user?.name || 'You',
          role: 'USER'
        },
        timestamp: new Date(),
        isAdmin: false
      }

      setMessages(prev => [...prev, message])
      setIsUploading(false)
      toast.success('File uploaded')
    }, 1000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const selectedGroupData = chatGroups.find(g => g.id === selectedGroup)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Chat</h1>
              <p className="text-sm text-gray-400">Connect with the community</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:bg-gray-800 lg:hidden"
            >
              <Users className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Chat Groups */}
        <div className={`w-80 bg-gray-900 border-r border-gray-800 flex flex-col fixed lg:relative z-50 lg:z-auto h-full ${isSidebarOpen ? 'flex' : 'hidden'} lg:flex`}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold mb-2">Chat Groups</h2>
            <p className="text-sm text-gray-400">Select a group to join</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group.id)
                  setIsSidebarOpen(false)
                }}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedGroup === group.id ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{group.name}</h3>
                    {group.isAdmin && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {group.unreadCount && group.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {group.unreadCount}
                      </span>
                    )}
                    <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
                      {group.memberCount}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2">{group.description}</p>
                {group.lastMessage && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">{group.lastMessage.sender.name}:</span>{' '}
                    {group.lastMessage.content.substring(0, 30)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedGroupData?.isAdmin ? 'bg-yellow-600' : 'bg-blue-600'
              }`}>
                {selectedGroupData?.isAdmin ? (
                  <Crown className="w-4 h-4 text-white" />
                ) : (
                  <Users className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">
                    {selectedGroupData?.name}
                  </h2>
                  {selectedGroupData?.isAdmin && (
                    <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                      Official
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {selectedGroupData?.memberCount} members
                  {selectedGroupData?.isAdmin && ' • Admin messages'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedGroupData?.lastMessage && (
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedGroupData.lastMessage.isAdmin ? 'bg-yellow-600' : 'bg-blue-600'
                }`}>
                  {selectedGroupData.lastMessage.isAdmin ? (
                    <Crown className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-sm font-bold">U</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {selectedGroupData.lastMessage.sender.name}
                    </span>
                    {selectedGroupData.lastMessage.isAdmin && (
                      <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {selectedGroupData.lastMessage.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`rounded-lg p-3 max-w-md ${
                    selectedGroupData.lastMessage.isAdmin 
                      ? 'bg-yellow-900/20 border border-yellow-600/30' 
                      : 'bg-gray-800'
                  }`}>
                    <p className="text-sm">{selectedGroupData.lastMessage.content}</p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">U</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.sender.name}</span>
                    <span className="text-xs text-gray-400">You</span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 max-w-md">
                    {message.type === 'image' ? (
                      <div className="space-y-2">
                        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Image className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ) : message.type === 'file' ? (
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-sm">{message.content}</span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-gray-900 border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
              >
                <Mic className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              {selectedGroupData?.isAdmin 
                ? 'This is an official admin group. Only admins can send messages.'
                : 'Messages will be sent to all members in this group'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}