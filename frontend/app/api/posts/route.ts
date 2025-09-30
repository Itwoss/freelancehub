import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: {
        isPublic: true,
        isApproved: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likes: {
          where: {
            userId: session.user.id
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
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    // Transform the data to include isLiked flag
    const transformedPosts = posts.map(post => ({
      ...post,
      isLiked: post.likes.length > 0
    }))

    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, caption, images, audioUrl, audioTitle } = body

    if (!caption) {
      return NextResponse.json(
        { error: 'Caption is required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        caption,
        images: images || [],
        audioUrl,
        audioTitle,
        authorId: session.user.id,
        isPublic: true,
        isApproved: true // Auto-approve for now
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
