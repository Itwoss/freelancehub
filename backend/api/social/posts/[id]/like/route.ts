import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const postId = params.id

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user.id,
        postId: postId
      }
    })

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id }
      })

      // Update like count
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      })

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Post unliked'
      })
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      })

      // Update like count
      await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      })

      return NextResponse.json({
        success: true,
        liked: true,
        message: 'Post liked'
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


