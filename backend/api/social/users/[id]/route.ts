import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          where: { isApproved: true, isPublic: true },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            likes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        stories: {
          where: { isApproved: true, isPublic: true },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            posts: true,
            stories: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if current user is following this user
    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: session.user.id,
        followingId: userId
      }
    })

    // Use actual social data from database
    const userWithSocialData = {
      ...user,
      isVerified: user.isVerified || false,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      canPost: user.canPost || false,
      canChat: user.canChat || false
    }

    return NextResponse.json({
      user: userWithSocialData,
      isFollowing: !!isFollowing
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
