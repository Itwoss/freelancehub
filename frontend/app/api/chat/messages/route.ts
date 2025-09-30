import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data for chat messages
const mockMessages = [
  {
    id: '1',
    content: 'Welcome to FreelanceHub! We have exciting new features coming soon.',
    type: 'text',
    sender: {
      id: 'admin',
      name: 'FreelanceHub Admin',
      role: 'ADMIN'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isAdmin: true,
    groupId: 'admin-main'
  },
  {
    id: '2',
    content: 'New payment system is now live! Check it out.',
    type: 'text',
    sender: {
      id: 'admin',
      name: 'Admin',
      role: 'ADMIN'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isAdmin: true,
    groupId: 'admin-announcements'
  },
  {
    id: '3',
    content: 'Get 20% off on your first project! Use code WELCOME20',
    type: 'text',
    sender: {
      id: 'admin',
      name: 'Admin',
      role: 'ADMIN'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAdmin: true,
    groupId: 'admin-promotions'
  },
  {
    id: '4',
    content: 'Hey everyone! How is your day going?',
    type: 'text',
    sender: {
      id: 'user1',
      name: 'John Doe',
      role: 'USER'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isAdmin: false,
    groupId: 'general'
  },
  {
    id: '5',
    content: 'Looking for a React developer for a project',
    type: 'text',
    sender: {
      id: 'user2',
      name: 'Sarah Wilson',
      role: 'USER'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isAdmin: false,
    groupId: 'freelancers'
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

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    let filteredMessages = mockMessages

    if (groupId) {
      filteredMessages = mockMessages.filter(msg => msg.groupId === groupId)
    }

    // Sort by timestamp (newest first)
    filteredMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    const skip = (page - 1) * limit
    const messages = filteredMessages.slice(skip, skip + limit)

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total: filteredMessages.length,
        pages: Math.ceil(filteredMessages.length / limit)
      }
    })
  } catch (error) {
    console.error('Get chat messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, groupId, type = 'text' } = body

    if (!content || !groupId) {
      return NextResponse.json(
        { error: 'Content and groupId are required' },
        { status: 400 }
      )
    }

    // Create new message
    const newMessage = {
      id: Date.now().toString(),
      content,
      type,
      sender: {
        id: session.user.id,
        name: session.user.name || 'User',
        role: session.user.role || 'USER'
      },
      timestamp: new Date(),
      isAdmin: session.user.role === 'ADMIN',
      groupId
    }

    // In a real app, you would save this to the database
    // For now, we'll just return the message
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Create chat message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
