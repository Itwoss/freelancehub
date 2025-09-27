'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Smile,
  Paperclip,
  Coins,
  MessageSquare,
  Users,
  Heart
} from 'lucide-react'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', content: 'Hey! I saw your latest project, it looks amazing!', time: '2:30 PM', avatar: 'SJ' },
    { id: 2, sender: 'me', content: 'Thank you! I\'m really proud of how it turned out.', time: '2:32 PM', avatar: 'Me' },
    { id: 3, sender: 'other', content: 'Would you be interested in collaborating on a similar project?', time: '2:35 PM', avatar: 'SJ' },
    { id: 4, sender: 'me', content: 'Absolutely! I\'d love to hear more about it.', time: '2:36 PM', avatar: 'Me' },
    { id: 5, sender: 'other', content: 'Great! Let me send you the details...', time: '2:38 PM', avatar: 'SJ' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [dailyLimit, setDailyLimit] = useState(3)
  const [maxDaily, setMaxDaily] = useState(5)
  const [coins, setCoins] = useState(150)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleSendMessage = () => {
    if (newMessage.trim() && dailyLimit < maxDaily) {
      const message = {
        id: messages.length + 1,
        sender: 'me',
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'Me'
      }
      setMessages([...messages, message])
      setNewMessage('')
      setDailyLimit(dailyLimit + 1)
    }
  }

  const buyMoreMessages = () => {
    // This would integrate with payment system
    setCoins(coins - 50)
    setMaxDaily(maxDaily + 5)
    setDailyLimit(0)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard?tab=chat">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div>
                  <h1 className="font-semibold text-white">Sarah Johnson</h1>
                  <p className="text-sm text-gray-400">UI/UX Designer • Online</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Daily Limit Indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400">{dailyLimit}/{maxDaily}</span>
              </div>
              
              {/* Coins */}
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">{coins}</span>
              </div>
              
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-3 max-w-xs lg:max-w-md ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.sender === 'other' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{message.avatar}</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'me' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-white/10 text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {message.time}
                  </p>
                </div>
                {message.sender === 'me' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{message.avatar}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {dailyLimit >= maxDaily ? (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Daily limit reached!</h4>
                    <p className="text-sm text-gray-300">Buy more messages to continue chatting</p>
                  </div>
                </div>
                <Button 
                  onClick={buyMoreMessages}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Buy 5 More Messages
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button 
                  variant="outline" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 border-white/20 text-white hover:bg-white/10"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || dailyLimit >= maxDaily}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
