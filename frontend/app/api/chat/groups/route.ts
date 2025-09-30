import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock data for chat groups
const mockChatGroups = [
  {
    id: 'admin-main',
    name: 'FreelanceHub Updates',
    description: 'Official announcements and updates from FreelanceHub',
    memberCount: 1250,
    isAdmin: true,
    isActive: true,
    unreadCount: 3,
    lastMessage: {
      id: '1',
      content: 'Welcome to FreelanceHub! We have exciting new features coming soon.',
      type: 'text',
      sender: {
        id: 'admin',
        name: 'FreelanceHub Admin',
        role: 'ADMIN'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
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
      content: 'New payment system is now live! Check it out.',
      type: 'text',
      sender: {
        id: 'admin',
        name: 'Admin',
        role: 'ADMIN'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isAdmin: true
    }
  },
  {
    id: 'admin-promotions',
    name: 'Promotions',
    description: 'Special offers and deals',
    memberCount: 1250,
    isAdmin: true,
    isActive: true,
    unreadCount: 0,
    lastMessage: {
      id: '3',
      content: 'Get 20% off on your first project! Use code WELCOME20',
      type: 'text',
      sender: {
        id: 'admin',
        name: 'Admin',
        role: 'ADMIN'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
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
    unreadCount: 5,
    lastMessage: {
      id: '4',
      content: 'Hey everyone! How is your day going?',
      type: 'text',
      sender: {
        id: 'user1',
        name: 'John Doe',
        role: 'USER'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
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
    unreadCount: 2,
    lastMessage: {
      id: '5',
      content: 'Looking for a React developer for a project',
      type: 'text',
      sender: {
        id: 'user2',
        name: 'Sarah Wilson',
        role: 'USER'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isAdmin: false
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return admin groups first, then regular groups
    const adminGroups = mockChatGroups.filter(group => group.isAdmin)
    const regularGroups = mockChatGroups.filter(group => !group.isAdmin)
    
    const sortedGroups = [...adminGroups, ...regularGroups]

    return NextResponse.json({
      groups: sortedGroups,
      total: sortedGroups.length
    })
  } catch (error) {
    console.error('Get chat groups error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
