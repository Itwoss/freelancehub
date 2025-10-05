'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/session-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { 
  Send, 
  Image, 
  FileText, 
  Users, 
  Settings,
  Plus,
  Mic,
  MoreVertical,
  ArrowLeft
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

interface AdminGroup {
  id: string
  name: string
  description: string
  memberCount: number
  isActive: boolean
  lastMessage?: ChatMessage
}

export default function AdminChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('main')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'image' | 'file' | 'text'>('text')
  const [adminGroups, setAdminGroups] = useState<AdminGroup[]>([
    {
      id: 'main',
      name: 'Main Group',
      description: 'All users can see this content',
      memberCount: 1250,
      isActive: true,
      lastMessage: {
        id: '1',
        content: 'Welcome to FreelanceHub! Check out our latest updates.',
        type: 'text',
        sender: {
          id: 'admin',
          name: 'Admin',
          role: 'ADMIN'
        },
        timestamp: new Date(),
        isAdmin: true
      }
    },
    {
      id: 'announcements',
      name: 'Announcements',
      description: 'Important updates and news',
      memberCount: 1250,
      isActive: true
    },
    {
      id: 'promotions',
      name: 'Promotions',
      description: 'Special offers and deals',
      memberCount: 1250,
      isActive: true
    }
  ])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }
  }, [status, session, router])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      type: 'text',
      sender: {
        id: session?.user?.id || 'admin',
        name: session?.user?.name || 'Admin',
        role: 'ADMIN'
      },
      timestamp: new Date(),
      isAdmin: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Simulate sending to all users
    toast.success('Message sent to all users in main group')
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    
    // Simulate file upload
    setTimeout(() => {
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        sender: {
          id: session?.user?.id || 'admin',
          name: session?.user?.name || 'Admin',
          role: 'ADMIN'
        },
        timestamp: new Date(),
        isAdmin: true
      }

      setMessages(prev => [...prev, message])
      setIsUploading(false)
      toast.success('File uploaded and sent to all users')
    }, 1000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return null
  }

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
              <h1 className="text-lg font-semibold">Admin Chat</h1>
              <p className="text-sm text-gray-400">Manage group communications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Admin Groups */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold mb-2">Admin Groups</h2>
            <p className="text-sm text-gray-400">Select group to manage</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {adminGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedGroup === group.id ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{group.name}</h3>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    {group.memberCount}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{group.description}</p>
                {group.lastMessage && (
                  <div className="text-xs text-gray-500">
                    Last: {group.lastMessage.content.substring(0, 30)}...
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Section */}
          <div className="p-4 border-t border-gray-800">
            <h3 className="font-medium mb-3">Upload Content</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-white border-gray-700 hover:bg-gray-800"
                onClick={() => setUploadType('image')}
              >
                <Image className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-white border-gray-700 hover:bg-gray-800"
                onClick={() => setUploadType('file')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">A</span>
              </div>
              <div>
                <h2 className="font-semibold">
                  {adminGroups.find(g => g.id === selectedGroup)?.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {adminGroups.find(g => g.id === selectedGroup)?.memberCount} members
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">A</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.sender.name}</span>
                    <span className="text-xs text-gray-400">Admin</span>
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
                  input.accept = uploadType === 'image' ? 'image/*' : '*'
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
              Messages will be sent to all users in the selected group
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
