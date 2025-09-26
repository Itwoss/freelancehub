import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    switch (filter) {
      case 'verified':
        where.isVerified = true
        break
      case 'canPost':
        where.canPost = true
        break
      case 'canChat':
        where.canChat = true
        break
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              posts: true,
              stories: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Add social data from database
    const usersWithSocialData = users.map(user => ({
      ...user,
      isVerified: user.isVerified || false,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      canPost: user.canPost || false,
      canChat: user.canChat || false,
      _count: {
        posts: user._count.posts || 0,
        stories: user._count.stories || 0
      }
    }))

    return NextResponse.json({
      users: usersWithSocialData,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
