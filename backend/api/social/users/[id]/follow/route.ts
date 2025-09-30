import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const followSchema = z.object({
  action: z.enum(['follow', 'unfollow'])
})

export async function POST(
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

    const body = await request.json()
    const { action } = followSchema.parse(body)
    const targetUserId = params.id

    if (session.user.id === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (action === 'follow') {
      // Create follow relationship
      await prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: targetUserId
          }
        },
        update: {},
        create: {
          followerId: session.user.id,
          followingId: targetUserId
        }
      })

      // Update follower counts
      await Promise.all([
        prisma.user.update({
          where: { id: session.user.id },
          data: { followingCount: { increment: 1 } }
        }),
        prisma.user.update({
          where: { id: targetUserId },
          data: { followersCount: { increment: 1 } }
        })
      ])
    } else {
      // Remove follow relationship
      await prisma.follow.deleteMany({
        where: {
          followerId: session.user.id,
          followingId: targetUserId
        }
      })

      // Update follower counts
      await Promise.all([
        prisma.user.update({
          where: { id: session.user.id },
          data: { followingCount: { decrement: 1 } }
        }),
        prisma.user.update({
          where: { id: targetUserId },
          data: { followersCount: { decrement: 1 } }
        })
      ])
    }

    return NextResponse.json({
      success: true,
      action,
      message: action === 'follow' ? 'Following user' : 'Unfollowed user'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating follow status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


